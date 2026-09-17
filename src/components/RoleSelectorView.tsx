import React, { useState } from 'react';
import { Role } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { KalaKritiLogo } from './KalaKritiLogo';
import {
  Search,
  ArrowRight,
  Sparkles,
  Bot,
  Languages,
} from 'lucide-react';

interface RoleSelectorViewProps {
  onSelectRole: (role: Role) => void;
  onSearch?: (query: string) => void;
  onOpenAskAi: () => void;
}

export const RoleSelectorView: React.FC<RoleSelectorViewProps> = ({
  onSelectRole,
  onOpenAskAi,
}) => {
  const { language, setLanguage, t } = useLanguage();

  const rolesConfig: Array<{
    id: Role;
    icon: string;
    title: string;
    description: string;
    actionText: string;
    blobColor: string;
    textColor: string;
    borderColor: string;
    hoverBorder: string;
  }> = [
    {
      id: 'artisan',
      icon: '🎨',
      title: t.roleArtisanTitle,
      description: t.roleArtisanDesc,
      actionText: t.roleArtisanAction,
      blobColor: 'bg-[#F9E8DE]',
      textColor: 'text-[#8B5E34]',
      borderColor: 'border-[#EADBC8]',
      hoverBorder: 'hover:border-[#8B5E34]',
    },
    {
      id: 'customer',
      icon: '🛍️',
      title: t.roleCustomerTitle,
      description: t.roleCustomerDesc,
      actionText: t.roleCustomerAction,
      blobColor: 'bg-[#FCEBD9]',
      textColor: 'text-[#9C5A28]',
      borderColor: 'border-[#EADBC8]',
      hoverBorder: 'hover:border-[#9C5A28]',
    },
    {
      id: 'b2b',
      icon: '🏢',
      title: t.roleB2BTitle,
      description: t.roleB2BDesc,
      actionText: t.roleB2BAction,
      blobColor: 'bg-[#E5ECE5]',
      textColor: 'text-[#4A6741]',
      borderColor: 'border-[#D9E3D8]',
      hoverBorder: 'hover:border-[#4A6741]',
    },
    {
      id: 'catalog',
      icon: '📖',
      title: t.roleCatalogTitle,
      description: t.roleCatalogDesc,
      actionText: t.roleCatalogAction,
      blobColor: 'bg-[#F9EBE0]',
      textColor: 'text-[#8B5E34]',
      borderColor: 'border-[#EADBC8]',
      hoverBorder: 'hover:border-[#8B5E34]',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-between text-[#3E2723] selection:bg-[#8B5E34]/20 selection:text-[#8B5E34]">
      {/* Top Bar Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Top Header Logo */}
          <div className="flex items-center gap-3">
            <KalaKritiLogo size="sm" showSubtitle={false} showTagline={false} />
            <span className="hidden md:inline-block text-[11px] font-medium bg-[#EFE9DF] text-[#6D5843] px-3 py-1 rounded-full border border-[#E3D9CC]">
              {language === 'hi' ? 'हस्तशिल्प से डिजिटल बाज़ार तक' : 'From Handmade Craft to Digital Market'}
            </span>
          </div>

          {/* Language Switcher Pill */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#EDE6DC] border border-[#DDD3C5] rounded-full p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all flex items-center gap-1 ${
                  language === 'en'
                    ? 'bg-[#8B5E34] text-white shadow-2xs'
                    : 'text-[#6D5843] hover:text-[#3E2723]'
                }`}
              >
                <span>EN</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all flex items-center gap-1 font-serif ${
                  language === 'hi'
                    ? 'bg-[#8B5E34] text-white shadow-2xs'
                    : 'text-[#6D5843] hover:text-[#3E2723]'
                }`}
              >
                <span>हिंदी</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 flex-1 flex flex-col justify-center">
        {/* Hero Logo Banner (Matching user's attached design) */}
        <div className="flex flex-col items-center justify-center text-center mb-6">
          <KalaKritiLogo
            size="hero"
            stacked={true}
            showSubtitle={true}
            showTagline={true}
          />
        </div>

        {/* 4 Role Selection Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto w-full mt-6 mb-8">
          {rolesConfig.map((role) => (
            <div
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              className={`group relative bg-white rounded-3xl p-6 sm:p-6 border ${role.borderColor} ${role.hoverBorder} shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden hover:-translate-y-1.5`}
            >
              {/* Top-Right Soft Decorative Pastel Shape (as seen in screenshot) */}
              <div
                className={`absolute -top-6 -right-6 w-24 h-24 rounded-full ${role.blobColor} opacity-70 group-hover:scale-125 transition-transform duration-500 pointer-events-none`}
              />

              {/* Card Top: Icon & Title */}
              <div className="relative z-10 space-y-3">
                <div className="text-3xl sm:text-4xl mb-2 filter drop-shadow-2xs">
                  {role.icon}
                </div>

                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#3E2723] group-hover:text-[#8B5E34] transition-colors">
                  {role.title}
                </h3>

                <p className="text-xs text-[#7A6450] leading-relaxed line-clamp-3">
                  {role.description}
                </p>
              </div>

              {/* Card Bottom: Action CTA */}
              <div className="relative z-10 pt-6 mt-4 border-t border-[#F2EAE0]">
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${role.textColor} group-hover:translate-x-1 transition-transform`}>
                  {role.actionText}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer & Floating AI Button */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-center text-xs text-[#8C7560] flex flex-wrap items-center justify-between gap-3 border-t border-[#E8DFC9]/60">
        <p>
          {language === 'hi'
            ? '© 2026 कलाकृति (KalaKriti) — भारतीय हस्तशिल्प और बुनकर सशक्तीकरण पहल'
            : '© 2026 KalaKriti — Indian Artisan & Rural Handcraft Preservation'}
        </p>
        <div className="flex items-center gap-4 text-xs font-medium">
          <span>{language === 'hi' ? '0% बिचौलिया शुल्क' : '0% Middleman Fee'}</span>
          <span>•</span>
          <span>{language === 'hi' ? 'सीधा UPI भुगतान' : 'Direct UPI Settlement'}</span>
          <span>•</span>
          <span>{language === 'hi' ? 'जीआई प्रामाणिकता' : 'GI Authentic'}</span>
        </div>
      </footer>

      {/* Floating "KalaKriti AI" Button (bottom-right matching user request) */}
      <button
        type="button"
        onClick={onOpenAskAi}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-5 py-3 bg-[#244238] hover:bg-[#1A3129] text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all border border-[#3E5C51] cursor-pointer"
        title={language === 'hi' ? 'कलाकृति AI से पूछें' : 'Ask KalaKriti AI'}
      >
        <Sparkles className="w-4 h-4 text-[#D8962B]" />
        <span className="text-xs font-bold font-serif tracking-wide">
          {language === 'hi' ? 'कलाकृति AI से पूछें' : 'KalaKriti AI'}
        </span>
      </button>
    </div>
  );
};
