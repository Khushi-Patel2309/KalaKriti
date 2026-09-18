import React, { useState } from 'react';
import { Role, CustomerType, AuthSession } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { KalaKritiLogo } from './KalaKritiLogo';
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  ShoppingBag,
  Palette,
  Loader2,
  User,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';

interface KalaKritiLoginViewProps {
  onLoginSuccess: (session: AuthSession) => void;
  onOpenAskAi: () => void;
  initialStep?: 'choose-role' | 'artisan-login' | 'customer-login' | 'customer-type-select';
  pendingCustomerSession?: AuthSession | null;
}

export const KalaKritiLoginView: React.FC<KalaKritiLoginViewProps> = ({
  onLoginSuccess,
  onOpenAskAi,
  initialStep = 'choose-role',
  pendingCustomerSession = null,
}) => {
  const { language, setLanguage } = useLanguage();

  const [step, setStep] = useState<
    'choose-role' | 'artisan-login' | 'customer-login' | 'customer-type-select'
  >(initialStep);

  // Form State
  const [artisanIdentifier, setArtisanIdentifier] = useState('radhaben.crafts@kalakriti.in');
  const [artisanPassword, setArtisanPassword] = useState('artisan@2026');
  const [showArtisanPassword, setShowArtisanPassword] = useState(false);

  const [customerIdentifier, setCustomerIdentifier] = useState('pooja.sharma@example.com');
  const [customerPassword, setCustomerPassword] = useState('customer@2026');
  const [showCustomerPassword, setShowCustomerPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Authenticated customer awaiting customer-type selection
  const [activeCustomer, setActiveCustomer] = useState<AuthSession | null>(pendingCustomerSession);

  // Handle Artisan Submit
  const handleArtisanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!artisanIdentifier.trim()) {
      setErrorMessage(
        language === 'hi'
          ? 'कृपया अपना कारीगर ईमेल या मोबाइल नंबर दर्ज करें।'
          : 'Please enter your registered artisan email or phone number.'
      );
      return;
    }

    if (!artisanPassword || artisanPassword.length < 4) {
      setErrorMessage(
        language === 'hi'
          ? 'गलत पासवर्ड। कृपया पुनः प्रयास करें।'
          : 'Incorrect email or password. Please try again.'
      );
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Simulate validation check
      if (artisanPassword === 'fail' || artisanIdentifier === 'fail') {
        setIsLoading(false);
        setErrorMessage(
          language === 'hi'
            ? 'लॉगिन विफल: अमान्य कारीगर क्रेडेंशियल। कृपया जांचें और पुनः प्रयास करें।'
            : 'Unable to sign in. Please verify your artisan credentials and try again.'
        );
        return;
      }

      const session: AuthSession = {
        isAuthenticated: true,
        role: 'artisan',
        userId: '24453845-be88-44fc-b500-44c50344d2bb',
        userName: 'Radhaben Vankar',
        userEmail: artisanIdentifier.includes('@') ? artisanIdentifier : 'radhaben.crafts@kalakriti.in',
        userPhone: !artisanIdentifier.includes('@') ? artisanIdentifier : '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
        loginTime: Date.now(),
      };

      setIsLoading(false);
      onLoginSuccess(session);
    }, 600);
  };

  // Handle Customer Submit
  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerIdentifier.trim()) {
      setErrorMessage(
        language === 'hi'
          ? 'कृपया अपना ईमेल या मोबाइल नंबर दर्ज करें।'
          : 'Please enter your email or phone number.'
      );
      return;
    }

    if (!customerPassword || customerPassword.length < 4) {
      setErrorMessage(
        language === 'hi'
          ? 'गलत पासवर्ड। कृपया पुनः प्रयास करें।'
          : 'Incorrect email or password. Please try again.'
      );
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (customerPassword === 'fail' || customerIdentifier === 'fail') {
        setIsLoading(false);
        setErrorMessage(
          language === 'hi'
            ? 'लॉगिन विफल: अमान्य क्रेडेंशियल। कृपया पुनः प्रयास करें।'
            : 'Unable to sign in. Please try again.'
        );
        return;
      }

      const session: AuthSession = {
        isAuthenticated: true,
        role: 'customer',
        userId: 'cust_pooja',
        userName: customerIdentifier.includes('pooja') ? 'Pooja Sharma' : 'Valued Patron',
        userEmail: customerIdentifier.includes('@') ? customerIdentifier : 'pooja.sharma@example.com',
        userPhone: !customerIdentifier.includes('@') ? customerIdentifier : '+91 98234 56789',
        loginTime: Date.now(),
      };

      setIsLoading(false);
      // DO NOT immediately finalize customer type! Show Customer Type Selection!
      setActiveCustomer(session);
      setStep('customer-type-select');
    }, 600);
  };

  // Handle Customer Type Choice
  const handleSelectCustomerType = (type: CustomerType) => {
    if (!activeCustomer) return;
    const finalizedSession: AuthSession = {
      ...activeCustomer,
      customerType: type,
    };
    onLoginSuccess(finalizedSession);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-between text-[#3E2723] selection:bg-[#8B5E34]/20 selection:text-[#8B5E34]">
      {/* Top Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <KalaKritiLogo size="sm" showSubtitle={false} showTagline={false} />
            <span className="hidden sm:inline-block text-[11px] font-medium bg-[#EFE9DF] text-[#6D5843] px-3 py-1 rounded-full border border-[#E3D9CC]">
              {language === 'hi'
                ? 'हस्तशिल्प से डिजिटल बाज़ार तक'
                : 'From Handmade Craft to Digital Market'}
            </span>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-[#EDE6DC] border border-[#DDD3C5] rounded-full p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all flex items-center gap-1 cursor-pointer ${
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
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all flex items-center gap-1 font-serif cursor-pointer ${
                language === 'hi'
                  ? 'bg-[#8B5E34] text-white shadow-2xs'
                  : 'text-[#6D5843] hover:text-[#3E2723]'
              }`}
            >
              <span>हिंदी</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 flex-1 flex flex-col justify-center">
        {/* STEP 1: INITIAL WELCOME & ROLE OPTIONS */}
        {step === 'choose-role' && (
          <div className="max-w-4xl mx-auto w-full space-y-8 animate-in fade-in duration-300">
            {/* Prominent KalaKriti Branding */}
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <KalaKritiLogo
                size="hero"
                stacked={true}
                showSubtitle={true}
                showTagline={true}
              />
              <div className="pt-3 max-w-lg mx-auto">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#3E2723]">
                  {language === 'hi' ? 'कलाकृति में आपका स्वागत है' : 'Welcome to KalaKriti'}
                </h2>
                <p className="text-sm text-[#7A6450] mt-1">
                  {language === 'hi'
                    ? 'कृपया चुनें कि आप कैसे आगे बढ़ना चाहते हैं'
                    : 'Choose how you want to continue'}
                </p>
              </div>
            </div>

            {/* 2 Primary Role Cards: ARTISAN & CUSTOMER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto w-full pt-2">
              {/* Card 1: ARTISAN */}
              <div className="group relative bg-white rounded-3xl p-7 sm:p-8 border border-[#EADBC8] hover:border-[#8B5E34] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1">
                {/* Decorative pastel blob */}
                <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-[#F9E8DE] opacity-70 group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#F9E8DE] border border-[#EADBC8] flex items-center justify-center text-3xl shadow-2xs">
                    🎨
                  </div>
                  <div>
                    <span className="text-[11px] font-bold tracking-wider uppercase text-[#8B5E34]">
                      {language === 'hi' ? 'कारीगर पोर्टल' : 'Artisan Portal'}
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-[#3E2723] mt-0.5">
                      {language === 'hi' ? 'कारीगर (ARTISAN)' : 'ARTISAN'}
                    </h3>
                  </div>
                  <p className="text-sm text-[#7A6450] leading-relaxed">
                    {language === 'hi'
                      ? 'अपनी हस्तकला बेचें, अधिक ग्राहकों तक पहुंचें और सीधे भुगतान प्राप्त करें।'
                      : 'Sell your craft, reach more customers'}
                  </p>
                </div>

                <div className="relative z-10 pt-6 mt-6 border-t border-[#F2EAE0]">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setStep('artisan-login');
                    }}
                    className="w-full py-3 px-5 bg-[#8B5E34] hover:bg-[#734B26] text-white rounded-2xl text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{language === 'hi' ? 'कारीगर के रूप में जारी रखें' : 'Continue as Artisan'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card 2: CUSTOMER */}
              <div className="group relative bg-white rounded-3xl p-7 sm:p-8 border border-[#EADBC8] hover:border-[#9C5A28] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1">
                {/* Decorative pastel blob */}
                <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-[#FCEBD9] opacity-70 group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#FCEBD9] border border-[#EADBC8] flex items-center justify-center text-3xl shadow-2xs">
                    🛍️
                  </div>
                  <div>
                    <span className="text-[11px] font-bold tracking-wider uppercase text-[#9C5A28]">
                      {language === 'hi' ? 'ग्राहक बाज़ार' : 'Customer Marketplace'}
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-[#3E2723] mt-0.5">
                      {language === 'hi' ? 'ग्राहक (CUSTOMER)' : 'CUSTOMER'}
                    </h3>
                  </div>
                  <p className="text-sm text-[#7A6450] leading-relaxed">
                    {language === 'hi'
                      ? 'प्रमाणित जीआई हस्तशिल्प और बुनकर रचनाओं की खोज करें।'
                      : 'Discover authentic handmade products'}
                  </p>
                </div>

                <div className="relative z-10 pt-6 mt-6 border-t border-[#F2EAE0]">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setStep('customer-login');
                    }}
                    className="w-full py-3 px-5 bg-[#8B5E34] hover:bg-[#734B26] text-white rounded-2xl text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{language === 'hi' ? 'ग्राहक के रूप में जारी रखें' : 'Continue as Customer'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ARTISAN LOGIN FORM */}
        {step === 'artisan-login' && (
          <div className="max-w-md mx-auto w-full bg-white rounded-3xl p-7 sm:p-9 border border-[#EADBC8] shadow-lg animate-in fade-in duration-300">
            {/* Header with back navigation */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#F2EAE0]">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setStep('choose-role');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C7355] hover:text-[#3E2723] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'भूमिका चयन पर वापस' : 'Back to Role Choice'}</span>
              </button>
              <span className="text-[11px] font-bold text-[#8B5E34] bg-[#F9E8DE] px-2.5 py-1 rounded-full">
                🎨 {language === 'hi' ? 'कारीगर' : 'Artisan'}
              </span>
            </div>

            <div className="text-center space-y-1.5 mb-6">
              <h2 className="text-2xl font-serif font-bold text-[#3E2723]">
                {language === 'hi' ? 'कारीगर लॉगिन' : 'Artisan Sign In'}
              </h2>
              <p className="text-xs text-[#7A6450]">
                {language === 'hi'
                  ? 'अपनी कार्यशाला, नए उत्पाद और ऑर्डर प्रबंधित करने के लिए साइन इन करें'
                  : 'Access your workshop, manage orders, and list handcrafted creations'}
              </p>
            </div>

            {/* Error Message Display */}
            {errorMessage && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleArtisanSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5A4533] mb-1.5">
                  {language === 'hi' ? 'कारीगर ईमेल या फोन नंबर' : 'Artisan Email or Phone'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={artisanIdentifier}
                    onChange={(e) => setArtisanIdentifier(e.target.value)}
                    required
                    placeholder="e.g. radhaben.crafts@kalakriti.in"
                    className="w-full pl-10 pr-3 py-2.5 bg-[#FAF9F7] border border-[#E6D5C3] rounded-xl text-xs text-[#3E2723] placeholder:text-[#A68B6D] focus:outline-hidden focus:ring-2 focus:ring-[#8B5E34] transition-all"
                  />
                  <Mail className="w-4 h-4 text-[#8C7355] absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#5A4533]">
                    {language === 'hi' ? 'पासवर्ड / पिन' : 'Password or PIN'}
                  </label>
                  <span className="text-[10px] text-[#8C7355]">
                    {language === 'hi' ? 'डेमो पिन: artisan@2026' : 'Demo PIN: artisan@2026'}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showArtisanPassword ? 'text' : 'password'}
                    value={artisanPassword}
                    onChange={(e) => setArtisanPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#FAF9F7] border border-[#E6D5C3] rounded-xl text-xs text-[#3E2723] placeholder:text-[#A68B6D] focus:outline-hidden focus:ring-2 focus:ring-[#8B5E34] transition-all"
                  />
                  <Lock className="w-4 h-4 text-[#8C7355] absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowArtisanPassword(!showArtisanPassword)}
                    className="absolute right-3 top-3 text-[#8C7355] hover:text-[#3E2723]"
                    title="Toggle password"
                  >
                    {showArtisanPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-5 bg-[#8B5E34] hover:bg-[#734B26] disabled:opacity-70 text-white rounded-2xl text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{language === 'hi' ? 'सत्यापित किया जा रहा है...' : 'Signing in to Workshop...'}</span>
                  </>
                ) : (
                  <>
                    <span>{language === 'hi' ? 'कारीगर कार्यशाला में प्रवेश करें' : 'Sign In to Artisan Workshop'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Fill Helper */}
            <div className="mt-5 pt-4 border-t border-[#F2EAE0] text-center">
              <button
                type="button"
                onClick={() => {
                  setArtisanIdentifier('radhaben.crafts@kalakriti.in');
                  setArtisanPassword('artisan@2026');
                  setErrorMessage(null);
                }}
                className="text-[11px] font-semibold text-[#8B5E34] hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-[#D8962B]" />
                <span>
                  {language === 'hi'
                    ? 'राधाबेन वणकर डेमो क्रेडेंशियल भरें'
                    : 'Auto-fill Radhaben Vankar Demo Credentials'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CUSTOMER LOGIN FORM */}
        {step === 'customer-login' && (
          <div className="max-w-md mx-auto w-full bg-white rounded-3xl p-7 sm:p-9 border border-[#EADBC8] shadow-lg animate-in fade-in duration-300">
            {/* Header with back navigation */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#F2EAE0]">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setStep('choose-role');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C7355] hover:text-[#3E2723] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'भूमिका चयन पर वापस' : 'Back to Role Choice'}</span>
              </button>
              <span className="text-[11px] font-bold text-[#9C5A28] bg-[#FCEBD9] px-2.5 py-1 rounded-full">
                🛍️ {language === 'hi' ? 'ग्राहक' : 'Customer'}
              </span>
            </div>

            <div className="text-center space-y-1.5 mb-6">
              <h2 className="text-2xl font-serif font-bold text-[#3E2723]">
                {language === 'hi' ? 'ग्राहक लॉगिन' : 'Customer Sign In'}
              </h2>
              <p className="text-xs text-[#7A6450]">
                {language === 'hi'
                  ? 'भारत के मास्टर बुनकरों और कारीगरों से हस्तशिल्प खरीदने के लिए साइन इन करें'
                  : 'Sign in to explore and shop authentic GI-certified Indian handicrafts'}
              </p>
            </div>

            {/* Error Message Display */}
            {errorMessage && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleCustomerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5A4533] mb-1.5">
                  {language === 'hi' ? 'ईमेल या फोन नंबर' : 'Email or Mobile Number'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customerIdentifier}
                    onChange={(e) => setCustomerIdentifier(e.target.value)}
                    required
                    placeholder="e.g. pooja.sharma@example.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-[#FAF9F7] border border-[#E6D5C3] rounded-xl text-xs text-[#3E2723] placeholder:text-[#A68B6D] focus:outline-hidden focus:ring-2 focus:ring-[#8B5E34] transition-all"
                  />
                  <Mail className="w-4 h-4 text-[#8C7355] absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#5A4533]">
                    {language === 'hi' ? 'पासवर्ड / पिन' : 'Password or PIN'}
                  </label>
                  <span className="text-[10px] text-[#8C7355]">
                    {language === 'hi' ? 'डेमो पिन: customer@2026' : 'Demo PIN: customer@2026'}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showCustomerPassword ? 'text' : 'password'}
                    value={customerPassword}
                    onChange={(e) => setCustomerPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#FAF9F7] border border-[#E6D5C3] rounded-xl text-xs text-[#3E2723] placeholder:text-[#A68B6D] focus:outline-hidden focus:ring-2 focus:ring-[#8B5E34] transition-all"
                  />
                  <Lock className="w-4 h-4 text-[#8C7355] absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowCustomerPassword(!showCustomerPassword)}
                    className="absolute right-3 top-3 text-[#8C7355] hover:text-[#3E2723]"
                    title="Toggle password"
                  >
                    {showCustomerPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-5 bg-[#8B5E34] hover:bg-[#734B26] disabled:opacity-70 text-white rounded-2xl text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{language === 'hi' ? 'साइन इन हो रहा है...' : 'Signing in...'}</span>
                  </>
                ) : (
                  <>
                    <span>{language === 'hi' ? 'ग्राहक के रूप में जारी रखें' : 'Continue to Customer Profile'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Fill Helper */}
            <div className="mt-5 pt-4 border-t border-[#F2EAE0] text-center">
              <button
                type="button"
                onClick={() => {
                  setCustomerIdentifier('pooja.sharma@example.com');
                  setCustomerPassword('customer@2026');
                  setErrorMessage(null);
                }}
                className="text-[11px] font-semibold text-[#8B5E34] hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-[#D8962B]" />
                <span>
                  {language === 'hi'
                    ? 'पूजा शर्मा डेमो क्रेडेंशियल भरें'
                    : 'Auto-fill Pooja Sharma Demo Credentials'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CUSTOMER TYPE SELECTION (MANDATORY AFTER CUSTOMER LOGIN) */}
        {step === 'customer-type-select' && (
          <div className="max-w-3xl mx-auto w-full space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-2 max-w-lg mx-auto">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B5E34] bg-[#F9E8DE] px-3 py-1 rounded-full">
                {language === 'hi' ? 'ग्राहक प्रोफ़ाइल सेटअप' : 'Customer Profile Setup'}
              </span>
              <h2 className="text-3xl font-serif font-bold text-[#3E2723]">
                {language === 'hi' ? 'आप कलाकृति का उपयोग कैसे करेंगे?' : 'How will you use KalaKriti?'}
              </h2>
              <p className="text-xs sm:text-sm text-[#7A6450]">
                {language === 'hi'
                  ? 'अपनी आवश्यकताओं के अनुसार व्यक्तिगत अनुभव का चयन करें'
                  : 'Please select how you plan to shop so we can customize your marketplace view'}
              </p>
            </div>

            {/* 2 Customer Type Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Option A: INDIVIDUAL CUSTOMER */}
              <div className="group relative bg-white rounded-3xl p-7 border border-[#EADBC8] hover:border-[#8B5E34] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1">
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#FCEBD9] opacity-70 group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

                <div className="relative z-10 space-y-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-[#FCEBD9] border border-[#EADBC8] flex items-center justify-center text-3xl shadow-2xs">
                    🛍️
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B5E34]">
                      {language === 'hi' ? 'व्यक्तिगत खरीदारी' : 'Personal Shopping'}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#3E2723] mt-0.5">
                      {language === 'hi' ? 'व्यक्तिगत ग्राहक' : 'INDIVIDUAL CUSTOMER'}
                    </h3>
                  </div>
                  <p className="text-xs text-[#7A6450] leading-relaxed">
                    {language === 'hi'
                      ? 'अपने और अपने परिवार के लिए प्रामाणिक हस्तशिल्प खोजें और खरीदें।'
                      : 'Discover and shop handmade products for yourself.'}
                  </p>

                  <div className="pt-2 text-[11px] text-[#8C7355] space-y-1 font-medium">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8B5E34]" />
                      <span>{language === 'hi' ? 'कारीगरों को सीधा UPI भुगतान' : 'Direct UPI payments to artisans'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8B5E34]" />
                      <span>{language === 'hi' ? 'लाइव कूरियर ट्रैकिंग व रिटर्न' : 'Live courier tracking & returns'}</span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-6 mt-6 border-t border-[#F2EAE0]">
                  <button
                    type="button"
                    onClick={() => handleSelectCustomerType('individual')}
                    className="w-full py-3 px-5 bg-[#8B5E34] hover:bg-[#734B26] text-white rounded-2xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{language === 'hi' ? 'व्यक्तिगत ग्राहक के रूप में जारी रखें' : 'Continue as Individual Customer'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Option B: B2B BUYER */}
              <div className="group relative bg-white rounded-3xl p-7 border border-[#D9E3D8] hover:border-[#4A6741] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1">
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#E5ECE5] opacity-70 group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

                <div className="relative z-10 space-y-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-[#E5ECE5] border border-[#D9E3D8] flex items-center justify-center text-3xl shadow-2xs">
                    🏢
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A6741]">
                      {language === 'hi' ? 'थोक व कॉर्पोरेट ऑर्डर' : 'Wholesale & Bulk'}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#3E2723] mt-0.5">
                      {language === 'hi' ? 'बी2बी क्रेता' : 'B2B BUYER'}
                    </h3>
                  </div>
                  <p className="text-xs text-[#7A6450] leading-relaxed">
                    {language === 'hi'
                      ? 'अपने व्यवसाय, संगठन या थोक आवश्यकताओं के लिए हस्तशिल्प उत्पाद प्राप्त करें।'
                      : 'Source handmade products for your business, organization, or bulk requirements.'}
                  </p>

                  <div className="pt-2 text-[11px] text-[#4A6741] space-y-1 font-medium">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4A6741]" />
                      <span>{language === 'hi' ? 'थोक मूल्य और कस्टम नमूने' : 'Wholesale pricing tiers & custom sampling'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4A6741]" />
                      <span>{language === 'hi' ? 'जीएसटी चालान व क्लस्टर अनुबंध' : 'GST compliant invoicing & cluster contracts'}</span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-6 mt-6 border-t border-[#E8EFE8]">
                  <button
                    type="button"
                    onClick={() => handleSelectCustomerType('b2b')}
                    className="w-full py-3 px-5 bg-[#4A6741] hover:bg-[#3B5434] text-white rounded-2xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{language === 'hi' ? 'बी2बी क्रेता के रूप में जारी रखें' : 'Continue as B2B Buyer'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Re-authenticate / Switch Account Option */}
            <div className="text-center pt-3">
              <button
                type="button"
                onClick={() => {
                  setActiveCustomer(null);
                  setStep('choose-role');
                }}
                className="text-xs text-[#8C7355] hover:text-[#3E2723] underline cursor-pointer"
              >
                {language === 'hi' ? '← किसी अन्य खाते से साइन इन करें' : '← Sign in with a different account'}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
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

      {/* Persistent Floating "Ask KalaKriti AI" Button */}
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
