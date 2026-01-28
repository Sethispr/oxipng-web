import React, {useState, useRef, useCallback} from 'react';
import {Plus, Minus} from 'lucide-react';
import {clsx} from 'clsx';

export const CustomSlider = ({
  value,
  min,
  max,
  step = 1,
  onChange,
  labels,
  unit = '',
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  labels?: {label: string; val: number}[];
  unit?: string;
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragPercentage, setDragPercentage] = useState<number | null>(null);

  const calculateValue = useCallback(
    (clientX: number, rect: DOMRect) => {
      const rawPercentage = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width),
      );
      const rawValue = min + rawPercentage * (max - min);
      const steps = Math.round((rawValue - min) / step);
      const steppedValue = min + steps * step;
      const clampedValue = Math.max(min, Math.min(max, steppedValue));
      const precision = step.toString().split('.')[1]?.length || 0;
      const finalValue = Number(clampedValue.toFixed(precision));

      return {finalValue, rawPercentage};
    },
    [min, max, step],
  );

  const handleDecrement = () => {
    const precision = step.toString().split('.')[1]?.length || 0;
    const nextVal = Math.max(min, value - step);
    onChange(Number(nextVal.toFixed(precision)));
  };

  const handleIncrement = () => {
    const precision = step.toString().split('.')[1]?.length || 0;
    const nextVal = Math.min(max, value + step);
    onChange(Number(nextVal.toFixed(precision)));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) onChange(val);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);

    const rect = target.getBoundingClientRect();
    const {finalValue, rawPercentage} = calculateValue(e.clientX, rect);

    setDragPercentage(rawPercentage * 100);
    onChange(finalValue);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const target = e.currentTarget as HTMLElement;
    if (target.hasPointerCapture(e.pointerId)) {
      const rect = target.getBoundingClientRect();
      const {finalValue, rawPercentage} = calculateValue(e.clientX, rect);

      setDragPercentage(rawPercentage * 100);
      onChange(finalValue);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setDragPercentage(null);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const displayPercentage =
    dragPercentage !== null
      ? dragPercentage
      : Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className="relative py-2 select-none touch-none">
      <div className="flex items-center gap-2 md:gap-4 mb-6 md:mb-8">
        <button
          onClick={handleDecrement}
          className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-sky-500/50 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-sky-400 transition-colors shadow-sm active:scale-95 touch-manipulation"
        >
          <Minus className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <div
          className="flex-1 relative h-12 md:h-14 flex items-center touch-none group isolate cursor-pointer"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <div
            className="absolute inset-0 -top-4 -bottom-4 z-10 cursor-ew-resize"
            ref={trackRef}
          />
          <div className="absolute w-full h-3 md:h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden pointer-events-none">
            <div
              className="h-full bg-indigo-500 dark:bg-sky-500"
              style={{
                width: `${displayPercentage}%`,
                transition:
                  dragPercentage !== null
                    ? 'none'
                    : 'width 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
            />
          </div>
          <div
            className={clsx(
              'absolute w-6 h-6 md:w-8 md:h-8 bg-white border-4 border-indigo-500 dark:border-sky-500 rounded-full shadow-lg pointer-events-none z-20 flex items-center justify-center',
              dragPercentage !== null
                ? 'scale-110 shadow-indigo-500/30 dark:shadow-sky-500/30'
                : 'group-hover:scale-110',
            )}
            style={{
              left: `${displayPercentage}%`,
              transform: 'translate(-50%, 0)',
              transition:
                dragPercentage !== null
                  ? 'none'
                  : 'left 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
          >
            {dragPercentage !== null && (
              <div className="absolute -top-10 md:-top-12 bg-indigo-900 dark:bg-sky-600 text-white font-bold text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5 rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-2 whitespace-nowrap z-30">
                {value}
                {unit}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-indigo-900 dark:border-t-sky-600" />
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleIncrement}
          className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-sky-500/50 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-sky-400 transition-colors shadow-sm active:scale-95 touch-manipulation"
        >
          <Plus className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <div className="min-w-[4rem] md:min-w-[5rem] bg-indigo-50 dark:bg-sky-500/10 rounded-xl border border-indigo-100 dark:border-sky-500/20 flex items-center focus-within:ring-2 focus-within:ring-indigo-300 dark:focus-within:ring-sky-500/50 focus-within:border-indigo-300 dark:focus-within:border-sky-500 transition-all">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleInputChange}
            className="w-full bg-transparent text-center font-display font-bold text-xl md:text-2xl text-indigo-900 dark:text-sky-100 outline-none py-2 px-1 appearance-none"
          />
          {unit && (
            <span className="pr-2 md:pr-3 text-xs md:text-sm font-bold text-indigo-400 dark:text-sky-400 select-none -ml-1">
              {unit}
            </span>
          )}
        </div>
      </div>

      {labels && (
        <div className="flex justify-between px-2">
          {labels.map((l, i) => (
            <button
              key={i}
              onClick={() => onChange(l.val)}
              className={clsx(
                'flex flex-col items-center gap-1 group transition-all touch-manipulation cursor-pointer',
                Math.abs(value - l.val) < (max - min) / (labels.length * 2.5)
                  ? 'opacity-100 scale-105'
                  : 'opacity-50 hover:opacity-80',
              )}
            >
              <div
                className={clsx(
                  'w-1.5 h-1.5 rounded-full mb-1',
                  Math.abs(value - l.val) < (max - min) / (labels.length * 2.5)
                    ? 'bg-indigo-500 dark:bg-sky-500'
                    : 'bg-slate-300 dark:bg-slate-600',
                )}
              />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-sky-400">
                {l.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
