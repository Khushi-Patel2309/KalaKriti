import React, { useState } from 'react';
import { Product, CustomizationRequest } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Palette, Scissors, Ruler, MessageSquare, Check, X, User, Phone, Mail } from 'lucide-react';

interface RequestCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSubmit: (request: Omit<CustomizationRequest, 'id' | 'createdAt' | 'status'>) => void;
}

export const RequestCustomizationModal: React.FC<RequestCustomizationModalProps> = ({
  isOpen,
  onClose,
  product,
  onSubmit,
}) => {
  const { language, t } = useLanguage();

  const [color, setColor] = useState('');
  const [pattern, setPattern] = useState('');
  const [size, setSize] = useState('');
  const [message, setMessage] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !product) return null;

  const quickColors = [
    language === 'hi' ? 'गहरा नील (Indigo)' : 'Royal Indigo Blue',
    language === 'hi' ? 'गेरुआ / टेराकोटा' : 'Terracotta Rust',
    language === 'hi' ? 'मस्टर्ड / हल्दी पीला' : 'Deep Ochre Yellow',
    language === 'hi' ? 'प्राकृतिक कोरा / क्रीम' : 'Natural Raw Cream',
    language === 'hi' ? 'मद्दर लाल (Madder Red)' : 'Earthen Madder Red',
  ];

  const quickPatterns = [
    language === 'hi' ? 'पारंपरिक अजरक जाली' : 'Ajrakh Geometric Lattice',
    language === 'hi' ? 'मोर व अभला दर्पण कार्य' : 'Peacock & Abhala Mirrors',
    language === 'hi' ? 'पारंपरिक पुष्प बूटी' : 'Floral Handcrafted Butis',
    language === 'hi' ? 'मंदिर बॉर्डर किनारी' : 'Temple Border & Tassels',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg(language === 'hi' ? 'कृपया अपना नाम और संपर्क नंबर भरें।' : 'Please provide your name and contact phone.');
      return;
    }

    setErrorMsg('');
    onSubmit({
      productId: product.id,
      productName: product.name,
      productCategory: product.category,
      productPrice: product.price,
      productEmoji: product.emoji,
      productImage: product.imageEnhanced || product.imageOriginal,
      artisanId: product.artisanId,
      artisanName: product.artisanName,
      artisanLocation: product.artisanLocation,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || undefined,
      color: color.trim() || (language === 'hi' ? 'कारीगर की पसंद अनुसार' : 'Artisan Original Palette'),
      pattern: pattern.trim() || (language === 'hi' ? 'पारंपरिक क्लस्टर रूपांकन' : 'Standard Traditional Motif'),
      size: size.trim() || (language === 'hi' ? 'मानक आकार' : 'Standard Size'),
      message: message.trim(),
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3E2723]/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white border border-[#E6D5C3] rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FAF9F7] border-b border-[#E6D5C3]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#F5F1EE] text-[#8B5E34] rounded-xl border border-[#E6D5C3]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-[#3E2723]">
                {t.customizationModalTitle}
              </h3>
              <p className="text-xs text-[#8C7355]">{t.customizationModalSubtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#8C7355] hover:text-[#3E2723] rounded-lg hover:bg-black/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSubmitted ? (
          <div className="p-10 text-center space-y-4 my-auto">
            <div className="w-16 h-16 mx-auto bg-green-100 text-green-700 rounded-full flex items-center justify-center shadow-xs">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold font-serif text-[#3E2723]">
              {language === 'hi' ? 'अनुरोध सफलतापूर्वक भेजा गया!' : 'Customization Request Sent!'}
            </h4>
            <p className="text-xs text-[#6D5843] max-w-md mx-auto leading-relaxed">
              {t.customizationSubmittedToast}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Product Summary Header Pill */}
            <div className="p-3.5 bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E6D5C3] flex items-center justify-center text-xl overflow-hidden shrink-0">
                  {product.imageEnhanced ? (
                    <img src={product.imageEnhanced} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{product.emoji}</span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-[#3E2723]">{product.name}</h4>
                  <p className="text-[11px] text-[#8C7355]">
                    {language === 'hi' ? 'मास्टर कारीगर:' : 'Crafted by:'} <span className="font-semibold text-[#8B5E34]">{product.artisanName}</span> ({product.artisanLocation})
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-[#8C7355] block">{language === 'hi' ? 'मूल शिल्प मूल्य' : 'Base Price'}</span>
                <span className="font-bold font-serif text-[#8B5E34] text-sm">₹{product.price.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {/* Field 1: Color Preference */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#3E2723] flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#8B5E34]" />
                {t.customColorLabel}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {quickColors.map((qc) => (
                  <button
                    key={qc}
                    type="button"
                    onClick={() => setColor(qc)}
                    className={`px-2.5 py-1 text-[11px] rounded-lg border transition-all ${
                      color === qc
                        ? 'bg-[#8B5E34] text-white border-[#8B5E34]'
                        : 'bg-white text-[#6D5843] border-[#E6D5C3] hover:bg-[#FAF9F7]'
                    }`}
                  >
                    {qc}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder={t.customColorPlaceholder}
                className="w-full p-2.5 text-xs bg-white border border-[#E6D5C3] rounded-xl focus:ring-2 focus:ring-[#8B5E34] text-[#3E2723]"
              />
            </div>

            {/* Field 2: Pattern / Motif */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#3E2723] flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-[#8B5E34]" />
                {t.customPatternLabel}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {quickPatterns.map((qp) => (
                  <button
                    key={qp}
                    type="button"
                    onClick={() => setPattern(qp)}
                    className={`px-2.5 py-1 text-[11px] rounded-lg border transition-all ${
                      pattern === qp
                        ? 'bg-[#8B5E34] text-white border-[#8B5E34]'
                        : 'bg-white text-[#6D5843] border-[#E6D5C3] hover:bg-[#FAF9F7]'
                    }`}
                  >
                    {qp}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder={t.customPatternPlaceholder}
                className="w-full p-2.5 text-xs bg-white border border-[#E6D5C3] rounded-xl focus:ring-2 focus:ring-[#8B5E34] text-[#3E2723]"
              />
            </div>

            {/* Field 3: Custom Dimensions / Size */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#3E2723] flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-[#8B5E34]" />
                {t.customSizeLabel}
              </label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder={t.customSizePlaceholder}
                className="w-full p-2.5 text-xs bg-white border border-[#E6D5C3] rounded-xl focus:ring-2 focus:ring-[#8B5E34] text-[#3E2723]"
              />
            </div>

            {/* Field 4: Special Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#3E2723] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#8B5E34]" />
                {t.customMessageLabel}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder={t.customMessagePlaceholder}
                className="w-full p-2.5 text-xs bg-white border border-[#E6D5C3] rounded-xl focus:ring-2 focus:ring-[#8B5E34] text-[#3E2723] leading-relaxed resize-y"
              />
            </div>

            {/* Field 5: Contact Details */}
            <div className="p-4 bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-[#3E2723]">
                {language === 'hi' ? 'आपकी संपर्क जानकारी' : 'Your Contact Details'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#6D5843] flex items-center gap-1">
                    <User className="w-3 h-3 text-[#8B5E34]" /> {t.customContactName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Radhika Sharma"
                    className="w-full p-2 bg-white border border-[#E6D5C3] rounded-lg text-xs text-[#3E2723]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#6D5843] flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#8B5E34]" /> {t.customContactPhone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-2 bg-white border border-[#E6D5C3] rounded-lg text-xs text-[#3E2723]"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#6D5843] flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#8B5E34]" /> {t.customContactEmail}
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-2 bg-white border border-[#E6D5C3] rounded-lg text-xs text-[#3E2723]"
                />
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E6D5C3]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#8C7355] hover:text-[#3E2723] hover:bg-black/5 rounded-xl transition-colors"
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs transition-colors"
              >
                <Sparkles className="w-4 h-4" /> {t.submitCustomizationBtn}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
