import React, { useState } from 'react';
import { Product, ArtisanProfile } from '../types';
import { X, ShoppingBag, Truck, ShieldCheck, Heart, Share2, Sparkles, Check, AlertCircle, Edit, MapPin, Tag } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  currentArtisanProfile?: ArtisanProfile;
  currentRole: string;
  onEditProduct?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onBuyNow,
  currentArtisanProfile,
  currentRole,
  onEditProduct,
}) => {
  const [selectedQty, setSelectedQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'craft' | 'care'>('details');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !product) return null;

  // Check if this product belongs to the viewing artisan
  const isOwnProduct =
    (currentRole === 'artisan' && (product.artisanId === currentArtisanProfile?.id || product.artisanName === currentArtisanProfile?.name)) ||
    (currentArtisanProfile && product.artisanId === currentArtisanProfile.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3E2723]/60 backdrop-blur-xs">
      <div className="w-full max-w-4xl bg-white border border-[#E6D5C3] rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F5F1EE] border-b border-[#E6D5C3] shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-bold text-[#8B5E34] bg-white border border-[#E6D5C3] px-2.5 py-0.5 rounded-md">
              {product.category}
            </span>
            <span className="text-xs text-[#8C7355]">Handmade Artisan Heritage</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 text-[#8C7355] hover:text-[#8B5E34] hover:bg-black/5 rounded-lg text-xs flex items-center gap-1"
              title="Share product link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-[#8C7355] hover:text-[#3E2723] p-1.5 rounded-lg hover:bg-black/5"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Product Image */}
            <div className="space-y-3">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#F5F1EE]/50 border border-[#E6D5C3] shadow-xs flex items-center justify-center p-4">
                {product.imageEnhanced ? (
                  <img
                    src={product.imageEnhanced}
                    alt={product.name}
                    className="w-full h-full object-contain drop-shadow-md"
                  />
                ) : (
                  <span className="text-8xl">{product.emoji}</span>
                )}

                {product.oldPrice && (
                  <span className="absolute top-4 left-4 text-xs font-bold bg-[#8B5E34] text-white px-2.5 py-1 rounded-full shadow-xs">
                    SAVE {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                  </span>
                )}
              </div>

              {/* Artisan Badge */}
              <div className="p-3 bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#8B5E34] text-white flex items-center justify-center font-bold font-serif">
                    {product.artisanName.charAt(0)}
                  </div>
                  <div>
                    <strong className="text-[#3E2723] block">{product.artisanName}</strong>
                    <span className="text-[#8C7355] flex items-center gap-0.5 text-[11px]">
                      <MapPin className="w-3 h-3 text-[#8B5E34]" /> {product.artisanLocation}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#8B5E34] bg-white px-2 py-0.5 rounded-full border border-[#E6D5C3]">
                  ✓ Verified Artisan
                </span>
              </div>
            </div>

            {/* Right: Details & Purchase Actions */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold font-serif text-[#3E2723] leading-snug">
                  {product.name}
                </h1>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-2xl font-bold font-serif text-[#8B5E34]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.oldPrice && (
                    <span className="text-sm text-[#A68B6D] line-through">
                      ₹{product.oldPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="text-xs text-[#8B5E34] font-semibold bg-[#F5F1EE] border border-[#E6D5C3] px-2 py-0.5 rounded-md">
                    Fair-Trade Guaranteed
                  </span>
                </div>
              </div>

              {/* Anti-Self-Purchase Notice for Artisans */}
              {isOwnProduct ? (
                <div className="p-4 bg-[#F5F1EE] border-2 border-[#8B5E34] rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8B5E34]">
                    <AlertCircle className="w-4 h-4 text-[#8B5E34]" />
                    <span>You are viewing your own product listing</span>
                  </div>
                  <p className="text-xs text-[#6D5843]">
                    Artisans cannot purchase their own products. You can edit this item, adjust inventory, or view performance in your Artisan Catalog.
                  </p>
                  {onEditProduct && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onEditProduct(product);
                      }}
                      className="mt-2 px-4 py-2 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit Product Listing
                    </button>
                  )}
                </div>
              ) : (
                /* Customer Purchase Controls */
                <div className="p-4 bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#3E2723]">Select Quantity</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                        className="w-7 h-7 bg-white border border-[#E6D5C3] rounded-lg flex items-center justify-center font-bold text-[#3E2723] hover:bg-[#F5F1EE]"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold px-2 text-[#3E2723]">{selectedQty}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedQty(Math.min(product.quantity || 10, selectedQty + 1))}
                        className="w-7 h-7 bg-white border border-[#E6D5C3] rounded-lg flex items-center justify-center font-bold text-[#3E2723] hover:bg-[#F5F1EE]"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        for (let i = 0; i < selectedQty; i++) onAddToCart(product);
                      }}
                      className="py-3 px-4 text-xs font-bold text-[#3E2723] bg-white border border-[#E6D5C3] hover:bg-[#FAF9F7] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#8B5E34]" /> Add to Cart
                    </button>
                    <button
                      type="button"
                      onClick={() => onBuyNow(product)}
                      className="py-3 px-4 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      Buy Now (UPI / QR)
                    </button>
                  </div>
                </div>
              )}

              {/* Tabs for Story, Craft & Specifications */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 border-b border-[#E6D5C3] pb-2 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveTab('details')}
                    className={`pb-1 border-b-2 transition-all ${
                      activeTab === 'details' ? 'border-[#8B5E34] text-[#8B5E34] font-bold' : 'border-transparent text-[#8C7355]'
                    }`}
                  >
                    Product Description
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('craft')}
                    className={`pb-1 border-b-2 transition-all ${
                      activeTab === 'craft' ? 'border-[#8B5E34] text-[#8B5E34] font-bold' : 'border-transparent text-[#8C7355]'
                    }`}
                  >
                    Craft & Technique
                  </button>
                </div>

                {activeTab === 'details' && (
                  <div className="space-y-2 text-xs text-[#6D5843] leading-relaxed">
                    <p>{product.descriptionEnglish}</p>
                    {product.descriptionHindi && (
                      <p className="p-3 bg-[#FAF9F7] rounded-xl border border-[#E6D5C3] italic text-[#8C7355]">
                        {product.descriptionHindi}
                      </p>
                    )}
                  </div>
                )}

                {activeTab === 'craft' && (
                  <div className="space-y-2 text-xs text-[#6D5843]">
                    <p><strong className="text-[#3E2723]">Craft Technique:</strong> {product.craftTechnique || 'Traditional Indian Handcraft'}</p>
                    <p><strong className="text-[#3E2723]">Materials Used:</strong> {product.materials || 'Sustainably sourced natural materials'}</p>
                    <p><strong className="text-[#3E2723]">Dominant Shades:</strong> {product.color || 'Natural mineral dyes'}</p>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {product.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] font-medium bg-[#F5F1EE] text-[#6D5843] px-2 py-0.5 rounded-md border border-[#E6D5C3] flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5 text-[#8B5E34]" /> {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
