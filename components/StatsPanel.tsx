import React, {useMemo} from 'react';
import {Clock, Download, Loader2, RotateCcw} from 'lucide-react';
import {clsx} from 'clsx';
import {ImageJob} from '../types';

interface StatsPanelProps {
  completedJobs: ImageJob[];
  onDownloadAll: () => void;
  onDownloadZip: () => void;
  onClearCompleted: () => void;
  isZipping: boolean;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  completedJobs,
  onDownloadAll,
  onDownloadZip,
  onClearCompleted,
  isZipping,
}) => {
  const stats = useMemo(() => {
    let totalOriginal = 0;
    let totalOptimized = 0;

    completedJobs.forEach(job => {
      if (job.stats) {
        totalOriginal += job.stats.originalSize;
        totalOptimized += job.stats.optimizedSize;
      }
    });

    const validIntervals = completedJobs
      .filter(j => j.startedAt && j.completedAt)
      .map(j => ({start: j.startedAt!, end: j.completedAt!}))
      .sort((a, b) => a.start - b.start);

    let totalTime = 0;
    if (validIntervals.length > 0) {
      let currentStart = validIntervals[0].start;
      let currentEnd = validIntervals[0].end;

      for (let i = 1; i < validIntervals.length; i++) {
        const next = validIntervals[i];
        if (next.start < currentEnd) {
          currentEnd = Math.max(currentEnd, next.end);
        } else {
          totalTime += currentEnd - currentStart;
          currentStart = next.start;
          currentEnd = next.end;
        }
      }
      totalTime += currentEnd - currentStart;
    }

    if (totalOriginal === 0)
      return {percent: '0', isIncrease: false, savedBytes: 0, totalTime: 0};

    const diff = totalOriginal - totalOptimized;
    const percentVal = (diff / totalOriginal) * 100;

    return {
      percent: Math.abs(percentVal).toFixed(1),
      isIncrease: percentVal < 0,
      savedBytes: diff,
      totalTime,
    };
  }, [completedJobs]);

  return (
    <div className="sticky top-6 space-y-6 z-20 transition-all duration-300 ease-out">
      <div className="bg-gleam-dark text-gleam-cream rounded-3xl p-8 shadow-xl relative overflow-hidden ring-4 ring-black/5 group transition-transform duration-300 dark:ring-white/5 dark:bg-black">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gleam-pink/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

        <div className="relative z-10 pt-2">
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
              <div className="text-5xl font-display font-bold text-white mb-2">
                {completedJobs.length}
              </div>
              <div className="text-sm font-bold uppercase tracking-wider opacity-40">
                Processed
              </div>
            </div>

            {completedJobs.length > 0 && (
              <div>
                <div
                  className={clsx(
                    'text-5xl font-display font-bold mb-2',
                    stats.isIncrease ? 'text-orange-400' : 'text-gleam-pink',
                  )}
                >
                  {stats.isIncrease ? '+' : ''}
                  {stats.percent}
                  <span className="text-2xl">%</span>
                </div>
                <div className="text-sm font-bold uppercase tracking-wider opacity-40">
                  {stats.isIncrease ? 'Increase' : 'Saved'}
                </div>
              </div>
            )}
          </div>

          {completedJobs.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gleam-pink" />
                Total Time
              </span>
              <span className="text-2xl font-display font-bold text-white">
                {stats.totalTime < 1000
                  ? `${Math.round(stats.totalTime)}ms`
                  : `${(stats.totalTime / 1000).toFixed(1)}s`}
              </span>
            </div>
          )}

          {completedJobs.length === 0 && <div className="h-4"></div>}
        </div>
      </div>

      {completedJobs.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={onDownloadAll}
            className={clsx(
              'w-full py-4 rounded-2xl bg-gleam-pink text-gleam-dark font-display font-bold text-lg shadow-[0_0_20px_-5px_rgba(255,175,243,0.5)] hover:shadow-[0_0_30px_-5px_rgba(255,175,243,0.7)] hover:bg-white hover:text-pink-600 hover:-translate-y-1 transition-all duration-300 ease-out active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2 outline-none focus-visible:ring-4 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gleam-dark',
            )}
          >
            <Download className="w-5 h-5" />
            {completedJobs.length > 1 ? 'Download All' : 'Download File'}
          </button>

          {completedJobs.length > 1 && (
            <button
              onClick={onDownloadZip}
              disabled={isZipping}
              className={clsx(
                'w-full py-3 rounded-2xl bg-gleam-dark text-white font-display font-bold text-lg shadow-lg hover:shadow-xl hover:bg-gleam-purple hover:-translate-y-1 transition-all duration-300 ease-out active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2 outline-none focus-visible:ring-4 focus-visible:ring-purple-400 focus-visible:ring-offset-2',
                isZipping && 'opacity-75 cursor-wait',
              )}
            >
              {isZipping ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Zipping...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download ZIP
                </>
              )}
            </button>
          )}

          <button
            onClick={onClearCompleted}
            className="w-full py-3 rounded-xl bg-white border-2 border-transparent hover:border-red-100 text-gray-400 hover:text-red-500 hover:bg-red-50 font-bold transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-red-100 dark:bg-dark-card dark:hover:bg-red-900/20 dark:border-dark-border"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            Clear Completed
          </button>
        </div>
      )}
    </div>
  );
};
