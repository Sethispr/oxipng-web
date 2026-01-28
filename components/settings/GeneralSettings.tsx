import React, {useCallback} from 'react';
import {clsx} from 'clsx';
import {FileType, Gauge, Zap, ImageIcon, Shield, RefreshCw} from 'lucide-react';
import {
  OptimizerConfiguration,
  OutputFormat,
  WebPConfiguration,
  JpegConfiguration,
  AvifConfiguration,
  JxlConfiguration,
} from '../../types';
import {SectionHeader} from './SectionHeader';
import {ToggleCard} from './ToggleCard';
import {CustomSlider} from './CustomSlider';

interface GeneralSettingsProps {
  settings: OptimizerConfiguration;
  onUpdate: <K extends keyof OptimizerConfiguration>(
    key: K,
    value: OptimizerConfiguration[K],
  ) => void;
}

/**
 * GENERAL SETTINGS
 *
 * This component manages the core choices:
 * 1. Which format to output (PNG, WebP, etc).
 * 2. Format-specific sliders (Quality, Effort, Lossless).
 */
export const GeneralSettings = ({settings, onUpdate}: GeneralSettingsProps) => {
  // Helper wrappers to update specific nested objects cleanly
  const updateWebP = useCallback(
    (key: keyof WebPConfiguration, value: number | boolean) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onUpdate('webp', {...settings.webp, [key]: value} as any);
    },
    [settings.webp, onUpdate],
  );

  const updateJpeg = useCallback(
    (key: keyof JpegConfiguration, value: number | boolean) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onUpdate('jpeg', {...settings.jpeg, [key]: value} as any);
    },
    [settings.jpeg, onUpdate],
  );

  const updateAvif = useCallback(
    (key: keyof AvifConfiguration, value: number | boolean) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onUpdate('avif', {...settings.avif, [key]: value} as any);
    },
    [settings.avif, onUpdate],
  );

  const updateJxl = useCallback(
    (key: keyof JxlConfiguration, value: number | boolean) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onUpdate('jxl', {...settings.jxl, [key]: value} as any);
    },
    [settings.jxl, onUpdate],
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
      {/* 1. Format Selection Grid */}
      <div>
        <SectionHeader
          icon={FileType}
          title="Output Format"
          description="Choose the file type for your optimized images."
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 md:gap-4">
          {/* Auto / Match Original Button */}
          <button
            onClick={() => onUpdate('maintainOriginalFormat', true)}
            className={clsx(
              'flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all gap-1.5 group min-h-[120px]',
              settings.maintainOriginalFormat
                ? 'border-indigo-500 bg-white dark:bg-slate-800 text-indigo-600 dark:text-sky-400 shadow-xl shadow-indigo-100 dark:shadow-none'
                : 'border-transparent bg-white/60 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800',
            )}
          >
            <RefreshCw className="w-8 h-8 mb-1" strokeWidth={2} />
            <span className="font-display font-black text-lg md:text-xl uppercase tracking-tighter">
              Auto
            </span>
            <span className="text-[9px] md:text-[10px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full whitespace-nowrap">
              Same as Input
            </span>
          </button>

          {/* Format Buttons */}
          {['png', 'webp', 'jpeg', 'avif', 'qoi', 'jxl'].map(fmt => (
            <button
              key={fmt}
              onClick={() => {
                onUpdate('maintainOriginalFormat', false);
                onUpdate('outputFormat', fmt as OutputFormat);
              }}
              className={clsx(
                'flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all gap-1.5 group min-h-[120px]',
                !settings.maintainOriginalFormat &&
                  settings.outputFormat === fmt
                  ? 'border-indigo-500 bg-white dark:bg-slate-800 text-indigo-600 dark:text-sky-400 shadow-xl shadow-indigo-100 dark:shadow-none'
                  : 'border-transparent bg-white/60 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800',
              )}
            >
              <span className="font-display font-black text-xl md:text-2xl uppercase tracking-tighter">
                {fmt === 'jpeg' ? 'JPG' : fmt}
              </span>
              {/* Format Badges */}
              {fmt === 'webp' && (
                <span className="text-[9px] md:text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                  Web Ready
                </span>
              )}
              {fmt === 'png' && (
                <span className="text-[9px] md:text-[10px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                  Universal
                </span>
              )}
              {fmt === 'jpeg' && (
                <span className="text-[9px] md:text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                  Photo
                </span>
              )}
              {fmt === 'avif' && (
                <span className="text-[9px] md:text-[10px] font-bold bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                  Smallest
                </span>
              )}
              {fmt === 'qoi' && (
                <span className="text-[9px] md:text-[10px] font-bold bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                  Fastest
                </span>
              )}
              {fmt === 'jxl' && (
                <span className="text-[9px] md:text-[10px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                  Next Gen
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Format Specific Configurations */}

      {/* Auto Mode Info */}
      {settings.maintainOriginalFormat && (
        <div className="animate-in fade-in slide-in-from-left-4 duration-300">
          <div className="bg-white/80 dark:bg-slate-900 rounded-3xl p-8 border border-white dark:border-white/5 shadow-sm text-center">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-sky-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-500 dark:text-sky-400">
              <RefreshCw className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-gleam-charcoal dark:text-white mb-3">
              Auto Compress Mode
            </h3>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              We will detect the input format and optimize it while keeping the
              same file type.
              <br />
              <span className="text-sm opacity-75">
                (e.g. Upload JPG → Get smaller JPG)
              </span>
            </p>
          </div>
        </div>
      )}

      {/* --- PNG --- */}
      {!settings.maintainOriginalFormat && settings.outputFormat === 'png' && (
        <div className="animate-in fade-in slide-in-from-left-4 duration-300 space-y-12">
          <div>
            <SectionHeader
              icon={Gauge}
              title="Compression Strength"
              description="How hard should we squeeze your images? Higher strength makes smaller files but takes a few seconds longer."
            />
            <div className="bg-white/80 dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-white dark:border-white/5 shadow-sm">
              <CustomSlider
                min={1}
                max={6}
                value={settings.level}
                onChange={v => onUpdate('level', v)}
                labels={[
                  {label: 'Fast', val: 1},
                  {label: 'Balanced', val: 3},
                  {label: 'Max Squeeze', val: 6},
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ToggleCard
              title="Interlace"
              description={
                <span>
                  Makes images appear blurry at first and sharpen as they load
                  (Progressive).
                  <span className="block mt-1 text-sm opacity-80 font-semibold text-indigo-600 dark:text-sky-300">
                    This option is more useful for large images.
                  </span>
                </span>
              }
              active={settings.interlace}
              onClick={() => onUpdate('interlace', !settings.interlace)}
              icon={ImageIcon}
              badge="Not Recommended"
            />
          </div>
        </div>
      )}

      {/* --- WebP --- */}
      {!settings.maintainOriginalFormat && settings.outputFormat === 'webp' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-12">
          {/* Quality (Lossy Only) */}
          {!settings.webp.lossless && (
            <div>
              <SectionHeader
                icon={Gauge}
                title="Quality"
                description="Lower quality = smaller file size. 75-85 is usually the sweet spot."
              />
              <div className="bg-white/80 dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-white dark:border-white/5 shadow-sm">
                <CustomSlider
                  min={0}
                  max={100}
                  value={settings.webp.quality}
                  onChange={v => updateWebP('quality', v)}
                  unit="%"
                  labels={[
                    {label: 'Low', val: 50},
                    {label: 'Good', val: 75},
                    {label: 'Best', val: 90},
                    {label: 'Max', val: 100},
                  ]}
                />
              </div>
            </div>
          )}

          {/* Near Lossless (Lossless Only) */}
          {settings.webp.lossless && (
            <div>
              <SectionHeader
                icon={Gauge}
                title="Near Lossless"
                description="Adjust pixel preprocessing. 100 is bit-perfect. Lower values allow slight alterations for better compression."
              />
              <div className="bg-white/80 dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-white dark:border-white/5 shadow-sm">
                <CustomSlider
                  min={0}
                  max={100}
                  value={settings.webp.nearLossless ?? 100}
                  onChange={v => updateWebP('nearLossless', v)}
                  unit="%"
                  labels={[
                    {label: 'Max Change', val: 0},
                    {label: 'Slight', val: 60},
                    {label: 'Very Slight', val: 80},
                    {label: 'Perfect', val: 100},
                  ]}
                />
              </div>
            </div>
          )}

          {/* Effort */}
          <div>
            <SectionHeader
              icon={Zap}
              title="Compression Effort"
              description="Controls the trade-off between encoding speed and compressed file size."
            />
            <div className="bg-white/80 dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-white dark:border-white/5 shadow-sm">
              <CustomSlider
                min={0}
                max={6}
                value={settings.webp.effort}
                onChange={v => updateWebP('effort', v)}
                labels={[
                  {label: 'Fast', val: 0},
                  {label: 'Balanced', val: 4},
                  {label: 'Smallest', val: 6},
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ToggleCard
              title="Lossless"
              description="Compress without losing any pixel data. Keeps perfect quality but file size will be larger."
              active={settings.webp.lossless}
              onClick={() => updateWebP('lossless', !settings.webp.lossless)}
              icon={Shield}
              badge={settings.webp.lossless ? 'Perfect Quality' : undefined}
            />
          </div>
        </div>
      )}

      {/* --- JPEG --- */}
      {!settings.maintainOriginalFormat && settings.outputFormat === 'jpeg' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-12">
          <div>
            <SectionHeader
              icon={Gauge}
              title="JPEG Quality"
              description="Lower quality = smaller file size. 80-90 is usually indistinguishable from original."
            />
            <div className="bg-white/80 dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-white dark:border-white/5 shadow-sm">
              <CustomSlider
                min={0}
                max={100}
                value={settings.jpeg.quality}
                onChange={v => updateJpeg('quality', v)}
                unit="%"
                labels={[
                  {label: 'Low', val: 60},
                  {label: 'Good', val: 80},
                  {label: 'Best', val: 90},
                  {label: 'Max', val: 100},
                ]}
              />
            </div>
          </div>
        </div>
      )}

      {/* --- AVIF --- */}
      {!settings.maintainOriginalFormat && settings.outputFormat === 'avif' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-12">
          {!settings.avif.lossless && (
            <div>
              <SectionHeader
                icon={Gauge}
                title="AVIF Quality"
                description="AVIF is very efficient. 60-70 quality is often indistinguishable from original but much smaller."
              />
              <div className="bg-white/80 dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-white dark:border-white/5 shadow-sm">
                <CustomSlider
                  min={0}
                  max={100}
                  value={settings.avif.quality}
                  onChange={v => updateAvif('quality', v)}
                  unit="%"
                  labels={[
                    {label: 'Small', val: 50},
                    {label: 'Balanced', val: 65},
                    {label: 'High', val: 80},
                    {label: 'Max', val: 100},
                  ]}
                />
              </div>
            </div>
          )}

          <div>
            <SectionHeader
              icon={Zap}
              title="Compression Effort"
              description="AVIF encoding can be slow. Lower effort is faster but might produce slightly larger files."
            />
            <div className="bg-white/80 dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-white dark:border-white/5 shadow-sm">
              <CustomSlider
                min={0}
                max={6}
                value={settings.avif.effort}
                onChange={v => updateAvif('effort', v)}
                labels={[
                  {label: 'Fastest', val: 0},
                  {label: 'Balanced', val: 2},
                  {label: 'Slow (Small)', val: 6},
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ToggleCard
              title="Lossless"
              description="Bit-perfect copy. Files might be large compared to lossy AVIF."
              active={settings.avif.lossless}
              onClick={() => updateAvif('lossless', !settings.avif.lossless)}
              icon={Shield}
              badge={settings.avif.lossless ? 'Perfect' : undefined}
            />
          </div>
        </div>
      )}

      {/* --- QOI --- */}
      {!settings.maintainOriginalFormat && settings.outputFormat === 'qoi' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-12">
          <div className="bg-white/80 dark:bg-slate-900 rounded-3xl p-8 border border-white dark:border-white/5 shadow-sm text-center">
            <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600 dark:text-yellow-400">
              <Zap className="w-10 h-10 fill-current" />
            </div>
            <h3 className="text-2xl font-bold text-gleam-charcoal dark:text-white mb-3">
              Blazing Fast & Lossless
            </h3>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              The <strong>QOI (Quite OK Image Format)</strong> is a new format
              that encodes 20x-50x faster than PNG while maintaining perfect
              lossless quality.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-bold text-slate-500 dark:text-slate-400">
              <Shield className="w-4 h-4" />
              No configuration needed
            </div>
          </div>
        </div>
      )}

      {/* --- JXL --- */}
      {!settings.maintainOriginalFormat && settings.outputFormat === 'jxl' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-12">
          {!settings.jxl.lossless && (
            <div>
              <SectionHeader
                icon={Gauge}
                title="JPEG XL Quality"
                description="JXL offers superior compression to JPEG and WebP. 75 quality is usually visually lossless."
              />
              <div className="bg-white/80 dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-white dark:border-white/5 shadow-sm">
                <CustomSlider
                  min={0}
                  max={100}
                  value={settings.jxl.quality}
                  onChange={v => updateJxl('quality', v)}
                  unit="%"
                  labels={[
                    {label: 'Small', val: 50},
                    {label: 'Good', val: 75},
                    {label: 'High', val: 90},
                    {label: 'Max', val: 100},
                  ]}
                />
              </div>
            </div>
          )}

          <div>
            <SectionHeader
              icon={Zap}
              title="Encoding Effort"
              description="Higher effort yields better compression density (smaller files) but takes longer. 7 (Lightning) is recommended for web."
            />
            <div className="bg-white/80 dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-white dark:border-white/5 shadow-sm">
              <CustomSlider
                min={3}
                max={9}
                value={settings.jxl.effort}
                onChange={v => updateJxl('effort', v)}
                labels={[
                  {label: 'Falcon (3)', val: 3},
                  {label: 'Wombat (5)', val: 5},
                  {label: 'Lightning (7)', val: 7},
                  {label: 'Tortoise (9)', val: 9},
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ToggleCard
              title="Lossless"
              description="Bit-perfect copy. JXL Lossless is significantly smaller than PNG."
              active={settings.jxl.lossless}
              onClick={() => updateJxl('lossless', !settings.jxl.lossless)}
              icon={Shield}
              badge={settings.jxl.lossless ? 'Smaller than PNG' : undefined}
            />
          </div>
        </div>
      )}
    </div>
  );
};
