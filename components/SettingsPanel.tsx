import React, {useState} from 'react';
import {Settings2, Scaling, Palette, Sliders} from 'lucide-react';
import {clsx} from 'clsx';
import {OptimizerConfiguration} from '../types';

import {GeneralSettings} from './settings/GeneralSettings';
import {ResizeSettings} from './settings/ResizeSettings';
import {PaletteSettings} from './settings/PaletteSettings';
import {AdvancedSettings} from './settings/AdvancedSettings';

interface SettingsPanelProps {
  settings: OptimizerConfiguration;
  onUpdate: <K extends keyof OptimizerConfiguration>(
    key: K,
    value: OptimizerConfiguration[K],
  ) => void;
}

type TabKey = 'general' | 'resize' | 'palette' | 'advanced';

export const SettingsPanel = ({settings, onUpdate}: SettingsPanelProps) => {
  const [activeTab, setActiveTab] = useState<TabKey>('general');

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 dark:shadow-none border border-white dark:border-white/5 mb-10 overflow-hidden ring-1 ring-black/5 dark:ring-white/10 transition-colors duration-300">
      {/* Tab Navigation */}
      <div className="px-6 md:px-8 pt-8 pb-4">
        <div className="bg-white/50 dark:bg-slate-800/50 p-1.5 rounded-3xl grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-1 shadow-sm border border-white/60 dark:border-white/5">
          {[
            {id: 'general', icon: Settings2, label: 'Basics'},
            {id: 'resize', icon: Scaling, label: 'Size'},
            {id: 'palette', icon: Palette, label: 'Colors'},
            {id: 'advanced', icon: Sliders, label: 'Advanced'},
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabKey)}
              className={clsx(
                'flex-1 flex items-center justify-center gap-2 px-3 lg:px-5 py-4 rounded-2xl text-sm lg:text-base font-bold transition-all duration-300 ease-out whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 touch-manipulation',
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-900 text-indigo-900 dark:text-sky-100 shadow-md shadow-indigo-100 dark:shadow-none scale-[1.02] ring-1 ring-black/5 dark:ring-white/10'
                  : 'text-slate-500 dark:text-slate-400 hover:text-indigo-700 dark:hover:text-sky-300 hover:bg-white/40 dark:hover:bg-white/5',
              )}
            >
              <tab.icon
                className={clsx(
                  'w-4 h-4 lg:w-5 lg:h-5',
                  activeTab === tab.id
                    ? 'text-indigo-500 dark:text-sky-400'
                    : 'text-slate-400 dark:text-slate-500 group-hover:text-indigo-400 dark:group-hover:text-sky-400',
                )}
                strokeWidth={2.5}
              />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="p-5 md:p-10 min-h-[450px]">
        {activeTab === 'general' && (
          <GeneralSettings settings={settings} onUpdate={onUpdate} />
        )}
        {activeTab === 'resize' && (
          <ResizeSettings settings={settings} onUpdate={onUpdate} />
        )}
        {activeTab === 'palette' && (
          <PaletteSettings settings={settings} onUpdate={onUpdate} />
        )}
        {activeTab === 'advanced' && (
          <AdvancedSettings settings={settings} onUpdate={onUpdate} />
        )}
      </div>
    </div>
  );
};
