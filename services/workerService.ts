import {WORKER_CODE} from '../constants';
import {WorkerResponseMessage, OptimizerConfiguration} from '../types';

let workerBlobUrl: string | null = null;
const workerPool: Worker[] = [];

// Track active tasks to allow cancellation
// Maps the Worker instance to its Promise controllers
const activeTasks = new Map<
  Worker,
  {resolve: (val: unknown) => void; reject: (err: unknown) => void}
>();

/**
 * Generates a URL that points to our inline worker code.
 */
const getWorkerBlobUrl = (): string => {
  if (!workerBlobUrl) {
    const blob = new Blob([WORKER_CODE], {type: 'application/javascript'});
    workerBlobUrl = URL.createObjectURL(blob);
  }
  return workerBlobUrl;
};

/**
 * Gets a worker from the recycle bin (pool) or makes a new one.
 */
const getWorkerFromPool = (): Worker => {
  if (workerPool.length > 0) {
    return workerPool.pop()!;
  }
  return new Worker(getWorkerBlobUrl(), {type: 'module'});
};

/**
 * Returns a used worker to the pool so it can process the next image.
 */
const returnWorkerToPool = (worker: Worker): void => {
  worker.onmessage = null;
  worker.onerror = null;
  workerPool.push(worker);
};

/**
 * The main function to process a single file.
 * Wraps the Worker's event-based API in a clean Promise.
 */
export const processImageInWorker = (
  file: File,
  config: OptimizerConfiguration,
): Promise<{buffer: ArrayBuffer; time: number}> => {
  // Executor function must be synchronous. We wrap async logic in an IIFE.
  return new Promise((resolve, reject) => {
    const worker = getWorkerFromPool();

    // Register the task as active
    activeTasks.set(worker, {resolve, reject});

    // Use 'void' to satisfy @typescript-eslint/no-floating-promises
    void (async () => {
      try {
        const buffer = await file.arrayBuffer();

        // Check if cancelled during the async arrayBuffer read
        if (!activeTasks.has(worker)) {
          // Task was cancelled externally.
          return;
        }

        // Listen for the worker's reply
        worker.onmessage = (event: MessageEvent<WorkerResponseMessage>) => {
          const {type, buffer: resBuffer, time, message, details} = event.data;

          if (activeTasks.has(worker)) {
            if (type === 'SUCCESS' && resBuffer) {
              activeTasks.delete(worker);
              resolve({buffer: resBuffer, time: time || 0});
              returnWorkerToPool(worker);
            } else if (type === 'ERROR') {
              activeTasks.delete(worker);
              console.error('[Worker Error Details]:', details);
              reject(new Error(message || 'Unknown worker error'));
              returnWorkerToPool(worker);
            } else if (type === 'LOG') {
              console.debug(message, details);
            }
          }
        };

        // Handle crashes
        worker.onerror = error => {
          if (activeTasks.has(worker)) {
            activeTasks.delete(worker);
            console.error('Worker Global Error', error);
            reject(error);
            worker.terminate(); // Kill dead workers
          }
        };

        // Send data to worker
        worker.postMessage(
          {
            buffer,
            fileType: file.type,
            config,
          },
          [buffer],
        );
      } catch (error) {
        // Only reject/cleanup if we are still considered active
        if (activeTasks.has(worker)) {
          activeTasks.delete(worker);
          reject(error);
          returnWorkerToPool(worker);
        }
      }
    })();
  });
};

/**
 * FORCE STOP
 * Terminates all currently running workers immediately.
 */
export const cancelAllWorkers = () => {
  activeTasks.forEach(({reject}, worker) => {
    worker.terminate(); // Immediately kills the thread
    reject(new Error('Cancelled')); // Unblocks the await in the main thread
  });
  activeTasks.clear();
  // Note: Terminated workers are effectively dead and are NOT returned to the pool.
};
