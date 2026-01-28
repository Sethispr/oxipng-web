import React, {useCallback} from 'react';
import {clsx} from 'clsx';
import {
  LayoutTemplate,
  Scaling,
  Lock,
  Unlock,
  Check,
  ChevronRight,
} from 'lucide-react';
import {
  OptimizerConfiguration,
  ResizeConfiguration,
  ResizeFilterMethod,
} from '../../types';
import {SectionHeader} from './SectionHeader';
import {CustomSlider} from './CustomSlider';

interface ResizeSettingsProps {
  settings: OptimizerConfiguration;
  onUpdate: <K extends keyof OptimizerConfiguration>(
    key: K,
    value: OptimizerConfiguration[K],
  ) => void;
}

export const ResizeSettings = ({settings, onUpdate}: ResizeSettingsProps) => {
  // Callback wrapper specifically for resize configuration
  const updateResize = useCallback(
    (
      key: keyof ResizeConfiguration,
      value: string | number | boolean | null,
    ) => {
      onUpdate('resize', {...settings.resize, [key]: value});
    },
    [settings.resize, onUpdate],
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
      {/* 1. Resize Mode Selection */}
      <div>
        <SectionHeader
          icon={LayoutTemplate}
          title="Change Image Size"
          description="Do you want to shrink the dimensions of your image?"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {label: 'Keep Original', mode: 'off', desc: 'No resizing'},
            {label: 'Scale %', mode: 'scale', desc: 'Use percentage'},
            {
              label: 'Set Pixels',
              mode: 'dimensions',
              desc: 'Exact width/height',
            },
          ].map(opt => (
            <button
              key={opt.mode}
              onClick={() =>
                updateResize('mode', opt.mode as ResizeConfiguration['mode'])
              }
              className={clsx(
                'p-6 rounded-3xl text-left transition-all border-2 flex flex-col gap-2 relative overflow-hidden',
                settings.resize.mode === opt.mode
                  ? 'border-indigo-500 bg-white dark:bg-slate-900 shadow-xl shadow-indigo-100 dark:shadow-none dark:border-sky-500'
                  : 'border-transparent bg-white/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-lg hover:shadow-indigo-500/5 dark:hover:border-sky-500/30',
              )}
            >
              {opt.mode !== 'off' && (
                <div
                  className={clsx(
                    'absolute top-0 right-0 text-xs font-bold px-3 py-1 rounded-bl-xl',
                    'bg-orange-100 text-orange-700',
                  )}
                >
                  Lossy
                </div>
              )}
              <span
                className={clsx(
                  'font-bold text-lg',
                  settings.resize.mode === opt.mode
                    ? 'text-indigo-900 dark:text-sky-100'
                    : 'text-slate-700 dark:text-slate-200',
                )}
              >
                {opt.label}
              </span>
              <span className="text-sm font-medium text-slate-400">
                {opt.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Dynamic Inputs based on Mode */}
      <div className="bg-white/80 dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-white dark:border-white/5 shadow-sm transition-all duration-300">
        {/* Off Mode */}
        {settings.resize.mode === 'off' && (
          <div className="text-center py-8 flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <Scaling className="w-10 h-10" />
            </div>
            <p className="font-bold text-slate-600 dark:text-slate-300 text-xl">
              We'll keep your image dimensions exactly as they are.
            </p>
            <p className="text-slate-400 mt-2">
              Only the file size (MB) will change.
            </p>
          </div>
        )}

        {/* Scale Percentage Mode */}
        {settings.resize.mode === 'scale' && (
          <div className="space-y-6">
            <label className="font-bold text-indigo-900 dark:text-sky-100 text-xl block flex items-center gap-2">
              <Scaling className="w-5 h-5 text-indigo-500 dark:text-sky-400" />
              Resize by Percentage
            </label>
            <CustomSlider
              min={1}
              max={200}
              value={settings.resize.scale}
              onChange={v => updateResize('scale', v)}
              unit="%"
              labels={[
                {label: 'Tiny', val: 25},
                {label: 'Half', val: 50},
                {label: 'Same', val: 100},
                {label: 'Double', val: 200},
              ]}
            />
            <p className="text-center text-slate-500 font-medium bg-indigo-50/50 dark:bg-sky-500/10 p-4 rounded-2xl">
              An image that is <strong>1000px</strong> wide will become{' '}
              <strong>
                {Math.round(1000 * (settings.resize.scale / 100))}px
              </strong>{' '}
              wide.
            </p>
          </div>
        )}

        {/* Exact Dimensions Mode */}
        {settings.resize.mode === 'dimensions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">
                Width
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  placeholder="Auto"
                  value={settings.resize.width || ''}
                  onChange={e =>
                    updateResize(
                      'width',
                      e.target.value ? parseInt(e.target.value) : null,
                    )
                  }
                  className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-6 text-2xl font-bold text-indigo-900 dark:text-sky-100 outline-none focus:border-indigo-500 dark:focus:border-sky-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-sky-500/20 transition-all placeholder-slate-300"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  px
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">
                Height
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  placeholder="Auto"
                  value={settings.resize.height || ''}
                  onChange={e =>
                    updateResize(
                      'height',
                      e.target.value ? parseInt(e.target.value) : null,
                    )
                  }
                  className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-6 text-2xl font-bold text-indigo-900 dark:text-sky-100 outline-none focus:border-indigo-500 dark:focus:border-sky-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-sky-500/20 transition-all placeholder-slate-300"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  px
                </span>
              </div>
            </div>
            <div className="md:col-span-2 pt-2">
              <button
                onClick={() =>
                  updateResize(
                    'maintainAspect',
                    !settings.resize.maintainAspect,
                  )
                }
                className={clsx(
                  'w-full flex items-center justify-between p-5 rounded-2xl font-bold transition-all border-2',
                  settings.resize.maintainAspect
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-sky-500/20 text-indigo-900 dark:text-sky-100 dark:border-sky-500'
                    : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 bg-white dark:bg-slate-800',
                )}
              >
                <span className="flex items-center gap-3 text-lg">
                  {settings.resize.maintainAspect ? (
                    <Lock className="w-5 h-5 text-indigo-500 dark:text-sky-400" />
                  ) : (
                    <Unlock className="w-5 h-5" />
                  )}
                  Keep Shape (Aspect Ratio)
                </span>
                {settings.resize.maintainAspect && (
                  <Check className="w-6 h-6 text-indigo-500 dark:text-sky-400" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Advanced Resize Algorithms (Lanczos, etc) */}
      {settings.resize.mode !== 'off' && (
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3 px-2">
            <label className="text-lg font-bold text-gleam-charcoal dark:text-gray-100">
              Resizing Method (Quality)
            </label>
            <span className="text-sm text-slate-500">Advanced</span>
          </div>
          <div className="relative group">
            <select
              value={settings.resize.method}
              onChange={e =>
                updateResize('method', e.target.value as ResizeFilterMethod)
              }
              className="w-full appearance-none bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-6 text-lg font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-sky-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-sky-500/20 cursor-pointer hover:border-indigo-300 dark:hover:border-sky-500/50 transition-colors"
            >
              <option value="lanczos3">
                Lanczos3 (High Quality) - Recommended
              </option>
              <option value="lanczos2">Lanczos2 (Sharper Details)</option>
              <option value="mks2013">MKS 2013 (Balanced)</option>
              <option value="hamming">Hamming (Smooth / Soft)</option>
              <option value="box">Nearest Neighbor (Pixel Art)</option>
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-sky-400 transition-colors">
              <ChevronRight className="w-6 h-6 rotate-90" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
