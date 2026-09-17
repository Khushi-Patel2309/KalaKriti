import React, { useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Truck,
  QrCode,
  Search,
  Mic,
  MicOff,
  Volume2,
  X,
} from 'lucide-react';

interface CustomerShopProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (e: React.MouseEvent, product: Product) => void;
  searchQuery: string;
  onSearchChange?: (query: string) => void;
  cart?: CartItem[];
  onNavigateToArtisan?: () => void;
}

export const CustomerShop: React.FC<CustomerShopProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  searchQuery,
  onSearchChange,
  cart = [],
  onNavigateToArtisan,
}) => {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');
  const [isListening, setIsListening] = useState(false);
  const [voiceStatusText, setVoiceStatusText] = useState('');

  const handleVoiceSearch = () => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setVoiceStatusText(
        language === 'hi'
          ? 'आपके ब्राउज़र में वॉइस रिकॉग्निशन समर्थित नहीं है। नीचे त्वरित खोज चिप्स का उपयोग करें।'
          : 'Voice search not supported in this browser. Please use keyboard or quick search suggestions.'
      );
      setTimeout(() => setVoiceStatusText(''), 4000);
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceStatusText(
          language === 'hi'
            ? '🎙️ सुन रहे हैं... शिल्प का नाम बोलें (उदा: दुपट्टा, साड़ी, पॉटरी)'
            : '🎙️ Listening... Speak craft item (e.g. Saree, Blue Pottery, Dupatta)'
        );
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (onSearchChange) {
          onSearchChange(transcript);
        }
        setVoiceStatusText(
          language === 'hi' ? `✓ खोज रहे हैं: "${transcript}"` : `✓ Searching for: "${transcript}"`
        );
        setTimeout(() => setVoiceStatusText(''), 3000);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        setVoiceStatusText(
          language === 'hi'
            ? 'माइक्रोफ़ोन एक्सेस विफल रहा या आवाज़ साफ़ नहीं थी। पुनः प्रयास करें।'
            : 'Voice input error. Please check mic permissions or try again.'
        );
        setTimeout(() => setVoiceStatusText(''), 3500);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
      setVoiceStatusText(
        language === 'hi'
          ? 'माइक्रोफ़ोन प्रारंभ नहीं हो सका।'
          : 'Could not initialize microphone.'
      );
      setTimeout(() => setVoiceStatusText(''), 3000);
    }
  };

  const categoryOptions = [
    { key: 'All', label: t.allCategories },
    { key: 'Textiles & Weaving', label: t.catTextiles },
    { key: 'Pottery & Ceramics', label: t.catPottery },
    { key: 'Jewelry', label: t.catJewelry },
    { key: 'Woodwork', label: t.catWoodwork },
    { key: 'Metalwork', label: t.catMetalwork },
    { key: 'Home Decor', label: t.catHomeDecor },
    { key: 'Paintings & Art', label: t.catPaintings },
  ];

  const filteredProducts = products
    .filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.artisanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.descriptionHindi && p.descriptionHindi.includes(searchQuery)) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return b.createdAt - a.createdAt;
      return (b.views || 0) - (a.views || 0);
    });

  // Calculate cart qty map for fast lookup
  const cartQtyMap: Record<string, number> = {};
  cart.forEach((item) => {
    cartQtyMap[item.product.id] = (cartQtyMap[item.product.id] || 0) + item.quantity;
  });

  return (
    <div className="space-y-8">
      {/* Editorial Heritage Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#3E2723] via-[#5C3818] to-[#8B5E34] text-white p-8 sm:p-12 shadow-xl border border-[#E6D5C3]/30">
        {/* Subtle decorative motif pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none flex items-center justify-center text-9xl">
          🌸
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-xs text-[#F8F5F2] border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-[#E6D5C3]" /> {t.heroBadge}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif leading-tight tracking-tight text-white">
            {t.heroTitle}
          </h1>

          <p className="text-sm text-[#F8F5F2] leading-relaxed max-w-xl">
            {t.heroSubtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#F8F5F2]">
            <span className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-xl border border-white/10">
              <QrCode className="w-4 h-4 text-[#E6D5C3]" /> {t.heroCommissionFree}
            </span>
            <span className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-xl border border-white/10">
              <Truck className="w-4 h-4 text-[#E6D5C3]" /> {t.heroGIAssured}
            </span>
            <span className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-[#E6D5C3]" /> {t.heroArtisanCount}
            </span>
          </div>
        </div>
      </div>

      {/* Customer Portal Search & Voice Assistant Search Bar */}
      <div className="bg-white border border-[#E6D5C3] p-4 rounded-3xl shadow-xs space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-[#8C7355]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'हस्तशिल्प, शिल्पकार, शहर या सामग्री खोजें (या माइक दबाकर बोलें)...'
                  : 'Search handicrafts, artisans, craft categories, or speak with voice...'
              }
              className="w-full pl-11 pr-24 py-3 bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl text-xs sm:text-sm text-[#3E2723] placeholder:text-[#A68B6D] focus:outline-hidden focus:ring-2 focus:ring-[#8B5E34]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange && onSearchChange('')}
                className="absolute right-12 top-3 p-1 text-[#8C7355] hover:text-[#3E2723]"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {/* Dedicated Voice Assistant Microphone Button inside Search */}
            <button
              type="button"
              onClick={handleVoiceSearch}
              className={`absolute right-2 top-2 p-2 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse shadow-md ring-2 ring-red-300'
                  : 'bg-[#8B5E34] text-white hover:bg-[#734B26] shadow-2xs'
              }`}
              title={
                language === 'hi'
                  ? 'वॉइस असिस्टेंट से खोजें (बोलें)'
                  : 'Search with Voice Assistant (Speak)'
              }
            >
              {isListening ? <Mic className="w-4 h-4 animate-bounce" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Voice Status Alert / Feedback */}
        {voiceStatusText && (
          <div className="px-3.5 py-2 bg-[#FAF6F0] border border-[#E6D5C3] rounded-xl text-xs text-[#8B5E34] font-medium flex items-center gap-2 animate-in fade-in">
            <Volume2 className="w-3.5 h-3.5 shrink-0 text-[#8B5E34]" />
            <span>{voiceStatusText}</span>
          </div>
        )}

        {/* Quick Voice Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#8C7355] pt-1">
          <span className="text-[11px] font-semibold">{language === 'hi' ? 'सुझाव:' : 'Voice Suggestions:'}</span>
          {['Kala Cotton Dupatta', 'Terracotta Pot', 'Silver Jhumka', 'Madhubani Painting', 'Sheesham Tray'].map(
            (tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onSearchChange && onSearchChange(tag)}
                className="px-2.5 py-1 bg-[#FAF9F7] hover:bg-[#F5F1EE] border border-[#E6D5C3] rounded-lg text-[11px] font-medium text-[#6D5843] transition-colors"
              >
                {tag}
              </button>
            )
          )}
        </div>
      </div>

      {/* Category Pills & Filters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar max-w-full">
            {categoryOptions.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.key
                    ? 'bg-[#8B5E34] text-white shadow-xs'
                    : 'bg-white text-[#6D5843] border border-[#E6D5C3] hover:bg-[#FAF9F7]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#8C7355]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-white border border-[#E6D5C3] rounded-xl text-xs font-semibold text-[#3E2723] focus:outline-hidden focus:ring-1 focus:ring-[#8B5E34]"
            >
              <option value="featured">{t.sortFeatured}</option>
              <option value="price-low">{t.sortPriceLow}</option>
              <option value="price-high">{t.sortPriceHigh}</option>
              <option value="newest">{t.sortPopular}</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="p-16 text-center bg-white border border-[#E6D5C3] rounded-3xl space-y-4 shadow-xs">
            <p className="text-4xl">🏺</p>
            <h3 className="text-lg font-bold font-serif text-[#3E2723]">
              {products.length === 0
                ? language === 'hi'
                  ? 'कलाकृति बाज़ार में अभी कोई उत्पाद सूचीबद्ध नहीं है।'
                  : 'The KalaKriti marketplace catalog currently has zero products.'
                : t.noProductsFound}
            </h3>
            <p className="text-xs text-[#8C7355] max-w-md mx-auto">
              {products.length === 0
                ? language === 'hi'
                  ? 'कारीगर पोर्टल पर जाकर अपना नया हस्तशिल्प उत्पाद जोड़ें।'
                  : 'All previous products have been cleared. Artisans can manually create and publish fresh handcrafted listings using the Artisan Portal.'
                : language === 'hi'
                ? 'फ़िल्टर साफ़ करें या कोई भिन्न कीवर्ड खोजें।'
                : 'Try clearing filters or searching for different craft techniques.'}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              {products.length === 0 ? (
                onNavigateToArtisan && (
                  <button
                    type="button"
                    onClick={onNavigateToArtisan}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs transition-colors flex items-center gap-2"
                  >
                    <span>{language === 'hi' ? 'कारीगर पोर्टल खोलें (+ उत्पाद जोड़ें)' : 'Open Artisan Portal (+ Add Product)'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    if (onSearchChange) onSearchChange('');
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs transition-colors"
                >
                  {t.clearFilters}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => onSelectProduct(product)}
                onAddToCart={(e) => onAddToCart(e, product)}
                cartQty={cartQtyMap[product.id] || 0}
              />
            ))}
          </div>
        )}
      </div>

      {/* Artisan Collective Callout Banner */}
      <div className="p-8 bg-white border border-[#E6D5C3] rounded-3xl flex flex-wrap items-center justify-between gap-6 shadow-xs">
        <div className="max-w-xl space-y-1.5">
          <span className="text-xs uppercase tracking-wider font-bold text-[#8B5E34]">
            {language === 'hi' ? 'क्या आप भारतीय मास्टर बुनकर, कुम्हार या धातु शिल्पी हैं?' : 'Are you an Indian Master Weaver, Potter, or Metal Artisan?'}
          </span>
          <h3 className="text-xl font-bold font-serif text-[#3E2723]">
            {language === 'hi'
              ? 'आवाज़ रिकॉर्डिंग और AI फ़ोटो स्टूडियो से उत्पाद जोड़ने के लिए कलाकृति से जुड़ें'
              : 'Join KalaKriti to list your creations using voice recording & AI photo studio'}
          </h3>
          <p className="text-xs text-[#8C7355]">
            {language === 'hi'
              ? 'बिना किसी तकनीकी झंझट के अपनी भाषा में बोलें, 1-क्लिक में फ़ोटो सुधारें, और सीधे UPI भुगतान प्राप्त करें।'
              : 'Zero technical hurdles. Speak in your regional language, enhance your photos with 1 click, and receive customer orders with exact delivery addresses.'}
          </p>
        </div>

        {onNavigateToArtisan && (
          <button
            type="button"
            onClick={onNavigateToArtisan}
            className="px-6 py-3 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-2xl shadow-xs transition-transform active:scale-95 flex items-center gap-2"
          >
            {t.navArtisanPortal} <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
