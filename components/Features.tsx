import React from 'react';
import {clsx} from 'clsx';
import {
  Lock,
  TrendingDown,
  Infinity as InfinityIcon,
  Zap,
  Image as ImageIcon,
  FileStack,
} from 'lucide-react';

interface FeatureRowProps {
  title: string;
  description: string;
  graphic: React.ReactNode;
  align?: 'left' | 'right';
  colorClass?: string;
}

const FeatureRow = ({
  title,
  description,
  graphic,
  align = 'left',
  colorClass = 'text-rose-600',
}: FeatureRowProps) => {
  return (
    <div className="py-8 md:py-12 flex flex-col items-center overflow-visible z-10 relative">
      <div
        className={clsx(
          'flex flex-col items-center gap-10 md:gap-20 w-full max-w-6xl px-6',
          align === 'right' ? 'md:flex-row-reverse' : 'md:flex-row',
        )}
      >
        <div className="flex-1 space-y-5 text-center md:text-left z-10 w-full">
          <h2
            className={clsx(
              'text-6xl md:text-8xl font-display font-black tracking-tighter leading-none drop-shadow-sm',
              colorClass,
            )}
          >
            {title}
          </h2>
          <p className="text-xl md:text-3xl font-bold text-slate-900 dark:text-slate-900 leading-tight max-w-lg mx-auto md:mx-0">
            {description}
          </p>
        </div>

        <div className="flex-1 flex justify-center w-full min-h-[320px] md:min-h-[420px] relative">
          <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
            {graphic}
          </div>
        </div>
      </div>
    </div>
  );
};

const SizeGraphic = () => (
  <div className="relative group">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-300/30 rounded-full blur-[60px] pointer-events-none"></div>

    <div className="relative w-80 bg-white rounded-[2rem] shadow-2xl shadow-pink-200/40 border border-white p-8 flex flex-col gap-6 transform transition-transform duration-500 hover:scale-105 hover:-rotate-1 z-10">
      <div className="absolute -top-4 -right-4 z-20">
        <div className="bg-white py-2 px-4 rounded-xl shadow-lg border-2 border-slate-100 flex items-center gap-2 transform rotate-6 group-hover:rotate-12 transition-transform duration-300">
          <div className="bg-pink-50 p-1 rounded-md text-pink-400">
            <TrendingDown className="w-3.5 h-3.5" strokeWidth={3} />
          </div>
          <span className="font-bold text-slate-700 text-xs uppercase tracking-wide whitespace-nowrap">
            -65% Size
          </span>
        </div>
      </div>

      <div className="w-full aspect-video bg-pink-50/50 rounded-2xl flex items-center justify-center relative overflow-hidden">
        <ImageIcon className="w-16 h-16 text-pink-300 transition-transform group-hover:scale-110 duration-500" />
        <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider text-pink-400 shadow-sm">
          JPG
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Before
          </div>
          <div className="text-base font-bold text-slate-400 line-through decoration-pink-300/50 decoration-2">
            2.4 MB
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold text-pink-400 uppercase tracking-wider mb-1">
            After
          </div>
          <div className="text-4xl font-black text-pink-400 leading-none">
            850<span className="text-base ml-0.5 text-pink-300">KB</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const BatchGraphic = () => (
  <div className="relative group">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-300/30 rounded-full blur-[60px] pointer-events-none"></div>

    <div className="relative w-64 h-64 flex items-center justify-center">
      <div className="absolute w-48 h-48 bg-orange-100 rounded-[2rem] shadow-lg border border-white transform rotate-[-15deg] translate-x-[-40px] translate-y-[10px] scale-90 transition-transform duration-500 group-hover:translate-x-[-70px] group-hover:rotate-[-25deg] group-hover:scale-95"></div>

      <div className="absolute w-48 h-48 bg-fuchsia-100 rounded-[2rem] shadow-xl border border-white transform rotate-[-8deg] translate-x-[-20px] translate-y-[5px] scale-95 transition-transform duration-500 group-hover:translate-x-[-35px] group-hover:rotate-[-12deg] group-hover:scale-100"></div>

      <div className="absolute w-48 h-48 bg-white rounded-[2rem] shadow-2xl border border-white flex items-center justify-center transform transition-transform duration-500 group-hover:scale-105 group-hover:rotate-6 z-10">
        <FileStack className="w-16 h-16 text-violet-300" strokeWidth={1.5} />

        <div className="absolute -top-4 -right-8 z-20">
          <div className="bg-white py-2 px-4 rounded-xl shadow-lg border-2 border-slate-100 flex items-center gap-2 transform rotate-6 group-hover:rotate-0 transition-transform duration-300">
            <div className="bg-violet-50 p-1 rounded-md text-violet-400">
              <InfinityIcon className="w-3.5 h-3.5" strokeWidth={3} />
            </div>
            <span className="font-bold text-slate-700 text-xs uppercase tracking-wide">
              Unlimited
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PrivacyGraphic = () => (
  <div className="relative group">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-300/30 rounded-full blur-[60px] pointer-events-none"></div>

    <div className="relative w-56 h-56 bg-emerald-400 rounded-[2.5rem] shadow-2xl shadow-emerald-200/50 flex items-center justify-center transform transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3 border-4 border-white z-10">
      <Lock className="w-24 h-24 text-white drop-shadow-md" strokeWidth={1.5} />

      <div className="absolute -top-4 -left-6 z-20">
        <div className="bg-white py-2 px-4 rounded-xl shadow-lg border-2 border-slate-100 flex items-center gap-2 transform -rotate-6 group-hover:-rotate-12 transition-transform duration-300">
          <div className="bg-emerald-50 p-1 rounded-md text-emerald-400">
            <Zap className="w-3.5 h-3.5 fill-current" strokeWidth={0} />
          </div>
          <span className="font-bold text-slate-700 text-xs uppercase tracking-wide">
            Offline Mode
          </span>
        </div>
      </div>
    </div>
  </div>
);

export const Features = () => {
  return (
    <div className="relative z-10 bg-rainbow-gradient">
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-20">
        <svg
          className="relative block w-[110%] -left-[5%] h-[60px] md:h-[120px] text-gleam-dark fill-current rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      <div className="pt-24 pb-32 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto">
          <FeatureRow
            title="Small."
            description="Smaller images mean faster load times. Reduce file size by up to 80% without losing quality."
            graphic={<SizeGraphic />}
            align="left"
            colorClass="text-pink-400"
          />

          <FeatureRow
            title="Simple."
            description="Drag, drop, done. Process hundreds of images at once in seconds."
            graphic={<BatchGraphic />}
            align="right"
            colorClass="text-violet-400"
          />

          <FeatureRow
            title="Private."
            description="Your photos never leave your device. No servers, no clouds, no tracking."
            graphic={<PrivacyGraphic />}
            align="left"
            colorClass="text-emerald-400"
          />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
        <svg
          className="relative block w-[110%] -left-[5%] h-[50px] md:h-[80px] text-gleam-dark fill-current opacity-10"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"></path>
        </svg>
      </div>
    </div>
  );
};
