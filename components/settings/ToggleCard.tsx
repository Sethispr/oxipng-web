import React from 'react';
import {Check} from 'lucide-react';
import {clsx} from 'clsx';

/**
 * TOGGLE CARD
 *
 * Instead of a tiny checkbox, we use a big card that is easy to tap on mobile.
 * It indicates "On" or "Off" using borders and colors.
 */
export const ToggleCard = ({
  active,
  onClick,
  title,
  description,
  icon: Icon,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  description: React.ReactNode;
  icon: React.ElementType;
  badge?: string;
}) => (
  <button
    onClick={onClick}
    className={clsx(
      'relative w-full text-left p-6 rounded-3xl transition-all duration-300 border-2 group h-full flex flex-col justify-between overflow-hidden touch-manipulation',
      active
        ? 'border-indigo-500 bg-white dark:bg-slate-800 shadow-xl shadow-indigo-100 dark:shadow-sky-500/5 ring-2 ring-indigo-500/20 dark:border-sky-500 dark:ring-sky-500/20'
        : 'border-transparent bg-white/60 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-200 dark:hover:border-sky-500/30 hover:shadow-lg hover:shadow-indigo-500/5',
    )}
  >
    {/* Badge */}
    {badge && (
      <div
        className={clsx(
          'absolute top-0 right-0 text-xs font-bold px-3 py-1 rounded-bl-xl transition-colors',
          badge === 'Lossy' || badge === 'Not Recommended'
            ? 'bg-orange-100 text-orange-700'
            : badge === 'Privacy'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-green-100 text-green-700',
        )}
      >
        {badge}
      </div>
    )}

    {/* Header: Icon + Checkmark */}
    <div className="flex items-start justify-between mb-4 w-full">
      <div
        className={clsx(
          'p-3.5 rounded-2xl transition-colors',
          active
            ? 'bg-indigo-100 text-indigo-600 dark:bg-sky-500/20 dark:text-sky-400'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-sky-500/10 group-hover:text-indigo-600 dark:group-hover:text-sky-400',
        )}
      >
        <Icon className="w-7 h-7" strokeWidth={2} />
      </div>
      <div
        className={clsx(
          'w-8 h-8 rounded-full flex items-center justify-center transition-all border-2',
          active
            ? 'border-indigo-500 bg-indigo-500 text-white dark:border-sky-500 dark:bg-sky-500'
            : 'border-slate-200 dark:border-slate-700 bg-transparent',
        )}
      >
        {active && <Check className="w-5 h-5" strokeWidth={4} />}
      </div>
    </div>

    {/* Content */}
    <div>
      <span
        className={clsx(
          'block font-bold text-xl mb-2',
          active
            ? 'text-indigo-900 dark:text-sky-100'
            : 'text-slate-700 dark:text-slate-200',
        )}
      >
        {title}
      </span>
      <span className="block text-base font-medium leading-relaxed text-slate-500 dark:text-slate-400">
        {description}
      </span>
    </div>
  </button>
);
