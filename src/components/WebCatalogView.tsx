import React, { useState } from 'react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  BookOpen,
  Printer,
  Download,
  Share2,
  Sparkles,
  Check,
  QrCode,
  Search,
  MessageCircle,
  ExternalLink,
  X,
  Volume2,
} from 'lucide-react';

interface WebCatalogViewProps {
  products: Product[];
  onSelectProduct: (p: Product) => void;
}

export const WebCatalogView: React.FC<WebCatalogViewProps> = ({ products, onSelectProduct }) => {
  const { language, t } = useLanguage();
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = products.filter((p) => {
    const matchCat = filterCategory === 'All' || p.category === filterCategory;
    const matchSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.artisanName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const catalogUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(catalogUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'KalaKriti Master Artisan Catalog',
          text: 'Explore authentic handcrafted creations directly from master Indian artisans on KalaKriti.',
          url: catalogUrl,
        });
      } catch (err) {
        // Fallback to modal
        setIsShareModalOpen(true);
      }
    } else {
      setIsShareModalOpen(true);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Explore KalaKriti Master Artisan Catalog — authentic Indian handcrafted heritage with zero commission to master artisans: ${catalogUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-8 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-[#8B5E34]">
            {language === 'hi' ? 'साझा करने योग्य मास्टर डिजिटल लुकबुक' : 'Shareable Master Digital Lookbook'}
          </span>
          <h1 className="text-2xl font-bold font-serif text-[#3E2723] mt-1">
            {language === 'hi' ? 'कलाकृति मास्टर शिल्पी कैटलॉग' : 'KalaKriti Master Artisan Catalog'}
          </h1>
          <p className="text-xs text-[#8C7355]">
            {language === 'hi'
              ? 'इंटीरियर डिजाइनरों, कला क्यूरेटरों और सांस्कृतिक संस्थाओं के लिए सार्वजनिक डिजिटल शिल्प कैटलॉग।'
              : 'A public digital craft catalog for interior designers, curators, and cultural institutions.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Share Catalog Button */}
          <button
            type="button"
            onClick={handleNativeShare}
            className="px-4 py-2.5 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>{language === 'hi' ? 'कैटलॉग साझा करें' : 'Share Catalog'}</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2.5 text-xs font-semibold text-[#3E2723] bg-[#FAF9F7] border border-[#E6D5C3] hover:bg-[#F5F1EE] rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4 text-[#8C7355]" />
            <span>{language === 'hi' ? 'प्रिंट / PDF' : 'Print / PDF'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-white p-4 border border-[#E6D5C3] rounded-2xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? 'bg-[#8B5E34] text-white shadow-2xs'
                  : 'bg-[#FAF9F7] text-[#6D5843] border border-[#E6D5C3] hover:bg-[#F5F1EE]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#8C7355]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'hi' ? 'कैटलॉग में खोजें...' : 'Search catalog...'}
            className="w-full pl-9 pr-3 py-2 bg-[#FAF9F7] border border-[#E6D5C3] rounded-xl text-xs text-[#3E2723] focus:outline-hidden focus:ring-1 focus:ring-[#8B5E34]"
          />
        </div>
      </div>

      {/* Grid Lookbook */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center bg-white border border-[#E6D5C3] rounded-3xl space-y-4 shadow-xs">
          <p className="text-4xl">📖</p>
          <h3 className="text-lg font-bold font-serif text-[#3E2723]">
            {products.length === 0
              ? language === 'hi'
                ? 'कैटलॉग में अभी 0 उत्पाद हैं।'
                : 'The catalog currently contains 0 products.'
              : language === 'hi'
              ? 'कोई मेल खाता उत्पाद नहीं मिला।'
              : 'No matching craft items found in catalog.'}
          </h3>
          <p className="text-xs text-[#8C7355] max-w-md mx-auto">
            {products.length === 0
              ? language === 'hi'
                ? 'सभी पुराने उत्पाद हटा दिए गए हैं। कारीगर पोर्टल से नए हस्तशिल्प उत्पाद जोड़ सकते हैं।'
                : 'All previous product listings have been cleared. Artisans can manually publish craft listings using the Artisan Portal.'
              : language === 'hi'
              ? 'कृपया अन्य श्रेणी या कीवर्ड खोजें।'
              : 'Please try selecting another craft category or clearing search.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="p-5 bg-white border border-[#E6D5C3] rounded-3xl space-y-3 cursor-pointer hover:border-[#8B5E34] hover:shadow-md transition-all group"
            >
              <div className="aspect-square rounded-2xl bg-[#FAF9F7] border border-[#E6D5C3] flex items-center justify-center p-3 overflow-hidden">
                {product.imageEnhanced ? (
                  <img
                    src={product.imageEnhanced}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <span className="text-7xl">{product.emoji}</span>
                )}
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#8B5E34] uppercase">{product.category}</span>
                  <span className="text-[10px] text-[#8C7355] flex items-center gap-1 font-medium">
                    <Volume2 className="w-3 h-3 text-[#8B5E34]" />
                    {language === 'hi' ? 'वॉइस स्टोरी' : 'Voice Story'}
                  </span>
                </div>
                <h3 className="font-bold font-serif text-sm text-[#3E2723] leading-snug line-clamp-1">{product.name}</h3>
                <p className="text-[11px] text-[#8C7355] line-clamp-2">
                  {language === 'hi' && product.descriptionHindi
                    ? product.descriptionHindi
                    : product.descriptionEnglish}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-[#E6D5C3]">
                  <span className="font-serif font-bold text-sm text-[#8B5E34]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-[#8C7355] font-semibold">{product.artisanName}</span>
                </div>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProduct(product);
                    }}
                    className="w-full py-2 bg-[#FAF9F7] group-hover:bg-[#8B5E34] group-hover:text-white border border-[#E6D5C3] text-[#3E2723] rounded-xl text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'विवरण और वॉइस स्टोरी देखें' : 'View Details & Voice Story'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Share Catalog Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-[#E6D5C3] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6D5C3] pb-3">
              <h3 className="text-base font-bold font-serif text-[#3E2723]">
                {language === 'hi' ? 'कलाकृति कैटलॉग साझा करें' : 'Share KalaKriti Catalog'}
              </h3>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="text-[#8C7355] hover:text-[#3E2723] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#8C7355]">
              {language === 'hi'
                ? 'ग्राहकों, डिज़ाइनरों और सोशल मीडिया पर डिजिटल कैटलॉग साझा करने के लिए नीचे दिए गए विकल्पों का उपयोग करें:'
                : 'Share this handcrafted catalog with buyers, interior designers, and clients across channels:'}
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{language === 'hi' ? 'व्हाट्सएप (WhatsApp) पर साझा करें' : 'Share on WhatsApp'}</span>
              </button>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  readOnly
                  value={catalogUrl}
                  className="flex-1 p-2.5 bg-[#FAF9F7] border border-[#E6D5C3] rounded-xl text-xs text-[#3E2723]"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 bg-[#8B5E34] hover:bg-[#734B26] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  <span>{copied ? (language === 'hi' ? 'कॉपी हुआ!' : 'Copied!') : (language === 'hi' ? 'कॉपी करें' : 'Copy')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
