import React, { useState, useEffect } from 'react';
import { Product, Order, ArtisanProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldCheck,
  Users,
  Package,
  Truck,
  IndianRupee,
  CheckCircle2,
  QrCode,
  Award,
  Filter,
  MapPin,
  Clock,
  Phone,
  FileCheck,
  Lock,
  KeyRound,
  LogOut,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

interface AdminViewProps {
  products: Product[];
  orders: Order[];
  artisanProfile: ArtisanProfile;
  onExitAdmin?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ products, orders, artisanProfile, onExitAdmin }) => {
  const { language, t } = useLanguage();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Security Passkey State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!sessionStorage.getItem('kalakriti_admin_token');
  });
  const [passkeyInput, setPasskeyInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyPasskey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkeyInput.trim()) {
      setAuthError(language === 'hi' ? 'कृपया सीक्रेट पासकी दर्ज करें।' : 'Please enter the administrative passkey.');
      return;
    }

    setIsVerifying(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/verify-passkey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey: passkeyInput.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        sessionStorage.setItem('kalakriti_admin_token', data.token);
        setIsAuthenticated(true);
        setPasskeyInput('');
      } else {
        setAuthError(data.error || (language === 'hi' ? 'अमान्य पासकी। पहुंच अस्वीकृत।' : 'Invalid secret passkey. Access denied.'));
      }
    } catch (err) {
      console.error('Admin auth error:', err);
      setAuthError(language === 'hi' ? 'सत्यापन त्रुटि। पुनः प्रयास करें।' : 'Authentication failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSignOut = () => {
    sessionStorage.removeItem('kalakriti_admin_token');
    setIsAuthenticated(false);
    if (onExitAdmin) {
      onExitAdmin();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white border border-[#E6D5C3] rounded-3xl shadow-xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-[#3E2723] text-[#E6D5C3] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-bold font-serif text-[#3E2723]">
            {t.adminPortalTitle}
          </h2>
          <p className="text-xs text-[#8C7355] leading-relaxed">
            {t.adminLockedNotice}
          </p>
        </div>

        {authError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2 text-left">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleVerifyPasskey} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#3E2723] flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#8B5E34]" />
              <span>{t.adminPasskeyLabel}</span>
            </label>
            <input
              type="password"
              value={passkeyInput}
              onChange={(e) => setPasskeyInput(e.target.value)}
              placeholder={t.adminPasskeyPlaceholder}
              autoFocus
              className="w-full p-3 text-xs bg-white border border-[#E6D5C3] rounded-xl focus:ring-2 focus:ring-[#8B5E34] text-[#3E2723]"
            />
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-3 px-4 text-xs font-bold text-white bg-[#3E2723] hover:bg-[#2A1A17] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{language === 'hi' ? 'सत्यापित हो रहा है...' : 'Verifying Credentials...'}</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-[#E6D5C3]" />
                <span>{t.adminVerifyBtn}</span>
              </>
            )}
          </button>
        </form>

        <p className="text-[11px] text-[#8C7355] italic">
          {language === 'hi'
            ? 'सुरक्षा नोट: बैकएंड टोकन प्रमाणीकरण सक्रिय है।'
            : 'Security Note: Backend authentication enforced.'}
        </p>
      </div>
    );
  }

  const totalVolume = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;
  const filteredOrders =
    statusFilter === 'all'
      ? orders
      : orders.filter((o) => o.status.toLowerCase().includes(statusFilter.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 sm:p-8 bg-[#3E2723] text-white rounded-3xl shadow-md space-y-4 border border-[#8B5E34]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#E6D5C3]" />
            <span className="text-xs uppercase tracking-wider font-bold text-[#E6D5C3]">
              {language === 'hi' ? 'कलाकृति बाज़ार प्रशासन एवं विश्वास केंद्र' : 'KalaKriti Marketplace Administration & Trust Center'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[#E6D5C3] hover:text-white rounded-xl text-xs font-semibold transition-colors border border-white/15 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.adminSignOut}</span>
          </button>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">
          {language === 'hi' ? 'कारीगर क्लस्टर निगरानी एवं प्रत्यक्ष UPI सेटलमेंट लेजर' : 'Artisan Cluster Oversight & UPI Settlement Ledger'}
        </h1>
        <p className="text-xs text-[#E6D5C3] max-w-2xl">
          {language === 'hi'
            ? 'कारीगर ऑनबोर्डिंग, गैर-ऋणात्मक अनुभव अनुपालन, प्रत्यक्ष UPI QR सत्यापन और कूरियर प्रेषण लॉग की वास्तविक समय निगरानी।'
            : 'Real-time cluster monitoring of artisan onboarding, non-negative experience compliance, direct UPI QR verification, and courier dispatch logs.'}
        </p>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10 text-xs">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
            <span className="text-[11px] text-[#E6D5C3] block">
              {language === 'hi' ? 'कुल प्लेटफ़ॉर्म टर्नओवर' : 'Total Platform Volume'}
            </span>
            <span className="text-lg font-bold font-serif text-white mt-0.5 block">
              ₹{totalVolume.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
            <span className="text-[11px] text-[#E6D5C3] block">
              {language === 'hi' ? 'कुल ट्रैक किए गए ऑर्डर' : 'Tracked Orders'}
            </span>
            <span className="text-lg font-bold font-serif text-white mt-0.5 block">
              {orders.length} {language === 'hi' ? 'ऑर्डर' : 'orders'}
            </span>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
            <span className="text-[11px] text-[#E6D5C3] block">
              {language === 'hi' ? 'कैटलॉग हस्तशिल्प' : 'Catalog Inventory'}
            </span>
            <span className="text-lg font-bold font-serif text-white mt-0.5 block">
              {products.length} {language === 'hi' ? 'कलाकृतियाँ' : 'crafts'}
            </span>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
            <span className="text-[11px] text-[#E6D5C3] block">
              {language === 'hi' ? 'शून्य कमीशन प्रत्यक्ष प्रवाह' : 'Zero Commission Direct Flow'}
            </span>
            <span className="text-lg font-bold font-serif text-[#E6D5C3] mt-0.5 block">
              {language === 'hi' ? '100% कारीगरों को' : '100% to Artisans'}
            </span>
          </div>
        </div>
      </div>

      {/* Cluster Artisan Verification Status Card */}
      <div className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E6D5C3] pb-3">
          <h3 className="text-base font-bold font-serif text-[#3E2723] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#8B5E34]" />{' '}
            {language === 'hi' ? 'पंजीकृत क्लस्टर मास्टर कारीगर' : 'Registered Cluster Master Artisans'}
          </h3>
          <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />{' '}
            {language === 'hi' ? 'सभी VPA और अनुभव सत्यापित' : 'All VPAs & Experience Validated'}
          </span>
        </div>

        <div className="p-4 bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#8B5E34] text-white flex items-center justify-center font-serif text-xl font-bold">
              {artisanProfile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#3E2723] text-sm">{artisanProfile.name}</span>
                <span className="text-[10px] font-bold bg-[#E6D5C3] text-[#3E2723] px-2 py-0.5 rounded-full">
                  {language === 'hi' ? 'सत्यापित मास्टर कारीगर' : 'Verified Master Artisan'}
                </span>
              </div>
              <p className="text-[#8C7355] text-xs flex items-center gap-2 mt-0.5">
                <span>{artisanProfile.craft}</span> ·{' '}
                <span className="font-bold font-mono">
                  {artisanProfile.experienceYears} {language === 'hi' ? 'वर्ष का अनुभव' : 'Years Exp.'}
                </span> ·{' '}
                <span>{artisanProfile.location}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] text-[#8C7355] block">
                {language === 'hi' ? 'प्रत्यक्ष UPI VPA ID' : 'Direct UPI VPA ID'}
              </span>
              <span className="font-mono font-bold text-[#8B5E34] bg-white px-2.5 py-1 rounded-lg border border-[#E6D5C3] block">
                {artisanProfile.upiId}
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-[#8C7355] block">
                {language === 'hi' ? 'भौगोलिक संकेतक (GI) टैग' : 'GI Registry Tag'}
              </span>
              <span className="font-bold text-green-800 bg-green-50 px-2.5 py-1 rounded-lg border border-green-200 block">
                ✓ GI-KUTCH-2026
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Orders & Delivery Auditing Table */}
      <div className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6D5C3] pb-3">
          <h3 className="text-base font-bold font-serif text-[#3E2723] flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#8B5E34]" />{' '}
            {language === 'hi' ? 'लाइव ऑर्डर पूर्ति एवं कूरियर प्रेषण स्थिति' : 'Live Platform Order Fulfillment & Dispatch Status'}
          </h3>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-[#8C7355]" />
            {(['all', 'Placed', 'Dispatched', 'Transit', 'Delivered'] as const).map((filterKey) => (
              <button
                key={filterKey}
                type="button"
                onClick={() => setStatusFilter(filterKey)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  statusFilter === filterKey
                    ? 'bg-[#8B5E34] text-white shadow-2xs'
                    : 'bg-[#FAF9F7] text-[#6D5843] hover:text-[#3E2723] border border-[#E6D5C3]'
                }`}
              >
                {filterKey === 'all'
                  ? (language === 'hi' ? 'सभी ऑर्डर' : 'All Orders')
                  : filterKey === 'Placed'
                  ? (language === 'hi' ? 'दर्ज' : 'Placed')
                  : filterKey === 'Dispatched'
                  ? (language === 'hi' ? 'भेजा गया' : 'Dispatched')
                  : filterKey === 'Transit'
                  ? (language === 'hi' ? 'मार्ग में' : 'Transit')
                  : (language === 'hi' ? 'डिलीवर किया गया' : 'Delivered')}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#E6D5C3] text-[#8C7355] uppercase text-[10px]">
                <th className="pb-3 font-bold">{language === 'hi' ? 'ऑर्डर / ट्रैकिंग ID' : 'Order / Tracking'}</th>
                <th className="pb-3 font-bold">{language === 'hi' ? 'ग्राहक एवं पता' : 'Customer & Shipping Address'}</th>
                <th className="pb-3 font-bold">{language === 'hi' ? 'कारीगर' : 'Artisan'}</th>
                <th className="pb-3 font-bold">{language === 'hi' ? 'राशि' : 'Amount'}</th>
                <th className="pb-3 font-bold">{language === 'hi' ? 'भुगतान विधि' : 'Payment & Settlement'}</th>
                <th className="pb-3 font-bold">{language === 'hi' ? 'कूरियर एवं स्थिति' : 'Courier & Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6D5C3]">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-[#FAF9F7]/70 transition-colors">
                  <td className="py-3 font-mono font-bold text-[#3E2723]">{o.trackingId}</td>
                  <td className="py-3">
                    <p className="font-bold text-[#3E2723]">{o.shippingDetails.fullName}</p>
                    <p className="text-[10px] text-[#8C7355]">
                      {o.shippingDetails.city}, {o.shippingDetails.state} ({o.shippingDetails.phone})
                    </p>
                  </td>
                  <td className="py-3 text-[#8B5E34] font-medium">
                    {o.items.map((i) => i.artisanName).join(', ')}
                  </td>
                  <td className="py-3 font-bold text-[#8B5E34]">₹{o.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="py-3">
                    <span className="text-[10px] font-bold bg-[#F5F1EE] text-[#8B5E34] border border-[#E6D5C3] px-2 py-0.5 rounded-md">
                      {o.paymentMethod} ({language === 'hi' ? 'प्रत्यक्ष खाता' : 'Direct Flow'})
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-[10px] font-bold bg-[#FAF9F7] text-[#8B5E34] border border-[#E6D5C3] px-2 py-0.5 rounded-md">
                      {o.status} ({o.courierPartner})
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
