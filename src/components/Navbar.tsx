import React from 'react';
import { Role, AppNotification } from '../types';
import { KalaKritiLogo } from './KalaKritiLogo';
import { useLanguage } from '../context/LanguageContext';
import {
  Bell,
  ShoppingCart,
  Search,
  User,
  Truck,
  Store,
  Building2,
  BookOpen,
  Languages,
} from 'lucide-react';

interface NavbarProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  activeView: string;
  onNavigate: (view: string, params?: any) => void;
  cartCount: number;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeView,
  onNavigate,
  cartCount,
  notifications,
  onOpenNotifications,
  onOpenCart,
  searchQuery,
  onSearchChange,
}) => {
  const { language, setLanguage, toggleLanguage, t } = useLanguage();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E6D5C3] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">
          {/* Brand Logo */}
          <div
            onClick={() => onNavigate('home')}
            className="cursor-pointer transition-transform hover:scale-[1.01] shrink-0"
          >
            <KalaKritiLogo size="md" showSubtitle={true} showTagline={false} />
          </div>

          {/* Center Search Input */}
          <div className="hidden lg:flex flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 text-xs bg-[#FDFBF9] border border-[#E6D5C3] rounded-full focus:outline-hidden focus:ring-2 focus:ring-[#8B5E34] text-[#3E2723] shadow-2xs placeholder:text-[#A68B6D]"
              />
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[#8C7355]" />
            </div>
          </div>

          {/* Right Navigation & Role Actions */}
          <div className="flex items-center gap-2">
            {/* Language Switcher Pill */}
            <div className="flex items-center bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all flex items-center gap-1 ${
                  language === 'en'
                    ? 'bg-[#8B5E34] text-white shadow-2xs'
                    : 'text-[#6D5843] hover:text-[#3E2723] hover:bg-[#F5F1EE]'
                }`}
                title="Switch to English"
              >
                <span>EN</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all flex items-center gap-1 font-serif ${
                  language === 'hi'
                    ? 'bg-[#8B5E34] text-white shadow-2xs'
                    : 'text-[#6D5843] hover:text-[#3E2723] hover:bg-[#F5F1EE]'
                }`}
                title="हिंदी में बदलें"
              >
                <span>हिं</span>
              </button>
            </div>

            {/* Quick Role Switcher Pill Bar */}
            <div className="hidden md:flex items-center p-1 bg-[#F5F1EE] rounded-2xl border border-[#E6D5C3] text-xs font-semibold">
              <button
                type="button"
                onClick={() => onRoleChange('customer')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                  currentRole === 'customer'
                    ? 'bg-[#8B5E34] text-white shadow-xs'
                    : 'text-[#6D5843] hover:text-[#3E2723] hover:bg-[#FAF9F7]'
                }`}
              >
                <Store className="w-3.5 h-3.5" /> {t.navCustomerShop}
              </button>

              <button
                type="button"
                onClick={() => onRoleChange('artisan')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                  currentRole === 'artisan'
                    ? 'bg-[#8B5E34] text-white shadow-xs'
                    : 'text-[#6D5843] hover:text-[#3E2723] hover:bg-[#FAF9F7]'
                }`}
              >
                <User className="w-3.5 h-3.5" /> {t.navArtisanPortal}
              </button>

              <button
                type="button"
                onClick={() => onRoleChange('b2b')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all ${
                  currentRole === 'b2b'
                    ? 'bg-[#8B5E34] text-white shadow-xs'
                    : 'text-[#6D5843] hover:text-[#3E2723] hover:bg-[#FAF9F7]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> {t.navB2BBulk}
              </button>

              <button
                type="button"
                onClick={() => onRoleChange('catalog')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all ${
                  currentRole === 'catalog'
                    ? 'bg-[#8B5E34] text-white shadow-xs'
                    : 'text-[#6D5843] hover:text-[#3E2723] hover:bg-[#FAF9F7]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> {t.navCatalog}
              </button>
            </div>

            {/* Customer Tracking Shortcut */}
            <button
              type="button"
              onClick={() => onNavigate('my-orders')}
              className="p-2.5 bg-white hover:bg-[#FAF9F7] border border-[#E6D5C3] rounded-xl text-[#3E2723] hover:text-[#8B5E34] transition-colors relative shadow-2xs"
              title={t.navTracking}
            >
              <Truck className="w-4 h-4" />
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={onOpenNotifications}
              className="p-2.5 bg-white hover:bg-[#FAF9F7] border border-[#E6D5C3] rounded-xl text-[#3E2723] hover:text-[#8B5E34] transition-colors relative shadow-2xs"
              title={t.navNotifications}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-[#8B5E34] rounded-full animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              type="button"
              onClick={onOpenCart}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#8B5E34] hover:bg-[#734B26] text-white rounded-xl text-xs font-bold shadow-xs transition-transform active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">{t.navCart}</span>
              <span className="bg-[#3E2723] text-white px-1.5 py-0.2 rounded-full text-[10px]">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Sub Navigation Bar */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-[#E6D5C3] text-xs overflow-x-auto gap-2 no-scrollbar">
          <button
            type="button"
            onClick={() => onRoleChange('customer')}
            className={`px-3 py-1 rounded-lg shrink-0 font-semibold ${
              currentRole === 'customer' ? 'bg-[#8B5E34] text-white' : 'text-[#6D5843]'
            }`}
          >
            🛍️ {t.navCustomerShop}
          </button>
          <button
            type="button"
            onClick={() => onRoleChange('artisan')}
            className={`px-3 py-1 rounded-lg shrink-0 font-semibold ${
              currentRole === 'artisan' ? 'bg-[#8B5E34] text-white' : 'text-[#6D5843]'
            }`}
          >
            🧑‍🎨 {t.navArtisanPortal}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('my-orders')}
            className="px-3 py-1 rounded-lg shrink-0 font-semibold text-[#6D5843] bg-white border border-[#E6D5C3]"
          >
            🚚 {t.navTracking}
          </button>
          <button
            type="button"
            onClick={() => onRoleChange('b2b')}
            className={`px-3 py-1 rounded-lg shrink-0 font-semibold ${
              currentRole === 'b2b' ? 'bg-[#8B5E34] text-white' : 'text-[#6D5843]'
            }`}
          >
            🏢 {t.navB2BBulk}
          </button>
          <button
            type="button"
            onClick={() => onRoleChange('catalog')}
            className={`px-3 py-1 rounded-lg shrink-0 font-semibold ${
              currentRole === 'catalog' ? 'bg-[#8B5E34] text-white' : 'text-[#6D5843]'
            }`}
          >
            📖 {t.navCatalog}
          </button>
        </div>
      </div>
    </header>
  );
};

