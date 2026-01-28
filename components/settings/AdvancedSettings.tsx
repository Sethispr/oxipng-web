import React, {useCallback} from 'react';
import {clsx} from 'clsx';
import {
  Monitor,
  Sun,
  Moon,
  Zap,
  Sliders,
  Palette,
  ImageIcon,
  Shield,
  FileSignature,
  Ghost,
  Workflow,
  ArrowDownToLine,
} from 'lucide-react';
import {OptimizerConfiguration, ThemeOption} from '../../types';
import {SectionHeader} from './SectionHeader';
import {ToggleCard} from './ToggleCard';
import {CustomSlider} from './CustomSlider';
import {RenamingControl} from './RenamingControl';

interface AdvancedSettingsProps {
  settings: OptimizerConfiguration;
  onUpdate: <K extends keyof OptimizerConfiguration>(
    key: K,
    value: OptimizerConfiguration[K],
  ) => void;
}

export const AdvancedSettings = ({
  settings,
  onUpdate,
}: AdvancedSettingsProps) => {
  const updateRenaming = useCallback(
    (pattern: string, startSequence: number) => {
      onUpdate('renaming', {pattern, startSequence});
    },
    [onUpdate],
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
      {/* 1. Theme Selector */}
      <div>
        <SectionHeader
          icon={Monitor}
          title="Appearance"
          description="Choose how Blair looks on your device."
        />
        <div className="grid grid-cols-3 gap-4 bg-white/50 dark:bg-slate-800 p-2 rounded-3xl border border-white/60 dark:border-white/5 mb-6">
          {[
            {id: 'light', icon: Sun, label: 'Light'},
            {id: 'dark', icon: Moon, label: 'Dark'},
            {id: 'system', icon: Monitor, label: 'System'},
          ].map(option => (
            <button
              key={option.id}
              onClick={() => onUpdate('theme', option.id as ThemeOption)}
              className={clsx(
                'flex flex-col items-center gap-2 p-4 rounded-2xl transition-all border-2',
                settings.theme === option.id
                  ? 'bg-white dark:bg-slate-700 border-indigo-500 text-indigo-600 dark:border-sky-500 dark:text-sky-400 shadow-md'
                  : 'border-transparent hover:bg-white/50 dark:hover:bg-slate-700/50 text-slate-500 dark:text-slate-400',
              )}
            >
              <option.icon className="w-6 h-6" />
              <span className="font-bold">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Automation */}
      <div>
        <SectionHeader
          icon={Workflow}
          title="Automation"
          description="Settings for automatic saving."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ToggleCard
            title="Auto Download"
            description="Automatically save files to your computer immediately after they finish processing."
            active={settings.autoDownload}
            onClick={() => onUpdate('autoDownload', !settings.autoDownload)}
            icon={ArrowDownToLine}
          />
        </div>
      </div>

      {/* 3. Parallel Processing */}
      <div>
        <SectionHeader
          icon={Zap}
          title="Parallel Processing"
          description="Control the speed. Process multiple images at once to finish faster."
        />
        <div className="bg-white/80 dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-white dark:border-white/5 shadow-sm">
          <CustomSlider
            min={1}
            max={10}
            value={settings.concurrency}
            onChange={v => onUpdate('concurrency', v)}
            labels={[
              {label: 'Steady (1)', val: 1},
              {label: 'Default (5)', val: 5},
              {label: 'Turbo (10)', val: 10},
            ]}
          />
          <p className="text-center text-slate-500 dark:text-slate-400 font-medium bg-indigo-50/50 dark:bg-sky-500/10 p-4 rounded-2xl mt-6">
            We will process <strong>{settings.concurrency}</strong> images at
            the same time.
            {settings.concurrency > 6 && (
              <span className="text-orange-600 dark:text-orange-400 block mt-1 text-sm font-bold">
                Note: High numbers might slow down older devices.
              </span>
            )}
          </p>
        </div>
      </div>

      {/* 4. Technical Settings */}
      <div>
        <SectionHeader
          icon={Sliders}
          title="Technical Settings"
          description="Controls for color spaces, transparency handling, and metadata."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ToggleCard
            title="Linear Color"
            description="Prevents colors from getting brighter/darker when resizing."
            active={settings.linearRGB}
            onClick={() => onUpdate('linearRGB', !settings.linearRGB)}
            icon={Palette}
            badge={settings.linearRGB ? 'Recommended' : 'Lossy'}
          />
          <ToggleCard
            title="Fix Transparent Edges"
            description="Premultiply Alpha. Helps if you see dark halos around your subject."
            active={settings.premultiplyAlpha}
            onClick={() =>
              onUpdate('premultiplyAlpha', !settings.premultiplyAlpha)
            }
            icon={ImageIcon}
            badge={settings.premultiplyAlpha ? 'Recommended' : 'Lossy'}
          />
          <ToggleCard
            title="Strip Metadata"
            description="Removes private data (EXIF, Camera, GPS) and unnecessary chunks to save space."
            active={settings.stripMetadata}
            onClick={() => onUpdate('stripMetadata', !settings.stripMetadata)}
            icon={Shield}
            badge={settings.stripMetadata ? 'Privacy' : undefined}
          />
          <ToggleCard
            title="Incognito Mode (No Cache)"
            description="Stop saving images to your local storage. If you refresh, all jobs will be lost immediately."
            active={settings.disableStorage}
            onClick={() => onUpdate('disableStorage', !settings.disableStorage)}
            icon={Ghost}
            badge={settings.disableStorage ? 'Zero Footprint' : undefined}
          />
        </div>
      </div>

      {/* 5. Renaming */}
      <div>
        <SectionHeader
          icon={FileSignature}
          title="File Renaming"
          description="Automatically give your downloaded files a new name."
        />
        <RenamingControl
          pattern={settings.renaming.pattern}
          startSequence={settings.renaming.startSequence}
          onChange={updateRenaming}
        />
      </div>
    </div>
  );
};
