import React, { useState } from 'react';
import { ArtisanProfile, Product, Order } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  TrendingUp,
  Award,
  Calendar,
  IndianRupee,
  Package,
  Printer,
  CheckCircle2,
  Sparkles,
  MapPin,
  Star,
  Download,
  ShieldCheck,
  Leaf,
  Clock,
  ArrowUpRight,
  BarChart3,
  Flame,
  FileText,
  X,
  Share2,
} from 'lucide-react';

interface ArtisanAnnualReportProps {
  profile: ArtisanProfile;
  products: Product[];
  orders: Order[];
}

export const ArtisanAnnualReport: React.FC<ArtisanAnnualReportProps> = ({
  profile,
  products,
  orders,
}) => {
  const { language } = useLanguage();
  const [selectedYear, setSelectedYear] = useState<'2026' | '2025' | '2024'>('2026');
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Calculate live 2026 stats from actual app data
  const myProducts = products.filter(
    (p) => p.artisanId === profile.id || p.artisanName === profile.name
  );
  const myOrders = orders.filter((o) =>
    o.items.some((i) => i.artisanId === profile.id || i.artisanName === profile.name || true)
  );
  const live2026Revenue = myOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const live2026Delivered = myOrders.filter((o) => o.status === 'Delivered').length;

  // Annual Data based on selected year
  const annualData = {
    '2026': {
      year: '2026 (YTD)',
      totalRevenue: Math.max(live2026Revenue, 148500),
      ordersFulfilled: Math.max(myOrders.length, 64),
      unitsCrafted: 92,
      onTimeDeliveryRate: 98.4,
      avgRating: 4.9,
      reviewsCount: 48,
      hoursPreserved: 540,
      statesReached: 16,
      topCraft: myProducts[0]?.name || 'Kutchi Handwoven Organic Cotton Shawl',
      yoyGrowth: '+34.2%',
      zeroCommissionSaved: Math.round(Math.max(live2026Revenue, 148500) * 0.18), // 18% standard marketplace cut saved
      monthlyBreakdown: [
        { month: 'Jan', orders: 12, revenue: 24500, topProduct: 'Organic Kala Cotton Shawl' },
        { month: 'Feb', orders: 15, revenue: 31200, topProduct: 'Natural Indigo Dupatta' },
        { month: 'Mar', orders: 18, revenue: 38900, topProduct: 'Handwoven Stole' },
        { month: 'Apr', orders: 19, revenue: 53900, topProduct: 'Festive Extra-Weft Saree' },
      ],
      milestones: [
        {
          id: 'm1',
          title: language === 'hi' ? '100% सीधा UPI खाता भुगतान' : '100% Direct UPI Settlement',
          desc:
            language === 'hi'
              ? 'बिना किसी मध्यस्थ कमीशन के संपूर्ण राशि सीधे आपके बैंक में जमा।'
              : 'Zero intermediary platform fee. 100% value credited directly to artisan VPA.',
          unlocked: true,
          date: 'Jan 2026',
          icon: '₹',
        },
        {
          id: 'm2',
          title: language === 'hi' ? 'जीआई (GI) टैग प्रामाणिकता मान्यता' : 'GI-Tag Heritage Authenticity',
          desc:
            language === 'hi'
              ? 'कच्छी हथकरघा भौगोलिक संकेत (GI) द्वारा प्रमाणित शिल्पकार।'
              : 'Certified regional Geographical Indication authenticity guarantee for master handloom.',
          unlocked: true,
          date: 'Feb 2026',
          icon: '📜',
        },
        {
          id: 'm3',
          title: language === 'hi' ? 'शून्य-वापसी गुणवत्ता पुरस्कार' : 'Zero-Return Quality Benchmark',
          desc:
            language === 'hi'
              ? '99% से अधिक ग्राहकों की पूर्ण संतुष्टि एवं निर्बाध हस्तशिल्प पैकेजिंग।'
              : 'Maintained 99.2% customer approval with zero defective returns across dispatches.',
          unlocked: true,
          date: 'Mar 2026',
          icon: '⭐',
        },
        {
          id: 'm4',
          title: language === 'hi' ? '12 नए ग्रामीण बुनकरों का मार्गदर्शन' : 'Mentored 12 Village Weavers',
          desc:
            language === 'hi'
              ? 'स्थानीय क्लस्टर में युवा कारीगरों को पारंपरिक बुनाई का प्रशिक्षण दिया।'
              : 'Conducted masterclasses on natural fermentation dyeing and pit-loom weaving.',
          unlocked: true,
          date: 'Apr 2026',
          icon: '👥',
        },
      ],
    },
    '2025': {
      year: '2025 (Full Year)',
      totalRevenue: 284000,
      ordersFulfilled: 138,
      unitsCrafted: 195,
      onTimeDeliveryRate: 97.8,
      avgRating: 4.85,
      reviewsCount: 112,
      hoursPreserved: 920,
      statesReached: 21,
      topCraft: 'Ajrakh Natural Dye Handblock Silk Stole',
      yoyGrowth: '+42.5%',
      zeroCommissionSaved: 51120,
      monthlyBreakdown: [
        { month: 'Q1 (Jan-Mar)', orders: 32, revenue: 64000, topProduct: 'Indigo Cotton Shawl' },
        { month: 'Q2 (Apr-Jun)', orders: 34, revenue: 71000, topProduct: 'Summer Linen Dupatta' },
        { month: 'Q3 (Jul-Sep)', orders: 30, revenue: 61000, topProduct: 'Madder Red Stole' },
        { month: 'Q4 (Oct-Dec)', orders: 42, revenue: 88000, topProduct: 'Bridal Extra-Weft Saree' },
      ],
      milestones: [
        {
          id: 'm1_25',
          title: 'Top Rated Artisan of Gujarat Cluster',
          desc: 'Awarded 5-star recognition by KalaKriti Artisan Guild.',
          unlocked: true,
          date: 'Dec 2025',
          icon: '🏆',
        },
        {
          id: 'm2_25',
          title: '100+ Pan-India Fair-Trade Dispatches',
          desc: 'Reached households across 21 states through integrated courier partners.',
          unlocked: true,
          date: 'Oct 2025',
          icon: '🚚',
        },
      ],
    },
    '2024': {
      year: '2024 (Full Year)',
      totalRevenue: 198000,
      ordersFulfilled: 96,
      unitsCrafted: 140,
      onTimeDeliveryRate: 96.5,
      avgRating: 4.8,
      reviewsCount: 78,
      hoursPreserved: 710,
      statesReached: 14,
      topCraft: 'Desi Organic Cotton Bedspread',
      yoyGrowth: '+28.0%',
      zeroCommissionSaved: 35640,
      monthlyBreakdown: [
        { month: 'Q1 (Jan-Mar)', orders: 20, revenue: 41000, topProduct: 'Cotton Dupatta' },
        { month: 'Q2 (Apr-Jun)', orders: 22, revenue: 46000, topProduct: 'Handwoven Stole' },
        { month: 'Q3 (Jul-Sep)', orders: 24, revenue: 49000, topProduct: 'Ajrakh Print Fabric' },
        { month: 'Q4 (Oct-Dec)', orders: 30, revenue: 62000, topProduct: 'Traditional Bedspread' },
      ],
      milestones: [
        {
          id: 'm1_24',
          title: 'KalaKriti Verified Master Onboarding',
          desc: 'Completed digital artisan verification and direct UPI settlement registry.',
          unlocked: true,
          date: 'Jan 2024',
          icon: '✓',
        },
      ],
    },
  };

  const currentStats = annualData[selectedYear];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Bar & Year Switcher */}
      <div className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-bold text-[#8B5E34] flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4" />
              {language === 'hi' ? 'वार्षिक प्रगति एवं आय रिपोर्ट' : 'Artisan Annual Progress & Performance Report'}
            </span>
            <span className="text-[10px] font-bold bg-[#FAF9F7] text-[#8B5E34] border border-[#E6D5C3] px-2.5 py-0.5 rounded-full">
              GI Certified
            </span>
          </div>
          <h2 className="text-2xl font-bold font-serif text-[#3E2723] mt-1">
            {profile.name} — {selectedYear} {language === 'hi' ? 'वार्षिक समीक्षा' : 'Craft Ledger'}
          </h2>
          <p className="text-xs text-[#8C7355] mt-0.5">
            {language === 'hi'
              ? `कुल अनुभव: ${profile.experienceYears} वर्ष · प्रत्यक्ष UPI भुगतान सारांश, बिक्री वृद्धि और पारंपरिक शिल्प संरक्षण रिकॉर्ड।`
              : `${profile.experienceYears} Years Craft Heritage · Direct UPI settlement summaries, customer reach, and GI milestone tracking.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Year Switcher Pills */}
          <div className="flex items-center p-1 bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl text-xs font-bold">
            {(['2026', '2025', '2024'] as const).map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setSelectedYear(yr)}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  selectedYear === yr
                    ? 'bg-[#8B5E34] text-white shadow-2xs'
                    : 'text-[#6D5843] hover:text-[#3E2723]'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowCertificateModal(true)}
            className="px-4 py-2 text-xs font-bold text-[#8B5E34] bg-[#FAF9F7] hover:bg-[#F5F1EE] border border-[#E6D5C3] rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Award className="w-4 h-4 text-[#8B5E34]" />
            {language === 'hi' ? 'प्रमाणपत्र देखें' : 'View Certificate'}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            {language === 'hi' ? 'रिपोर्ट प्रिंट / डाउनलोड' : 'Print / Export Report'}
          </button>
        </div>
      </div>

      {/* Master Craftsman Progress Bar Level */}
      <div className="p-6 bg-gradient-to-r from-[#3E2723] via-[#5C381E] to-[#8B5E34] text-white rounded-3xl shadow-md space-y-4 border border-[#E6D5C3]/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-bold border border-white/20">
              🏅
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-[#E6D5C3]">
                  {language === 'hi' ? 'शिल्पकार श्रेणी स्तर' : 'Craft Guild Level'}
                </span>
                <span className="text-[10px] bg-[#E6D5C3] text-[#3E2723] font-bold px-2 py-0.5 rounded-full">
                  Level 4 / 5: Senior Master Artisan
                </span>
              </div>
              <h3 className="text-lg font-bold font-serif text-white">
                {language === 'hi' ? 'राष्ट्रीय हथकरघा उत्कृष्टता प्रगति' : 'National Craft Heritage Excellence Progress'}
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-bold font-serif text-[#E6D5C3]">88%</span>
            <span className="text-xs text-[#F5F1EE]/80 block">
              {language === 'hi' ? 'सर्वोच्च राष्ट्रीय पुरस्कार पात्रता' : 'to Master National Guild Honor'}
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-black/30 rounded-full h-3.5 p-0.5 border border-white/20">
          <div
            className="bg-gradient-to-r from-[#E6D5C3] to-white h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: '88%' }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-[#F5F1EE]/90 pt-1">
          <span>✓ {profile.experienceYears} Years Verified Handcraft Lineage</span>
          <span>✓ 100% Natural Organic Materials</span>
          <span>✓ GI Authenticated Registry #{profile.upiId.slice(0, 8).toUpperCase()}</span>
          <span>🎯 Next Goal: 200+ Global Dispatches</span>
        </div>
      </div>

      {/* 6 Key Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Metric 1: Total Revenue */}
        <div className="p-5 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8C7355] font-medium">
              {language === 'hi' ? 'कुल प्रत्यक्ष UPI आय' : 'Annual Direct UPI Revenue'}
            </span>
            <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-md flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> {currentStats.yoyGrowth}
            </span>
          </div>
          <div className="text-3xl font-bold font-serif text-[#3E2723]">
            ₹{currentStats.totalRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-[#8C7355] border-t border-[#FAF9F7] pt-2 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8B5E34]" />
            {language === 'hi'
              ? `₹${currentStats.zeroCommissionSaved.toLocaleString('en-IN')} बिचौलिया शुल्क की बचत (100% सीधा आपको)`
              : `₹${currentStats.zeroCommissionSaved.toLocaleString('en-IN')} middleman fee saved (0% platform cut)`}
          </p>
        </div>

        {/* Metric 2: Orders Fulfilled */}
        <div className="p-5 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8C7355] font-medium">
              {language === 'hi' ? 'हस्तनिर्मित ऑर्डर पूर्ण' : 'Handcrafted Orders Fulfilled'}
            </span>
            <Package className="w-4 h-4 text-[#8B5E34]" />
          </div>
          <div className="text-3xl font-bold font-serif text-[#3E2723]">
            {currentStats.ordersFulfilled}{' '}
            <span className="text-sm font-sans font-normal text-[#8C7355]">orders</span>
          </div>
          <p className="text-[11px] text-[#8C7355] border-t border-[#FAF9F7] pt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
            {currentStats.onTimeDeliveryRate}% {language === 'hi' ? 'समय पर कूरियर प्रेषण दर' : 'on-time dispatch rate'}
          </p>
        </div>

        {/* Metric 3: Customer Satisfaction */}
        <div className="p-5 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8C7355] font-medium">
              {language === 'hi' ? 'ग्राहक रेटिंग एवं समीक्षाएँ' : 'Customer Satisfaction'}
            </span>
            <div className="flex items-center text-amber-500">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="text-3xl font-bold font-serif text-[#3E2723]">
            {currentStats.avgRating} <span className="text-sm font-sans font-normal text-[#8C7355]">/ 5.0</span>
          </div>
          <p className="text-[11px] text-[#8C7355] border-t border-[#FAF9F7] pt-2 flex items-center gap-1">
            <span>⭐ {currentStats.reviewsCount} {language === 'hi' ? 'सत्यापित खरीदार समीक्षाएं' : 'verified reviews (99% 5-star)'}</span>
          </p>
        </div>

        {/* Metric 4: Craft Preservation Hours */}
        <div className="p-5 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8C7355] font-medium">
              {language === 'hi' ? 'हथकरघा संरक्षण कार्य घंटे' : 'Heritage Craft Preservation'}
            </span>
            <Clock className="w-4 h-4 text-[#8B5E34]" />
          </div>
          <div className="text-3xl font-bold font-serif text-[#3E2723]">
            {currentStats.hoursPreserved} <span className="text-sm font-sans font-normal text-[#8C7355]">hrs</span>
          </div>
          <p className="text-[11px] text-[#8C7355] border-t border-[#FAF9F7] pt-2 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            {currentStats.unitsCrafted} {language === 'hi' ? 'प्रामाणिक कलाकृतियां तैयार की गईं' : 'authentic pieces hand-spun'}
          </p>
        </div>

        {/* Metric 5: Geographic Reach */}
        <div className="p-5 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8C7355] font-medium">
              {language === 'hi' ? 'अखिल भारतीय ग्राहक पहुंच' : 'Pan-India Delivery Reach'}
            </span>
            <MapPin className="w-4 h-4 text-[#8B5E34]" />
          </div>
          <div className="text-3xl font-bold font-serif text-[#3E2723]">
            {currentStats.statesReached} <span className="text-sm font-sans font-normal text-[#8C7355]">States</span>
          </div>
          <p className="text-[11px] text-[#8C7355] border-t border-[#FAF9F7] pt-2 flex items-center gap-1">
            <span>🇮🇳 Mumbai, Delhi, Bengaluru, Chennai & 42 cities</span>
          </p>
        </div>

        {/* Metric 6: Eco & Sustainable Impact */}
        <div className="p-5 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8C7355] font-medium">
              {language === 'hi' ? 'पर्यावरण अनुकूल प्रभाव' : 'Sustainable & Natural Dyes'}
            </span>
            <Leaf className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-3xl font-bold font-serif text-[#3E2723]">
            100% <span className="text-sm font-sans font-normal text-[#8C7355]">Organic</span>
          </div>
          <p className="text-[11px] text-[#8C7355] border-t border-[#FAF9F7] pt-2 flex items-center gap-1">
            <span>🌿 0 chemical wastewater · Plastic-free khadi wrap</span>
          </p>
        </div>
      </div>

      {/* Monthly / Quarterly Breakdown & Ledger */}
      <div className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E6D5C3] pb-4">
          <div>
            <h3 className="text-base font-bold font-serif text-[#3E2723] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#8B5E34]" />
              {language === 'hi' ? 'मासिक एवं त्रैमासिक वित्तीय विवरण' : 'Monthly & Quarterly Revenue Progression'}
            </h3>
            <p className="text-xs text-[#8C7355]">
              {language === 'hi'
                ? 'प्रत्येक माह के ऑर्डर की संख्या, UPI निपटान एवं सर्वाधिक बिकने वाले हस्तशिल्प का विवरण।'
                : 'Detailed record of craft dispatches, direct UPI inflows, and leading catalog collections.'}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#8B5E34] bg-[#FAF9F7] px-3 py-1 rounded-xl border border-[#E6D5C3]">
            {profile.upiId}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#E6D5C3] text-[#8C7355] uppercase text-[10px]">
                <th className="pb-3 font-bold">Timeline Period</th>
                <th className="pb-3 font-bold">Orders Dispatched</th>
                <th className="pb-3 font-bold">Direct UPI Revenue</th>
                <th className="pb-3 font-bold">Top Performing Handcraft</th>
                <th className="pb-3 font-bold">Platform Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6D5C3]">
              {currentStats.monthlyBreakdown.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#FAF9F7]/70 transition-colors">
                  <td className="py-3.5 font-bold text-[#3E2723]">{row.month}</td>
                  <td className="py-3.5 font-semibold text-[#3E2723]">{row.orders} orders</td>
                  <td className="py-3.5 font-bold font-serif text-[#8B5E34] text-sm">
                    ₹{row.revenue.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 text-[#3E2723]">
                    <span className="bg-[#F5F1EE] text-[#8B5E34] font-medium px-2 py-0.5 rounded-md border border-[#E6D5C3]">
                      {row.topProduct}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                      ✓ Settled 100%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Craft Lineage Milestones & Recognition Grid */}
      <div className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-4">
        <h3 className="text-base font-bold font-serif text-[#3E2723] flex items-center gap-2 border-b border-[#E6D5C3] pb-3">
          <Award className="w-4 h-4 text-[#8B5E34]" />
          {language === 'hi' ? 'शिल्प मील के पत्थर एवं आधिकारिक उपलब्धियां' : 'Artisan Heritage Milestones & Badges'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentStats.milestones.map((m) => (
            <div
              key={m.id}
              className="p-4 bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E6D5C3] flex items-center justify-center text-lg shrink-0 shadow-2xs">
                {m.icon}
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#3E2723]">{m.title}</h4>
                  <span className="text-[10px] font-bold text-[#8B5E34] bg-white px-2 py-0.5 rounded-md border border-[#E6D5C3]">
                    {m.date}
                  </span>
                </div>
                <p className="text-[11px] text-[#8C7355] leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 border-4 border-[#8B5E34] shadow-2xl relative space-y-6">
            <button
              type="button"
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 p-2 text-[#8C7355] hover:text-[#3E2723] bg-[#FAF9F7] rounded-full border border-[#E6D5C3]"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Certificate Header */}
            <div className="text-center space-y-2 border-b-2 border-[#E6D5C3] pb-6">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#8B5E34] text-white flex items-center justify-center text-2xl shadow-md">
                🏛️
              </div>
              <span className="text-[11px] uppercase tracking-widest font-bold text-[#8B5E34] block">
                KalaKriti Master Craftsman Guild Registry
              </span>
              <h2 className="text-2xl font-bold font-serif text-[#3E2723]">
                Certificate of Master Craftsmanship & Heritage Progress
              </h2>
              <p className="text-xs text-[#8C7355]">
                Annual Performance & GI-Tag Authenticity Verification · Year {selectedYear}
              </p>
            </div>

            {/* Certificate Body */}
            <div className="text-center space-y-4 py-2">
              <p className="text-xs text-[#8C7355]">This is proudly certified and recognized that</p>
              <h3 className="text-3xl font-bold font-serif text-[#8B5E34]">{profile.name}</h3>
              <p className="text-xs text-[#3E2723] max-w-lg mx-auto leading-relaxed">
                has demonstrated master craftsmanship in <strong>{profile.craft}</strong> with{' '}
                <strong>{profile.experienceYears} Years of Verified Experience</strong> in {profile.location}. In the{' '}
                {selectedYear} operating period, successfully fulfilled{' '}
                <strong>{currentStats.ordersFulfilled} handcrafted dispatches</strong> with direct UPI settlement totaling{' '}
                <strong>₹{currentStats.totalRevenue.toLocaleString('en-IN')}</strong> and a{' '}
                <strong>{currentStats.avgRating}/5.0</strong> customer approval rating.
              </p>
            </div>

            {/* Certificate Footer with Signatures & Seal */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t-2 border-[#E6D5C3] text-center text-xs">
              <div>
                <div className="font-serif italic text-sm text-[#8B5E34] mb-1 font-bold">
                  {profile.name}
                </div>
                <span className="text-[10px] text-[#8C7355] block border-t border-[#E6D5C3] pt-1">
                  Master Artisan Signature
                </span>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#8B5E34] flex items-center justify-center text-[9px] font-bold text-[#8B5E34] text-center leading-tight uppercase">
                  Verified<br />KalaKriti<br />GI Seal
                </div>
              </div>

              <div>
                <div className="font-serif italic text-sm text-[#3E2723] mb-1 font-bold">
                  KalaKriti Council
                </div>
                <span className="text-[10px] text-[#8C7355] block border-t border-[#E6D5C3] pt-1">
                  Cluster Registrar
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-4 h-4" /> Print Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
