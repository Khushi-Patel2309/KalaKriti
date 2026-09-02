import React, { useState } from 'react';
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
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ChevronDown,
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
  onOpenPortalSelect: () => void;
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
  onOpenPortalSelect,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const getRoleLabel = (role: Role) => {
    switch (role) {
      case 'artisan':
        return { name: t.roleArtisanTitle, icon: '🎨', color: 'bg-[#8B5E34] text-white' };
      case 'customer':
        return { name: t.roleCustomerTitle, icon: '🛍️', color: 'bg-[#9C5A28] text-white' };
      case 'b2b':
        return { name: t.roleB2BTitle, icon: '🏢', color: 'bg-[#4A6741] text-white' };
      case 'admin':
        return { name: t.roleAdminTitle, icon: '🛡️', color: 'bg-[#3E2723] text-white' };
      case 'catalog':
        return { name: t.roleCatalogTitle, icon: '📖', color: 'bg-[#8B5E34] text-white' };
      default:
        return { name: 'Customer', icon: '🛍️', color: 'bg-[#8B5E34] text-white' };
    }
  };

  const currentRoleInfo = getRoleLabel(currentRole);

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E6D5C3] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">
          {/* Brand Logo */}
          <div
            onClick={onOpenPortalSelect}
            className="cursor-pointer transition-transform hover:scale-[1.01] shrink-0"
            title={language === 'hi' ? 'भूमिका चयन पर वापस जाएं' : 'Back to Workspace & Role Selection'}
          >
            <KalaKritiLogo size="md" showSubtitle={true} showTagline={false} />
          </div>

          {/* Current Role Badge & Switch Role Button */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenPortalSelect}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#FAF6F0] hover:bg-[#F2EAE0] border border-[#E6D5C3] rounded-2xl text-xs font-semibold text-[#3E2723] transition-all shadow-2xs group"
              title={language === 'hi' ? 'कार्यक्षेत्र बदलें' : 'Change Job / Workspace'}
            >
              <span className="text-base">{currentRoleInfo.icon}</span>
              <span className="text-[#8C7355] font-normal">{t.workingAs}:</span>
              <span className="font-bold text-[#3E2723]">{currentRoleInfo.name}</span>
              <span className="ml-1 text-[10px] bg-[#8B5E34] text-white px-2 py-0.5 rounded-full font-bold group-hover:bg-[#734B26]">
                {t.switchRole} ⇄
              </span>
            </button>
          </div>

          {/* Center Search Input (Shown in customer/catalog view) */}
          {(currentRole === 'customer' || currentRole === 'catalog') && (
            <div className="hidden lg:flex flex-1 max-w-sm mx-2">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FDFBF9] border border-[#E6D5C3] rounded-full focus:outline-hidden focus:ring-2 focus:ring-[#8B5E34] text-[#3E2723] shadow-2xs placeholder:text-[#A68B6D]"
                />
                <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-[#8C7355]" />
              </div>
            </div>
          )}

          {/* Right Navigation & Actions */}
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

            {/* Role-Specific Actions */}
            {currentRole === 'customer' && (
              <>
                {/* Customer Tracking Shortcut */}
                <button
                  type="button"
                  onClick={() => onNavigate('my-orders')}
                  className="p-2 bg-white hover:bg-[#FAF9F7] border border-[#E6D5C3] rounded-xl text-[#3E2723] hover:text-[#8B5E34] transition-colors relative shadow-2xs"
                  title={t.navTracking}
                >
                  <Truck className="w-4 h-4" />
                </button>

                {/* Cart Button */}
                <button
                  type="button"
                  onClick={onOpenCart}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#8B5E34] hover:bg-[#734B26] text-white rounded-xl text-xs font-bold shadow-xs transition-transform active:scale-95"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.navCart}</span>
                  <span className="bg-[#3E2723] text-white px-1.5 py-0.2 rounded-full text-[10px]">
                    {cartCount}
                  </span>
                </button>
              </>
            )}

            {currentRole === 'artisan' && (
              <button
                type="button"
                onClick={() => onNavigate('artisan-dashboard')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-[#8B5E34] text-white rounded-xl text-xs font-bold shadow-xs"
              >
                <User className="w-4 h-4" />
                <span>{t.navArtisanPortal}</span>
              </button>
            )}

            {currentRole === 'b2b' && (
              <button
                type="button"
                onClick={() => onNavigate('b2b')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-[#4A6741] text-white rounded-xl text-xs font-bold shadow-xs"
              >
                <Building2 className="w-4 h-4" />
                <span>{t.navB2BBulk}</span>
              </button>
            )}

            {currentRole === 'admin' && (
              <button
                type="button"
                onClick={() => onNavigate('admin')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-[#3E2723] text-white rounded-xl text-xs font-bold shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-[#E6D5C3]" />
                <span>{t.roleAdminTitle}</span>
              </button>
            )}

            {/* Notification Bell */}
            <button
              type="button"
              onClick={onOpenNotifications}
              className="p-2 bg-white hover:bg-[#FAF9F7] border border-[#E6D5C3] rounded-xl text-[#3E2723] hover:text-[#8B5E34] transition-colors relative shadow-2xs"
              title={t.navNotifications}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-[#8B5E34] rounded-full animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Sub Navigation Bar */}
        <div className="flex sm:hidden items-center justify-between py-2 border-t border-[#E6D5C3] text-xs overflow-x-auto gap-2 no-scrollbar">
          <button
            type="button"
            onClick={onOpenPortalSelect}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#8B5E34] text-white rounded-lg font-bold shrink-0 shadow-2xs"
          >
            <span>{currentRoleInfo.icon}</span>
            <span>{t.switchRole} ⇄</span>
          </button>

          {currentRole === 'customer' && (
            <>
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className={`px-3 py-1 rounded-lg shrink-0 font-semibold ${
                  activeView === 'home' ? 'bg-[#FAF9F7] text-[#8B5E34] border border-[#E6D5C3]' : 'text-[#6D5843]'
                }`}
              >
                🛍️ {t.navCustomerShop}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('my-orders')}
                className={`px-3 py-1 rounded-lg shrink-0 font-semibold ${
                  activeView === 'my-orders' ? 'bg-[#FAF9F7] text-[#8B5E34] border border-[#E6D5C3]' : 'text-[#6D5843]'
                }`}
              >
                🚚 {t.navTracking}
              </button>
            </>
          )}

          {currentRole === 'artisan' && (
            <span className="text-xs font-bold text-[#8B5E34] px-2 py-1 bg-[#FAF6F0] rounded-lg">
              🎨 {t.roleArtisanTitle} Dashboard
            </span>
          )}

          {currentRole === 'b2b' && (
            <span className="text-xs font-bold text-[#4A6741] px-2 py-1 bg-[#FAF6F0] rounded-lg">
              🏢 {t.roleB2BTitle} Wholesale
            </span>
          )}

          {currentRole === 'admin' && (
            <span className="text-xs font-bold text-[#3E2723] px-2 py-1 bg-[#FAF6F0] rounded-lg">
              🛡️ {t.roleAdminTitle} Oversight
            </span>
          )}

          {currentRole === 'catalog' && (
            <span className="text-xs font-bold text-[#8B5E34] px-2 py-1 bg-[#FAF6F0] rounded-lg">
              📖 {t.roleCatalogTitle} Lookbook
            </span>
          )}
        </div>
      </div>
    </header>
  );
};


