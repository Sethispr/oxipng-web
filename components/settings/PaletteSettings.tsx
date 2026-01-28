import React, {useCallback} from 'react';
import {clsx} from 'clsx';
import {Palette, Sparkles} from 'lucide-react';
import {OptimizerConfiguration} from '../../types';
import {SectionHeader} from './SectionHeader';
import {CustomSlider} from './CustomSlider';

interface PaletteSettingsProps {
  settings: OptimizerConfiguration;
  onUpdate: <K extends keyof OptimizerConfiguration>(
    key: K,
    value: OptimizerConfiguration[K],
  ) => void;
}

export const PaletteSettings = ({settings, onUpdate}: PaletteSettingsProps) => {
  const updatePalette = useCallback(
    (key: keyof OptimizerConfiguration['palette'], value: number | boolean) => {
      onUpdate('palette', {...settings.palette, [key]: value});
    },
    [settings.palette, onUpdate],
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
      {/* Master Toggle Switch */}
      <div
        onClick={() => updatePalette('enabled', !settings.palette.enabled)}
        className={clsx(
          'flex items-center justify-between p-8 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 group relative overflow-hidden',
          settings.palette.enabled
            ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-none transform scale-[1.01] dark:bg-sky-600 dark:border-sky-600'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-sky-500 hover:shadow-lg',
        )}
      >
        <div className="absolute top-0 right-0 bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-bl-xl z-10">
          Lossy
        </div>

        <div className="space-y-2">
          <h3
            className={clsx(
              'font-bold text-2xl tracking-tight',
              settings.palette.enabled
                ? 'text-white'
                : 'text-gleam-charcoal dark:text-gray-100',
            )}
          >
            Enable Color Reduction
          </h3>
          <p
            className={clsx(
              'text-lg font-medium',
              settings.palette.enabled
                ? 'text-indigo-100 dark:text-sky-100'
                : 'text-slate-400',
            )}
          >
            Makes files tiny by limiting colors. Great for logos & icons!
          </p>
        </div>

        <div
          className={clsx(
            'w-16 h-9 rounded-full relative transition-colors duration-300 shrink-0 ml-4',
            settings.palette.enabled
              ? 'bg-black/20'
              : 'bg-slate-200 dark:bg-slate-700',
          )}
        >
          <div
            className={clsx(
              'absolute top-1 w-7 h-7 rounded-full shadow-md transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1)',
              settings.palette.enabled ? 'left-8 bg-white' : 'left-1 bg-white',
            )}
          />
        </div>
      </div>

      {/* Config Sliders */}
      <div
        className={clsx(
          'space-y-12 transition-all duration-500',
          settings.palette.enabled
            ? 'opacity-100 translate-y-0'
            : 'opacity-40 translate-y-4 pointer-events-none grayscale blur-[1px]',
        )}
      >
        {/* Max Colors */}
        <div>
          <SectionHeader
            icon={Palette}
            title="How many colors?"
            description="Fewer colors = Smaller file size. 256 looks almost like the original."
          />
          <div className="bg-white/80 dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-white dark:border-white/5 shadow-sm">
            <CustomSlider
              min={2}
              max={256}
              step={2}
              value={settings.palette.colors}
              onChange={v => updatePalette('colors', v)}
              labels={[
                {label: '2 (B&W)', val: 2},
                {label: '16 (Retro)', val: 16},
                {label: '128 (Web)', val: 128},
                {label: '256 (Photo)', val: 256},
              ]}
            />
          </div>
        </div>

        {/* Dithering */}
        <div>
          <SectionHeader
            icon={Sparkles}
            title="Smoothness (Dithering)"
            description="Adds noise to smooth out bands of color. Higher usually looks better."
          />
          <div className="bg-white/80 dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-white dark:border-white/5 shadow-sm">
            <CustomSlider
              min={0}
              max={1}
              step={0.05}
              value={settings.palette.dither}
              onChange={v => updatePalette('dither', v)}
              unit=""
              labels={[
                {label: 'None', val: 0},
                {label: 'A bit', val: 0.3},
                {label: 'Regular', val: 0.6},
                {label: 'Max', val: 1},
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
