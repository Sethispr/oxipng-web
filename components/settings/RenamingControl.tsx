import React, {useState, useEffect} from 'react';
import {
  FileSignature,
  Hash,
  ArrowRight,
  ArrowLeft,
  Type,
  Check,
  Regex,
  Plus,
  Tag,
} from 'lucide-react';
import {clsx} from 'clsx';

/**
 * RENAMING CONTROL
 *
 * Provides a UI for users to define how files should be named.
 * Offers a "Simple Mode" (buttons) and an "Advanced Mode" (text pattern).
 */
export const RenamingControl = ({
  pattern,
  startSequence,
  onChange,
}: {
  pattern: string;
  startSequence: number;
  onChange: (p: string, s: number) => void;
}) => {
  // UI States: 'simple' | 'advanced'
  // 'simple' maps to predefined methods: original, number, prefix, suffix
  const [uiMode, setUiMode] = useState<'simple' | 'advanced'>('simple');

  // Simple Mode State
  const [method, setMethod] = useState<
    'original' | 'number' | 'prefix' | 'suffix'
  >('original');
  const [inputText, setInputText] = useState('');

  // Initialize state from prop on mount only
  // This allows the UI to reflect the current settings correctly.
  useEffect(() => {
    if (pattern === '{o}') {
      setMethod('original');
      setInputText('');
    } else if (pattern.match(/^.*-{n}$/)) {
      setMethod('number');
      setInputText(pattern.replace('-{n}', ''));
    } else if (pattern.match(/^.*-{o}$/)) {
      setMethod('prefix');
      setInputText(pattern.replace('-{o}', ''));
    } else if (pattern.match(/^{o}-.*$/)) {
      setMethod('suffix');
      setInputText(pattern.replace('{o}-', ''));
    } else {
      // Complex pattern detected (e.g. user manually typed one), switch to advanced mode
      setUiMode('advanced');
    }
  }, []);

  // When Simple Mode inputs change, calculate the new pattern and update parent
  useEffect(() => {
    if (uiMode !== 'simple') return;

    let newPattern = '{o}';
    const cleanText = inputText.trim();

    switch (method) {
      case 'original':
        newPattern = '{o}';
        break;
      case 'number':
        newPattern = `${cleanText || 'Image'}-{n}`;
        break;
      case 'prefix':
        newPattern = `${cleanText || 'Pre'}-{o}`;
        break;
      case 'suffix':
        newPattern = `{o}-${cleanText || 'Suf'}`;
        break;
    }

    if (newPattern !== pattern) {
      onChange(newPattern, startSequence);
    }
  }, [method, inputText, uiMode, startSequence]);

  // Helper to calculate preview string for display
  const getPreview = (p: string) => {
    return p
      .replace('{o}', 'blair')
      .replace('{n}', String(startSequence))
      .replace('{d}', new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900 rounded-3xl border border-white dark:border-white/5 shadow-sm overflow-hidden">
      {/* Header Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <button
          onClick={() => setUiMode('simple')}
          className={clsx(
            'flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors',
            uiMode === 'simple'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-sky-400 border-b-2 border-indigo-500 dark:border-sky-500'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800',
          )}
        >
          Easy Mode
        </button>
        <button
          onClick={() => setUiMode('advanced')}
          className={clsx(
            'flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors',
            uiMode === 'advanced'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-sky-400 border-b-2 border-indigo-500 dark:border-sky-500'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800',
          )}
        >
          Custom Pattern
        </button>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {uiMode === 'simple' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  id: 'original',
                  icon: FileSignature,
                  label: 'Keep Original',
                  desc: 'Use existing filename',
                },
                {
                  id: 'number',
                  icon: Hash,
                  label: 'Rename & Number',
                  desc: 'Name-1.png, Name-2.png',
                },
                {
                  id: 'prefix',
                  icon: ArrowRight,
                  label: 'Add Prefix',
                  desc: 'Pre-Original.png',
                },
                {
                  id: 'suffix',
                  icon: ArrowLeft,
                  label: 'Add Suffix',
                  desc: 'Original-Suf.png',
                },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() =>
                    setMethod(
                      opt.id as 'original' | 'number' | 'prefix' | 'suffix',
                    )
                  }
                  className={clsx(
                    'p-4 rounded-2xl border-2 text-left transition-all flex flex-col gap-1 relative overflow-hidden',
                    method === opt.id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-sky-500/20 text-indigo-900 dark:text-sky-100 shadow-md ring-1 ring-indigo-500/20 dark:border-sky-500 dark:ring-sky-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-sky-500/50 hover:bg-indigo-50/30 dark:hover:bg-sky-500/10',
                  )}
                >
                  <div className="flex items-center gap-2 font-bold text-base">
                    <opt.icon
                      className={clsx(
                        'w-5 h-5',
                        method === opt.id
                          ? 'text-indigo-500 dark:text-sky-400'
                          : 'text-slate-400',
                      )}
                    />
                    {opt.label}
                  </div>
                  <div className="text-xs font-medium opacity-60 pl-7">
                    {opt.desc}
                  </div>
                  {method === opt.id && (
                    <div className="absolute top-3 right-3 text-indigo-500 dark:text-sky-400">
                      <Check className="w-5 h-5" strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {method !== 'original' && (
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-5 space-y-4 animate-in slide-in-from-top-2 fade-in">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                    {method === 'number'
                      ? 'New Base Filename'
                      : method === 'prefix'
                        ? 'Prefix Text'
                        : 'Suffix Text'}
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      placeholder={
                        method === 'number'
                          ? 'e.g. Blair'
                          : method === 'prefix'
                            ? 'e.g. Draft'
                            : 'e.g. v2'
                      }
                      className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 font-bold text-indigo-900 dark:text-sky-100 outline-none focus:border-indigo-500 dark:focus:border-sky-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-sky-500/20 transition-all placeholder-slate-300"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 dark:group-focus-within:text-sky-500 transition-colors">
                      <Type className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {method === 'number' && (
                  <div className="flex items-center gap-4">
                    <div className="w-32">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                        Start #
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={startSequence}
                        onChange={e =>
                          onChange(pattern, parseInt(e.target.value) || 0)
                        }
                        className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3 font-bold text-center text-indigo-900 dark:text-sky-100 outline-none focus:border-indigo-500 dark:focus:border-sky-500"
                      />
                    </div>
                    <p className="text-xs text-slate-400 font-medium pt-6">
                      Useful if adding to an existing set.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-3 bg-indigo-50/50 dark:bg-sky-500/10 rounded-xl p-4 border border-indigo-100 dark:border-sky-500/20 text-indigo-900 dark:text-sky-100">
              <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm text-indigo-500 dark:text-sky-400">
                <Tag className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 dark:text-sky-400 mb-0.5">
                  Preview
                </div>
                <div className="font-bold truncate text-lg">
                  {getPreview(pattern)}.png
                </div>
              </div>
            </div>
          </div>
        )}

        {uiMode === 'advanced' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Pattern String
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={pattern}
                  onChange={e => onChange(e.target.value, startSequence)}
                  className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 font-bold text-indigo-900 dark:text-sky-100 outline-none focus:border-indigo-500 dark:focus:border-sky-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-sky-500/20 transition-all placeholder-slate-300"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 dark:group-focus-within:text-sky-500 transition-colors">
                  <Regex className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                {tag: '{o}', label: 'Original Name'},
                {tag: '{n}', label: 'Counter'},
                {tag: '{d}', label: 'Date (YYYY-MM-DD)'},
              ].map(t => (
                <button
                  key={t.tag}
                  onClick={() => onChange(pattern + t.tag, startSequence)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-sky-500 hover:text-indigo-600 dark:hover:text-sky-400 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-3 h-3" />
                  <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded font-bold">
                    {t.tag}
                  </code>
                  <span className="opacity-70">{t.label}</span>
                </button>
              ))}
            </div>

            <div className="w-32">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Start Counter At
              </label>
              <input
                type="number"
                min="0"
                value={startSequence}
                onChange={e => onChange(pattern, parseInt(e.target.value) || 0)}
                className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3 font-bold text-center text-indigo-900 dark:text-sky-100 outline-none focus:border-indigo-500 dark:focus:border-sky-500"
              />
            </div>

            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-300">
                <strong className="text-slate-700 dark:text-slate-200">
                  Preview:{' '}
                </strong>
                <span className="font-bold text-indigo-600 dark:text-sky-400 ml-2">
                  {getPreview(pattern)}.png
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
