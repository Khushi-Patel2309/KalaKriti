import React, { useState } from 'react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, Printer, Download, Share2, Sparkles, Check, QrCode, Search } from 'lucide-react';

interface WebCatalogViewProps {
  products: Product[];
  onSelectProduct: (p: Product) => void;
}

export const WebCatalogView: React.FC<WebCatalogViewProps> = ({ products, onSelectProduct }) => {
  const { language, t } = useLanguage();
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [copied, setCopied] = useState(false);

  const filtered = products.filter((p) => filterCategory === 'All' || p.category === filterCategory);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              ? 'इंटीरियर डिजाइनरों, कला क्यूरेटरों और सांस्कृतिक संस्थाओं के लिए एक सार्वजनिक डिजिटल शिल्प कैटलॉग।'
              : 'A public digital craft catalog for interior designers, curators, and cultural institutions.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="px-4 py-2 text-xs font-semibold text-[#3E2723] bg-[#FAF9F7] border border-[#E6D5C3] hover:bg-[#F5F1EE] rounded-xl flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-[#8B5E34]" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}{' '}
            {copied
              ? (language === 'hi' ? 'लिंक कॉपी हुआ!' : 'Copied!')
              : (language === 'hi' ? 'कैटलॉग लिंक साझा करें' : 'Share Catalog Link')}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" /> {language === 'hi' ? 'प्रिंट / PDF डाउनलोड' : 'Print / PDF Export'}
          </button>
        </div>
      </div>

      {/* Grid Lookbook */}
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
              <span className="text-[10px] font-bold text-[#8B5E34] uppercase">{product.category}</span>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
