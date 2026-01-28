import React, {useRef, useState, useEffect, memo} from 'react';
import {ImagePlus, Star} from 'lucide-react';
import {clsx} from 'clsx';

interface DropzoneProps {
  onFilesAdded: (files: File[]) => void;
  isProcessing: boolean;
  compact?: boolean;
}

const DropzoneComponent = ({
  onFilesAdded,
  isProcessing,
  compact,
}: DropzoneProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragCounter = useRef(0);

  const isValidFile = (file: File) => {
    return (
      file.type.startsWith('image/') ||
      file.type === 'application/zip' ||
      file.type === 'application/x-zip-compressed' ||
      file.name.endsWith('.zip') ||
      file.name.endsWith('.svg')
    );
  };

  useEffect(() => {
    const handleWindowDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current += 1;
      if (
        e.dataTransfer?.types &&
        Array.from(e.dataTransfer.types).includes('Files')
      ) {
        setIsDragOver(true);
      }
    };

    const handleWindowDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current -= 1;
      if (dragCounter.current === 0) {
        setIsDragOver(false);
      }
    };

    const handleWindowDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleWindowDrop = async (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsDragOver(false);

      if (e.dataTransfer?.items) {
        const files: File[] = [];
        const MAX_FILES = 100;
        let processedCount = 0;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const traverseFileTree = async (item: any, path?: string) => {
          if (processedCount >= MAX_FILES) return;
          path = path || '';

          if (item.isFile) {
            processedCount++;
            return new Promise<void>(resolve => {
              item.file((file: File) => {
                if (isValidFile(file)) files.push(file);
                resolve();
              });
            });
          } else if (item.isDirectory) {
            const dirReader = item.createReader();
            return new Promise<void>(resolve => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              dirReader.readEntries(async (entries: any[]) => {
                for (const entry of entries) {
                  await traverseFileTree(entry, path + item.name + '/');
                }
                resolve();
              });
            });
          }
        };

        const items = e.dataTransfer.items;
        const promises = [];
        for (let i = 0; i < items.length; i++) {
          const item = items[i].webkitGetAsEntry
            ? items[i].webkitGetAsEntry()
            : items[i];
          if (item) {
            promises.push(traverseFileTree(item));
          }
        }
        await Promise.all(promises);

        if (files.length > 0) onFilesAdded(files);
      } else if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const validFiles = Array.from(e.dataTransfer.files).filter(isValidFile);
        if (validFiles.length > 0) onFilesAdded(validFiles);
      }
    };

    const handleWindowPaste = (e: ClipboardEvent) => {
      const clipboardData = e.clipboardData;
      if (!clipboardData) return;

      const extractedFiles: File[] = [];

      if (clipboardData.items) {
        for (let i = 0; i < clipboardData.items.length; i++) {
          const item = clipboardData.items[i];

          if (item.kind === 'file') {
            const file = item.getAsFile();
            if (
              file &&
              (file.type.startsWith('image/') || file.type.includes('svg'))
            ) {
              if (
                file.name === 'image.png' ||
                file.name.startsWith('Screenshot')
              ) {
                const timestamp = new Date().getTime();
                const ext = file.type.split('/')[1] || 'png';
                const newName = `pasted_${timestamp}_${i}.${ext}`;
                extractedFiles.push(
                  new File([file], newName, {type: file.type}),
                );
              } else {
                extractedFiles.push(file);
              }
            }
          }
        }
      }

      if (extractedFiles.length > 0) {
        e.preventDefault();
        onFilesAdded(extractedFiles);
      }
    };

    window.addEventListener('dragenter', handleWindowDragEnter);
    window.addEventListener('dragleave', handleWindowDragLeave);
    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('drop', handleWindowDrop);
    window.addEventListener('paste', handleWindowPaste);

    return () => {
      window.removeEventListener('dragenter', handleWindowDragEnter);
      window.removeEventListener('dragleave', handleWindowDragLeave);
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('drop', handleWindowDrop);
      window.removeEventListener('paste', handleWindowPaste);
    };
  }, [onFilesAdded]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const validFiles = Array.from<File>(e.target.files).filter(isValidFile);
      onFilesAdded(validFiles);
    }
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleManualPaste = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (!navigator.clipboard || !navigator.clipboard.read) {
        console.warn('Async Clipboard API not supported.');
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const clipboardItems = await (navigator.clipboard as any).read();
      const files: File[] = [];
      let count = 0;

      for (const item of clipboardItems) {
        const imageTypes = (item.types as string[]).filter((type: string) =>
          type.startsWith('image/'),
        );

        if (imageTypes.length > 0) {
          const preferredType =
            imageTypes.find((t: string) => t === 'image/png') ||
            imageTypes.find((t: string) => t === 'image/jpeg') ||
            imageTypes[0];
          try {
            const blob = await item.getType(preferredType);
            const ext = preferredType.split('/')[1] || 'png';
            const timestamp = Date.now();
            const filename = `clipboard_image_${timestamp}_${++count}.${ext}`;
            files.push(new File([blob], filename, {type: preferredType}));
          } catch (err) {
            console.error(`Failed to retrieve type ${preferredType}`, err);
          }
        }
      }

      if (files.length > 0) {
        onFilesAdded(files);
      }
    } catch (err) {
      console.warn('Clipboard read failed', err);
    }
  };

  return (
    <div
      ref={containerRef}
      role="button"
      tabIndex={0}
      aria-label="Upload Images. Drag and drop images here, click to browse, or paste from clipboard."
      onClick={() => inputRef.current?.click()}
      className={clsx(
        'relative cursor-pointer rounded-3xl text-center transition-all duration-200 ease-in-out border-4 border-dashed outline-none focus-visible:ring-4 focus-visible:ring-gleam-pink/50 focus-visible:border-gleam-pink',
        compact ? 'p-6 md:p-8' : 'p-8 md:p-12',
        isDragOver
          ? 'border-gleam-pink bg-pink-50 dark:bg-gleam-pink/10 scale-[1.01]'
          : 'border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-gleam-pink hover:bg-gray-50 dark:hover:bg-slate-800',
      )}
    >
      <input
        type="file"
        multiple
        accept="image/*,.zip,application/zip,application/x-zip-compressed,.svg"
        className="hidden"
        ref={inputRef}
        onChange={handleChange}
        aria-hidden="true"
      />

      <div
        className={clsx(
          'flex items-center justify-center gap-6 relative z-10',
          compact ? 'flex-row' : 'flex-col',
        )}
      >
        <div
          className={clsx(
            'rounded-full flex items-center justify-center transition-transform duration-300 shadow-xl',
            compact ? 'w-14 h-14' : 'w-20 h-20',
            isProcessing
              ? 'animate-spin-slow bg-gleam-pink text-gleam-dark'
              : 'bg-gleam-dark text-gleam-pink dark:bg-white dark:text-gleam-dark',
            isDragOver ? 'scale-105' : 'scale-100',
          )}
          aria-hidden="true"
        >
          {isProcessing ? (
            <Star
              className={
                compact ? 'w-7 h-7 fill-current' : 'w-10 h-10 fill-current'
              }
            />
          ) : (
            <ImagePlus className={compact ? 'w-7 h-7' : 'w-10 h-10'} />
          )}
        </div>

        <div className={clsx('space-y-1', compact && 'text-left')}>
          <h3
            className={clsx(
              'font-display font-bold text-gleam-dark dark:text-white',
              compact ? 'text-2xl' : 'text-3xl md:text-4xl',
            )}
          >
            {isProcessing ? (
              'Crunching pixels...'
            ) : (
              <span className="inline-flex items-baseline flex-wrap gap-x-1 justify-center">
                Drop images, ZIPs or
                <button
                  type="button"
                  onClick={handleManualPaste}
                  className="relative z-20 font-bold text-inherit bg-transparent border-0 p-0 cursor-pointer underline decoration-2 decoration-gleam-pink underline-offset-4 focus:outline-none focus:ring-0"
                  title="Click to paste from clipboard"
                >
                  paste
                </button>
              </span>
            )}
          </h3>
          <p
            className={clsx(
              'font-medium text-gray-500 dark:text-gray-400',
              compact ? 'text-base' : 'text-xl',
            )}
          >
            or click to browse
          </p>
        </div>
      </div>
    </div>
  );
};

export const Dropzone = memo(DropzoneComponent);
