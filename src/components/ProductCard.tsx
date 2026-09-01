import React from 'react';
import { Product } from '../types';
import { ShoppingBag, Sparkles, MapPin, Tag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  onAddToCart?: (e: React.MouseEvent, product: Product) => void;
  showArtisan?: boolean;
  showStatus?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  onAddToCart,
  showArtisan = true,
  showStatus = false,
}) => {
  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col bg-white border border-[#E6D5C3] rounded-3xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#8B5E34]/40 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
    >
      {/* Image Thumbnail Container */}
      <div className="relative w-full aspect-square bg-[#F5F1EE]/60 border-b border-[#E6D5C3] overflow-hidden flex items-center justify-center p-4">
        {product.imageEnhanced ? (
          <img
            src={product.imageEnhanced}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
          />
        ) : (
          <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
            {product.emoji}
          </span>
        )}

        {/* Discount Tag */}
        {product.oldPrice && (
          <span className="absolute top-3 left-3 text-[10px] font-bold bg-[#8B5E34] text-white px-2.5 py-0.5 rounded-full shadow-2xs">
            SAVE {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
          </span>
        )}

        {/* Status Tag */}
        {showStatus && (
          <span
            className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
              product.status === 'published'
                ? 'bg-[#F5F1EE] text-[#8B5E34] border border-[#E6D5C3]'
                : 'bg-[#FDFBF9] text-[#8C7355] border border-[#E6D5C3]'
            }`}
          >
            {product.status}
          </span>
        )}
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-1 p-4 space-y-2">
        <div className="flex items-center justify-between gap-1 text-[11px] text-[#8B5E34] font-bold uppercase tracking-wider">
          <span>{product.category}</span>
          <span className="text-[10px] font-normal text-[#8C7355]">Handmade</span>
        </div>

        <h3 className="text-sm font-bold text-[#3E2723] leading-snug line-clamp-2 group-hover:text-[#8B5E34] transition-colors">
          {product.name}
        </h3>

        {showArtisan && (
          <p className="text-[11px] text-[#8C7355] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5E34]" /> {product.artisanName} · {product.artisanLocation.split(',')[0]}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 mt-auto border-t border-[#E6D5C3]">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold font-serif text-[#8B5E34]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-[#A68B6D] line-through">
                ₹{product.oldPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {onAddToCart && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(e, product);
              }}
              className="p-2 text-[#3E2723] hover:text-white bg-[#F5F1EE] hover:bg-[#8B5E34] border border-[#E6D5C3] rounded-xl shadow-2xs transition-all"
              title="Add to cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
