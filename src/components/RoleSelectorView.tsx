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
  onSearch: (query: string) => void;
  onOpenAskAi: () => void;
}

export const RoleSelectorView: React.FC<RoleSelectorViewProps> = ({
  onSelectRole,
  onSearch,
  onOpenAskAi,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      onSelectRole('customer');
    }
  };

  const handlePillClick = (action: 'catalog' | 'b2b' | 'artisan') => {
    if (action === 'catalog') onSelectRole('catalog');
    else if (action === 'b2b') onSelectRole('b2b');
    else if (action === 'artisan') onSelectRole('artisan');
  };

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
      id: 'admin',
      icon: '🛡️',
      title: t.roleAdminTitle,
      description: t.roleAdminDesc,
      actionText: t.roleAdminAction,
      blobColor: 'bg-[#E6E8EB]',
      textColor: 'text-[#4A5568]',
      borderColor: 'border-[#D8DCE0]',
      hoverBorder: 'hover:border-[#4A5568]',
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

        {/* Search Bar Section */}
        <div className="max-w-2xl mx-auto w-full mb-8 text-center space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center bg-white rounded-full border border-[#E5DACD] shadow-sm p-1.5 focus-within:ring-2 focus-within:ring-[#8B5E34]/30 focus-within:border-[#8B5E34] transition-all">
              <Search className="w-5 h-5 text-[#9C7A58] ml-3.5 shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={
                  language === 'hi'
                    ? 'हथकरघा साड़ियाँ, मिट्टी के बर्तन, पारंपरिक आभूषण खोजें...'
                    : 'Search handwoven sarees, pottery, jewelry...'
                }
                className="w-full px-3 py-2 text-xs sm:text-sm bg-transparent border-none focus:outline-hidden text-[#3E2723] placeholder:text-[#A89480]"
              />
              <button
                type="submit"
                className="bg-[#C05621] hover:bg-[#A8481A] text-white px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-xs shrink-0"
              >
                {t.searchBtn}
              </button>
            </div>
          </form>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
            <button
              type="button"
              onClick={() => handlePillClick('catalog')}
              className="px-4 py-1.5 bg-white hover:bg-[#F5EFE6] text-[#5C4632] rounded-full border border-[#E5DACD] font-medium transition-all shadow-2xs hover:shadow-xs"
            >
              {t.pillBrowseCatalog}
            </button>
            <button
              type="button"
              onClick={() => handlePillClick('b2b')}
              className="px-4 py-1.5 bg-white hover:bg-[#F5EFE6] text-[#5C4632] rounded-full border border-[#E5DACD] font-medium transition-all shadow-2xs hover:shadow-xs"
            >
              {t.pillFindArtisans}
            </button>
            <button
              type="button"
              onClick={() => handlePillClick('artisan')}
              className="px-4 py-1.5 bg-white hover:bg-[#F5EFE6] text-[#5C4632] rounded-full border border-[#E5DACD] font-medium transition-all shadow-2xs hover:shadow-xs"
            >
              {t.pillBecomeArtisan}
            </button>
          </div>
        </div>

        {/* 5 Role Selection Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-4 lg:gap-5">
          {rolesConfig.map((role) => (
            <div
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              className={`group relative bg-white rounded-3xl p-6 sm:p-5 lg:p-6 border ${role.borderColor} ${role.hoverBorder} shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden hover:-translate-y-1`}
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
