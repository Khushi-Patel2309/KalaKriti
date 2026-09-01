import React from 'react';
import { CartItem, Product } from '../types';
import { ShoppingBag, X, Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#3E2723]/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white border-l border-[#E6D5C3] shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F5F1EE] border-b border-[#E6D5C3] shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#8B5E34]" />
            <h2 className="text-base font-bold font-serif text-[#3E2723]">Handcrafted Bag ({items.length})</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#8C7355] hover:text-[#3E2723] rounded-lg hover:bg-black/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 mx-auto text-[#A68B6D]/50" />
              <h3 className="text-base font-bold font-serif text-[#3E2723]">Your Bag is Empty</h3>
              <p className="text-xs text-[#8C7355] max-w-xs mx-auto">
                Discover master artisans from across India and add authentic handwoven pieces to your bag.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-start gap-3 p-3.5 bg-white border border-[#E6D5C3] rounded-2xl shadow-2xs"
              >
                <div className="w-16 h-16 rounded-xl bg-[#F5F1EE] border border-[#E6D5C3] flex items-center justify-center shrink-0 overflow-hidden">
                  {item.product.imageEnhanced ? (
                    <img
                      src={item.product.imageEnhanced}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">{item.product.emoji}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#3E2723] leading-snug line-clamp-1">
                    {item.product.name}
                  </h4>
                  <p className="text-[10px] text-[#8C7355]">By {item.product.artisanName}</p>
                  <p className="text-xs font-bold font-serif text-[#8B5E34] mt-1">
                    ₹{item.product.price.toLocaleString('en-IN')}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-[#E6D5C3] rounded-lg bg-[#FAF9F7]">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[#3E2723]"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold px-2 text-[#3E2723]">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[#3E2723]"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.product.id)}
                      className="p-1 text-[#8C7355] hover:text-[#8B5E34]"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Checkout CTA */}
        {items.length > 0 && (
          <div className="p-6 bg-[#FAF9F7] border-t border-[#E6D5C3] space-y-4 shrink-0">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#8C7355]">
                <span>Estimated Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#8C7355]">
                <span>Shipping</span>
                <span className="text-[#8B5E34] font-semibold">{subtotal > 1999 ? 'FREE' : '₹99'}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#3E2723] pt-2 border-t border-[#E6D5C3]">
                <span>Total</span>
                <span className="text-[#8B5E34] font-serif text-base">
                  ₹{(subtotal + (subtotal > 1999 ? 0 : 99)).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 px-4 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-2xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
            >
              Proceed to Shipping & UPI Payment <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
