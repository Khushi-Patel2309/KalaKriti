import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'hero';
  showSubtitle?: boolean;
  showTagline?: boolean;
  textColor?: string;
  iconOnly?: boolean;
  stacked?: boolean;
}

export const KalaKritiEmblem: React.FC<{ sizeClass?: string; className?: string }> = ({
  sizeClass = 'w-10 h-10',
  className = '',
}) => {
  return (
    <svg
      viewBox="0 0 500 320"
      className={`${sizeClass} ${className} shrink-0 drop-shadow-2xs select-none`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="KalaKritiEmblem" transform="translate(0, -10)">
        {/* Top Terracotta / Orange Petals */}
        <path
          d="M 215,185 C 195,140 210,80 250,45 C 235,90 230,140 215,185 Z"
          fill="#C85328"
        />
        <path
          d="M 285,185 C 305,140 290,80 250,45 C 265,90 270,140 285,185 Z"
          fill="#C85328"
        />

        {/* Outer Golden Ochre Flanking Petals */}
        <path
          d="M 175,225 C 120,200 90,145 130,95 C 155,140 165,185 175,225 Z"
          fill="#D8962B"
        />
        <path
          d="M 325,225 C 380,200 410,145 370,95 C 345,140 335,185 325,225 Z"
          fill="#D8962B"
        />

        {/* Green Upper Left & Right Petals */}
        <path
          d="M 195,230 C 130,200 120,120 175,85 C 190,135 195,180 195,230 Z"
          fill="#1B4332"
        />
        <path
          d="M 305,230 C 370,200 380,120 325,85 C 310,135 305,180 305,230 Z"
          fill="#1B4332"
        />

        {/* Lower Green Broad Petals / Base */}
        <path
          d="M 250,265 C 170,265 105,220 95,160 C 145,165 200,215 250,265 Z"
          fill="#1B4332"
        />
        <path
          d="M 250,265 C 330,265 395,220 405,160 C 355,165 300,215 250,265 Z"
          fill="#1B4332"
        />

        {/* Lower Golden Ochre Accent Leaf (Right) */}
        <path
          d="M 250,265 C 320,265 385,225 405,160 C 370,215 310,255 250,265 Z"
          fill="#D8962B"
        />

        {/* Center Ivory Almond/Egg Core */}
        <path
          d="M 250,60 C 295,115 315,190 250,270 C 185,190 205,115 250,60 Z"
          fill="#FBF4EA"
          stroke="#D8962B"
          strokeWidth="2.5"
        />

        {/* Golden Tree of Life in Center */}
        <g id="TreeOfLife">
          {/* Main Trunk */}
          <path
            d="M 248.5,265 L 248.5,160 C 248.5,150 251.5,150 251.5,160 L 251.5,265 Z"
            fill="#B37D2A"
          />
          <polygon points="243,265 257,265 250,250" fill="#B37D2A" />

          {/* Center Tip Leaf */}
          <path
            d="M 250,105 C 247,112 247,118 250,125 C 253,118 253,112 250,105 Z"
            fill="#B37D2A"
          />

          {/* Level 1 Upper Branches & Leaves */}
          <path d="M 250,135 Q 242,125 238,118" stroke="#B37D2A" strokeWidth="1.8" fill="none" />
          <path d="M 238,118 C 235,114 233,120 238,124 C 241,121 240,119 238,118 Z" fill="#B37D2A" />
          
          <path d="M 250,135 Q 258,125 262,118" stroke="#B37D2A" strokeWidth="1.8" fill="none" />
          <path d="M 262,118 C 265,114 267,120 262,124 C 259,121 260,119 262,118 Z" fill="#B37D2A" />

          {/* Level 2 Branches */}
          <path d="M 250,150 Q 235,138 226,130" stroke="#B37D2A" strokeWidth="2" fill="none" />
          <path d="M 226,130 C 222,127 222,133 226,136 C 229,134 228,131 226,130 Z" fill="#B37D2A" />
          <path d="M 238,144 C 234,141 234,147 238,150 Z" fill="#B37D2A" />

          <path d="M 250,150 Q 265,138 274,130" stroke="#B37D2A" strokeWidth="2" fill="none" />
          <path d="M 274,130 C 278,127 278,133 274,136 C 271,134 272,131 274,130 Z" fill="#B37D2A" />
          <path d="M 262,144 C 266,141 266,147 262,150 Z" fill="#B37D2A" />

          {/* Level 3 Branches */}
          <path d="M 250,175 Q 230,160 218,150" stroke="#B37D2A" strokeWidth="2.2" fill="none" />
          <path d="M 218,150 C 214,146 213,153 218,157 Z" fill="#B37D2A" />
          <path d="M 230,166 C 225,162 225,169 230,173 Z" fill="#B37D2A" />

          <path d="M 250,175 Q 270,160 282,150" stroke="#B37D2A" strokeWidth="2.2" fill="none" />
          <path d="M 282,150 C 286,146 287,153 282,157 Z" fill="#B37D2A" />
          <path d="M 270,166 C 275,162 275,169 270,173 Z" fill="#B37D2A" />

          {/* Level 4 Branches */}
          <path d="M 250,205 Q 225,190 216,182" stroke="#B37D2A" strokeWidth="2.4" fill="none" />
          <path d="M 216,182 C 211,178 211,185 216,189 Z" fill="#B37D2A" />
          <path d="M 230,197 C 224,193 224,200 230,204 Z" fill="#B37D2A" />

          <path d="M 250,205 Q 275,190 284,182" stroke="#B37D2A" strokeWidth="2.4" fill="none" />
          <path d="M 284,182 C 289,178 289,185 284,189 Z" fill="#B37D2A" />
          <path d="M 270,197 C 276,193 276,200 270,204 Z" fill="#B37D2A" />

          {/* Level 5 Low Branches */}
          <path d="M 250,230 Q 232,220 225,215" stroke="#B37D2A" strokeWidth="2.2" fill="none" />
          <path d="M 225,215 C 221,211 221,218 226,222 Z" fill="#B37D2A" />
          <path d="M 250,230 Q 268,220 275,215" stroke="#B37D2A" strokeWidth="2.2" fill="none" />
          <path d="M 275,215 C 279,211 279,218 274,222 Z" fill="#B37D2A" />
        </g>

        {/* Decorative Accent Dots */}
        {/* Crown Apex */}
        <circle cx="250" cy="22" r="7" fill="#1B4332" />
        <circle cx="250" cy="42" r="4.5" fill="#D8962B" />

        {/* Left Flank Dots */}
        <circle cx="106" cy="120" r="5.5" fill="#D8962B" />
        <circle cx="114" cy="140" r="5" fill="#1B4332" />

        {/* Right Flank Dots */}
        <circle cx="394" cy="120" r="5.5" fill="#C85328" />
        <circle cx="386" cy="140" r="5" fill="#1B4332" />
      </g>
    </svg>
  );
};

export const KalaKritiLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  showTagline = false,
  textColor,
  iconOnly = false,
  stacked = false,
}) => {
  const { language, t } = useLanguage();

  const iconSizes = {
    xs: 'w-7 h-7',
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    hero: 'w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48',
  };

  const titleSizes = {
    xs: 'text-sm font-bold tracking-wider',
    sm: 'text-base font-bold tracking-wider',
    md: 'text-xl sm:text-2xl font-bold tracking-widest',
    lg: 'text-3xl sm:text-4xl font-bold tracking-widest',
    hero: 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[0.22em]',
  };

  if (iconOnly) {
    return <KalaKritiEmblem sizeClass={iconSizes[size]} className={className} />;
  }

  if (stacked) {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        <KalaKritiEmblem sizeClass={iconSizes[size]} className="mb-3 hover:scale-105 transition-transform duration-300" />
        <h1
          className={`font-serif font-bold uppercase ${titleSizes[size]} ${
            textColor || 'text-[#2B1D16]'
          }`}
        >
          {language === 'hi' ? 'KALAKRITI' : 'KALAKRITI'}
        </h1>
        {showSubtitle && (
          <p className="text-sm sm:text-base font-medium text-[#2B1D16] mt-1.5 tracking-tight">
            {t.brandSubtitle}
          </p>
        )}
        {showTagline && (
          <div className="flex flex-col items-center mt-2.5">
            {/* Golden Divider Line with Center Lotus */}
            <div className="flex items-center justify-center gap-3 my-2 w-64 sm:w-80 max-w-full mx-auto">
              <div className="h-[1.5px] bg-[#D8962B] flex-1 rounded-full" />
              <svg viewBox="0 0 32 18" className="w-6 h-3.5 text-[#D8962B] fill-current shrink-0">
                <path d="M 16,0 C 18,5 19,11 16,18 C 13,11 14,5 16,0 Z" />
                <path d="M 12,5 C 6,8 5,14 10,17 C 14,15 14,10 12,5 Z" />
                <path d="M 20,5 C 26,8 27,14 22,17 C 18,15 18,10 20,5 Z" />
              </svg>
              <div className="h-[1.5px] bg-[#D8962B] flex-1 rounded-full" />
            </div>
            <p className="text-xs sm:text-sm italic font-serif text-[#8A4B2D] tracking-wide">
              {t.brandTagline}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Visual Lotus & Tree Sacred Emblem */}
      <KalaKritiEmblem sizeClass={iconSizes[size]} />

      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-serif font-bold uppercase leading-none ${titleSizes[size]} ${
              textColor || 'text-[#2B1D16]'
            }`}
          >
            {language === 'hi' ? 'KALAKRITI' : 'KALAKRITI'}
          </span>
        </div>
        {showSubtitle && (
          <div className="flex flex-col text-[10px] sm:text-[11px] leading-tight text-[#2B1D16] font-medium tracking-tight mt-1">
            <span className="font-semibold text-[#8B5E34]">{t.brandSubtitle}</span>
            {showTagline && (
              <span className="text-[#8A4B2D] text-[9px] sm:text-[10px] italic font-serif mt-0.5">
                {t.brandTagline}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


