import React, { useState } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, SlidersHorizontal, ArrowRight, ShieldCheck, Truck, QrCode } from 'lucide-react';

interface CustomerShopProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (e: React.MouseEvent, product: Product) => void;
  searchQuery: string;
  onNavigateToArtisan?: () => void;
}

export const CustomerShop: React.FC<CustomerShopProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  searchQuery,
  onNavigateToArtisan,
}) => {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');

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
          <div className="p-16 text-center bg-white border border-[#E6D5C3] rounded-3xl space-y-3 shadow-xs">
            <p className="text-3xl">🏺</p>
            <h3 className="text-lg font-bold font-serif text-[#3E2723]">{t.noProductsFound}</h3>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs transition-colors"
            >
              {t.clearFilters}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => onSelectProduct(product)}
                onAddToCart={(e) => onAddToCart(e, product)}
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
