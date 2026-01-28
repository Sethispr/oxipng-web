import React from 'react';

/**
 * SECTION HEADER
 *
 * A simple UI component to title a group of settings.
 * It includes an icon, a title, a description, and badges so users can know easily on if something is recommended or not.
 */
export const SectionHeader = ({
  icon: Icon,
  title,
  description,
  badge,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  badge?: string;
}) => (
  <div className="flex flex-col gap-2 mb-6">
    <div className="flex items-center gap-3 text-gleam-charcoal dark:text-gray-100">
      {/* Icon Container */}
      <div className="p-2.5 bg-white text-indigo-500 rounded-xl shadow-sm ring-1 ring-black/5 dark:bg-slate-800 dark:text-sky-400 dark:ring-white/10">
        <Icon className="w-6 h-6" strokeWidth={2} />
      </div>

      {/* Title & Badge */}
      <div className="flex items-center gap-3">
        <h3 className="font-display font-bold text-2xl tracking-tight text-gleam-charcoal dark:text-white">
          {title}
        </h3>
        {badge && (
          <span className="bg-indigo-100 text-indigo-700 dark:bg-sky-500/20 dark:text-sky-300 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            {badge}
          </span>
        )}
      </div>
    </div>

    {/* Description Text */}
    {description && (
      <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed pl-[3.75rem] max-w-2xl">
        {description}
      </p>
    )}
  </div>
);
