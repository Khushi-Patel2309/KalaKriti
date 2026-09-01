import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSubtitle?: boolean;
  textColor?: string;
}

export const KalaKritiLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  textColor,
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    hero: 'w-20 h-20',
  };

  const titleSizes = {
    sm: 'text-base font-bold tracking-wide',
    md: 'text-xl font-bold tracking-wider',
    lg: 'text-2xl font-bold tracking-widest',
    hero: 'text-4xl font-bold tracking-widest',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Visual Lotus & Tree Sacred Emblem */}
      <div className={`relative flex-shrink-0 flex items-center justify-center ${iconSizes[size]} rounded-xl bg-[#8B5E34] text-white shadow-xs border border-[#E6D5C3]`}>
        <div className="font-serif font-bold text-lg md:text-xl text-white">K</div>
      </div>

      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-serif font-bold ${titleSizes[size]} ${
              textColor || 'text-[#8B5E34]'
            }`}
          >
            KalaKriti
          </span>
        </div>
        {showSubtitle && (
          <div className="flex flex-col text-[10px] sm:text-[11px] leading-tight text-[#3E2723] font-medium tracking-tight">
            <span className="font-semibold text-[#8B5E34]">Empowering Artisans. Enriching Lives.</span>
            <span className="text-[#8C7355] text-[9px] sm:text-[10px] italic">From Handmade Craft to Digital Market</span>
          </div>
        )}
      </div>
    </div>
  );
};
