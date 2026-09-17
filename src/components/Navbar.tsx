import React, { useState } from 'react';
import { Role, AppNotification, AuthSession, CustomerType } from '../types';
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
  LogOut,
  ArrowRightLeft,
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
  authSession?: AuthSession | null;
  onLogout?: () => void;
  onSwitchCustomerType?: (newType: CustomerType) => void;
  onOpenCustomerTypeSelect?: () => void;
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
  authSession,
  onLogout,
  onSwitchCustomerType,
  onOpenCustomerTypeSelect,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const isArtisan = authSession?.role === 'artisan' || currentRole === 'artisan';
  const isCustomer = authSession?.role === 'customer' || currentRole === 'customer' || currentRole === 'b2b';
  const customerType: CustomerType = authSession?.customerType || (currentRole === 'b2b' ? 'b2b' : 'individual');

  const getRoleLabel = () => {
    if (isArtisan) {
      return {
        name: language === 'hi' ? 'कारीगर कार्यशाला' : 'Artisan Workshop',
        subName: authSession?.userName || 'Radhaben Vankar',
        icon: '🎨',
        color: 'bg-[#8B5E34] text-white',
      };
    }
    if (customerType === 'b2b') {
      return {
        name: language === 'hi' ? 'बी2बी थोक क्रेता' : 'B2B Wholesale Buyer',
        subName: authSession?.userName || 'B2B Client',
        icon: '🏢',
        color: 'bg-[#4A6741] text-white',
      };
    }
    return {
      name: language === 'hi' ? 'व्यक्तिगत ग्राहक' : 'Individual Customer',
      subName: authSession?.userName || 'Pooja Sharma',
      icon: '🛍️',
      color: 'bg-[#9C5A28] text-white',
    };
  };

  const roleInfo = getRoleLabel();

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E6D5C3] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">
          {/* Brand Logo */}
          <div
            onClick={() => {
              if (isArtisan) onNavigate('artisan-dashboard');
              else if (customerType === 'b2b') onNavigate('b2b');
              else onNavigate('home');
            }}
            className="cursor-pointer transition-transform hover:scale-[1.01] shrink-0"
            title="KalaKriti Home"
          >
            <KalaKritiLogo size="md" showSubtitle={true} showTagline={false} />
          </div>

          {/* Current Role & User Profile Badge */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FAF6F0] border border-[#E6D5C3] rounded-2xl text-xs font-semibold text-[#3E2723] shadow-2xs">
              <span className="text-base">{roleInfo.icon}</span>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-[#8C7355] leading-tight">{roleInfo.name}</span>
                <span className="font-bold text-[#3E2723] text-xs leading-tight">{roleInfo.subName}</span>
              </div>

              {/* Customer can switch between Individual and B2B perspectives */}
              {isCustomer && onOpenCustomerTypeSelect && (
                <button
                  type="button"
                  onClick={onOpenCustomerTypeSelect}
                  className="ml-2 text-[10px] bg-[#FAF9F7] hover:bg-[#F2EAE0] text-[#8B5E34] border border-[#E6D5C3] px-2 py-0.5 rounded-full font-bold transition-colors cursor-pointer flex items-center gap-1"
                  title={language === 'hi' ? 'ग्राहक प्रोफ़ाइल बदलें' : 'Switch Customer Profile'}
                >
                  <ArrowRightLeft className="w-2.5 h-2.5" />
                  <span>
                    {customerType === 'individual'
                      ? (language === 'hi' ? 'बी2बी' : 'B2B')
                      : (language === 'hi' ? 'रिटेल' : 'Personal')}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Center Search Input (Shown only in individual customer or catalog view) */}
          {isCustomer && customerType === 'individual' && (
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
                className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
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
                className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all flex items-center gap-1 font-serif cursor-pointer ${
                  language === 'hi'
                    ? 'bg-[#8B5E34] text-white shadow-2xs'
                    : 'text-[#6D5843] hover:text-[#3E2723] hover:bg-[#F5F1EE]'
                }`}
                title="हिंदी में बदलें"
              >
                <span>हिं</span>
              </button>
            </div>

            {/* Individual Customer Actions */}
            {isCustomer && customerType === 'individual' && (
              <>
                {/* Customer Tracking Shortcut */}
                <button
                  type="button"
                  onClick={() => onNavigate('my-orders')}
                  className={`p-2 border border-[#E6D5C3] rounded-xl text-[#3E2723] hover:text-[#8B5E34] transition-colors relative shadow-2xs cursor-pointer ${
                    activeView === 'my-orders' ? 'bg-[#FAF6F0] text-[#8B5E34]' : 'bg-white hover:bg-[#FAF9F7]'
                  }`}
                  title={t.navTracking}
                >
                  <Truck className="w-4 h-4" />
                </button>

                {/* Cart Button */}
                <button
                  type="button"
                  onClick={onOpenCart}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#8B5E34] hover:bg-[#734B26] text-white rounded-xl text-xs font-bold shadow-xs transition-transform active:scale-95 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.navCart}</span>
                  <span className="bg-[#3E2723] text-white px-1.5 py-0.2 rounded-full text-[10px]">
                    {cartCount}
                  </span>
                </button>
              </>
            )}

            {/* Artisan Portal Indicator */}
            {isArtisan && (
              <button
                type="button"
                onClick={() => onNavigate('artisan-dashboard')}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-2 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer ${
                  activeView === 'artisan-dashboard' ? 'bg-[#734B26]' : 'bg-[#8B5E34]'
                }`}
              >
                <User className="w-4 h-4" />
                <span>{t.navArtisanPortal}</span>
              </button>
            )}

            {/* B2B Portal Indicator */}
            {isCustomer && customerType === 'b2b' && (
              <button
                type="button"
                onClick={() => onNavigate('b2b')}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-2 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer ${
                  activeView === 'b2b' ? 'bg-[#3B5434]' : 'bg-[#4A6741]'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>{t.navB2BBulk}</span>
              </button>
            )}

            {/* Notification Bell */}
            <button
              type="button"
              onClick={onOpenNotifications}
              className="p-2 bg-white hover:bg-[#FAF9F7] border border-[#E6D5C3] rounded-xl text-[#3E2723] hover:text-[#8B5E34] transition-colors relative shadow-2xs cursor-pointer"
              title={t.navNotifications}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-[#8B5E34] rounded-full animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Explicit Logout Button (Required by Goal #8 & Part 10) */}
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#FAF6F0] hover:bg-[#F2EAE0] border border-[#E6D5C3] hover:border-red-300 text-[#7A6450] hover:text-red-700 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                title={language === 'hi' ? 'लॉगआउट करें' : 'Sign Out / Logout'}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{language === 'hi' ? 'लॉगआउट' : 'Logout'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Sub Navigation Bar */}
        <div className="flex sm:hidden items-center justify-between py-2 border-t border-[#E6D5C3] text-xs overflow-x-auto gap-2 no-scrollbar">
          <div className="flex items-center gap-1 px-2.5 py-1 bg-[#FAF6F0] border border-[#E6D5C3] rounded-lg text-xs font-bold shrink-0 shadow-2xs text-[#3E2723]">
            <span>{roleInfo.icon}</span>
            <span>{roleInfo.subName}</span>
          </div>

          {isCustomer && customerType === 'individual' && (
            <>
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className={`px-3 py-1 rounded-lg shrink-0 font-semibold cursor-pointer ${
                  activeView === 'home' ? 'bg-[#FAF9F7] text-[#8B5E34] border border-[#E6D5C3]' : 'text-[#6D5843]'
                }`}
              >
                🛍️ {t.navCustomerShop}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('my-orders')}
                className={`px-3 py-1 rounded-lg shrink-0 font-semibold cursor-pointer ${
                  activeView === 'my-orders' ? 'bg-[#FAF9F7] text-[#8B5E34] border border-[#E6D5C3]' : 'text-[#6D5843]'
                }`}
              >
                🚚 {t.navTracking}
              </button>
            </>
          )}

          {isCustomer && customerType === 'b2b' && (
            <span className="text-xs font-bold text-[#4A6741] px-2 py-1 bg-[#FAF6F0] rounded-lg">
              🏢 {t.roleB2BTitle} Wholesale
            </span>
          )}

          {isArtisan && (
            <span className="text-xs font-bold text-[#8B5E34] px-2 py-1 bg-[#FAF6F0] rounded-lg">
              🎨 {t.roleArtisanTitle} Dashboard
            </span>
          )}

          {/* Mobile Logout Button */}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="px-2.5 py-1 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg shrink-0 font-semibold text-xs border border-red-200 cursor-pointer flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              <span>{language === 'hi' ? 'लॉगआउट' : 'Logout'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};



