import React, { useState } from 'react';
import { Product, ArtisanProfile, CustomizationRequest } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { RequestCustomizationModal } from './RequestCustomizationModal';
import {
  ShoppingBag,
  Share2,
  Check,
  AlertCircle,
  Edit,
  MapPin,
  Tag,
  Sparkles,
  Volume2,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  currentArtisanProfile?: ArtisanProfile;
  currentRole: string;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  onRequestCustomization?: (request: Omit<CustomizationRequest, 'id' | 'createdAt' | 'status'>) => void;
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
  onDeleteProduct,
  onRequestCustomization,
}) => {
  const { language, t } = useLanguage();
  const [selectedQty, setSelectedQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'craft' | 'audio'>('details');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [voiceStoryLang, setVoiceStoryLang] = useState<string>('hi');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  if (!isOpen || !product) return null;

  // Check if this product belongs to the viewing artisan
  const isOwnProduct =
    (currentRole === 'artisan' &&
      (product.artisanId === currentArtisanProfile?.id ||
        product.artisanName === currentArtisanProfile?.name)) ||
    (currentArtisanProfile && product.artisanId === currentArtisanProfile.id) ||
    currentRole === 'admin';

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getStoryTextByLanguage = (lang: string) => {
    switch (lang) {
      case 'hi':
        return `यह है ${product.name}। ${product.descriptionHindi || product.descriptionEnglish}। यह प्रामाणिक शिल्प ${product.artisanLocation} के सिद्धहस्त शिल्पी ${product.artisanName} द्वारा विशुद्ध भारतीय परंपरा के अनुसार हाथ से रचा गया है।`;
      case 'gu':
        return `આ છે ${product.name}। ${product.descriptionEnglish}। આ પરંપરાગત હસ્તકલા ${product.artisanLocation} ના પ્રખ્યાત કારીગર ${product.artisanName} દ્વારા સાચા હૃદયથી બનાવવામાં આવી છે.`;
      case 'mr':
        return `हे आहे ${product.name}। ${product.descriptionHindi || product.descriptionEnglish}। हे हस्तकला उत्पादन ${product.artisanLocation} येथील कुशल कारागीर ${product.artisanName} यांनी पारंपरिक तंत्राने घडवले आहे.`;
      case 'bn':
        return `এটি হলো ${product.name}। ${product.descriptionEnglish}। এই ঐতিহ্যবাহী হস্তশিল্পটি ${product.artisanLocation}-এর দক্ষ কারিগর ${product.artisanName} পরম যত্ন সহকারে হাতে তৈরি করেছেন।`;
      case 'ta':
        return `இது ${product.name} ஆகும். ${product.descriptionEnglish}. இந்த பாரம்பரிய கைவினைப்பொருள் ${product.artisanLocation} நகரைச் சேர்ந்த கலைஞர் ${product.artisanName} அவர்களால் கைவண்ணத்தில் உருவாக்கப்பட்டது.`;
      case 'te':
        return `ఇది ${product.name}. ${product.descriptionEnglish}. ఈ సంప్రదాయ చేతివృత్తి కళాఖండాన్ని ${product.artisanLocation} కు చెందిన నిపుణ కళాకారుడు ${product.artisanName} ఎంతో నేర్పుతో తయారుచేశారు.`;
      case 'en':
      default:
        return `This is ${product.name}. ${product.descriptionEnglish}. Crafted with traditional heritage techniques by master artisan ${product.artisanName} hailing from ${product.artisanLocation}. Each piece carries the soul of Indian folk art.`;
    }
  };

  const getVoiceLangLocale = (lang: string) => {
    switch (lang) {
      case 'hi': return 'hi-IN';
      case 'gu': return 'gu-IN';
      case 'mr': return 'mr-IN';
      case 'bn': return 'bn-IN';
      case 'ta': return 'ta-IN';
      case 'te': return 'te-IN';
      case 'en': default: return 'en-IN';
    }
  };

  const handleTogglePlayAudio = () => {
    if (!('speechSynthesis' in window)) {
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = getStoryTextByLanguage(voiceStoryLang);
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = getVoiceLangLocale(voiceStoryLang);
    utterance.rate = 0.95; // Natural storytelling tempo
    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
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
            <span className="text-xs text-[#8C7355]">
              {language === 'hi' ? 'प्रामाणिक हस्तशिल्प विरासत' : 'Handmade Artisan Heritage'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 text-[#8C7355] hover:text-[#8B5E34] hover:bg-black/5 rounded-lg text-xs flex items-center gap-1"
              title={language === 'hi' ? 'लिंक कॉपी करें' : 'Share product link'}
            >
              {copiedLink ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
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
                    {language === 'hi' ? 'बचत' : 'SAVE'}{' '}
                    {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
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
                  ✓ {t.verifiedArtisan}
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
                    {t.zeroCommissionPledge}
                  </span>
                </div>
              </div>

              {/* Anti-Self-Purchase Notice for Artisans */}
              {isOwnProduct ? (
                <div className="p-4 bg-[#F5F1EE] border-2 border-[#8B5E34] rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8B5E34]">
                    <AlertCircle className="w-4 h-4 text-[#8B5E34]" />
                    <span>
                      {language === 'hi'
                        ? 'आप अपनी खुद की उत्पाद सूची देख रहे हैं'
                        : 'You are viewing your own product listing'}
                    </span>
                  </div>
                  <p className="text-xs text-[#6D5843]">
                    {language === 'hi'
                      ? 'कारीगर स्वयं का उत्पाद नहीं खरीद सकते। आप अपने कारीगर कैटलॉग में इसे संपादित कर सकते हैं।'
                      : 'Artisans cannot purchase their own products. You can edit this item, adjust inventory, or view performance in your Artisan Catalog.'}
                  </p>
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    {onEditProduct && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onEditProduct(product);
                        }}
                        className="px-4 py-2 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />{' '}
                        {language === 'hi' ? 'उत्पाद विवरण संपादित करें' : 'Edit Product Listing'}
                      </button>
                    )}

                    {onDeleteProduct && (
                      <button
                        type="button"
                        onClick={() => {
                          if (isConfirmingDelete) {
                            onDeleteProduct(product.id);
                            onClose();
                          } else {
                            setIsConfirmingDelete(true);
                          }
                        }}
                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                          isConfirmingDelete
                            ? 'bg-red-600 text-white animate-pulse'
                            : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                        }`}
                        title={
                          language === 'hi'
                            ? 'उत्पाद को हमेशा के लिए हटाएं (यह दोबारा कभी नहीं दिखाई देगा)'
                            : 'Permanently delete this product (will never appear again)'
                        }
                      >
                        <span>
                          {isConfirmingDelete
                            ? language === 'hi'
                              ? '⚠️ क्या आप निश्चित हैं? (पुष्टि करने के लिए पुनः दबाएं)'
                              : '⚠️ Confirm Permanent Delete?'
                            : language === 'hi'
                            ? '🗑️ उत्पाद हमेशा के लिए हटाएं'
                            : '🗑️ Delete Product Permanently'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Customer Purchase Controls */
                <div className="p-4 bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#3E2723]">{t.quantity}</span>
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
                        onClick={() =>
                          setSelectedQty(Math.min(product.quantity || 10, selectedQty + 1))
                        }
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
                      <ShoppingBag className="w-4 h-4 text-[#8B5E34]" /> {t.addToCart}
                    </button>
                    <button
                      type="button"
                      onClick={() => onBuyNow(product)}
                      className="py-3 px-4 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      {language === 'hi' ? 'सीधा खरीदें (UPI / QR)' : 'Buy Now (UPI / QR)'}
                    </button>
                  </div>

                  {/* Request Customization Action */}
                  <button
                    type="button"
                    onClick={() => setIsCustomizationOpen(true)}
                    className="w-full py-2.5 px-4 text-xs font-bold text-[#8B5E34] bg-[#FAF9F7] hover:bg-[#F5F1EE] border border-[#8B5E34]/40 rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#8B5E34]" />
                    <span>{t.requestCustomization}</span>
                  </button>
                </div>
              )}

              {/* Tabs for Story, Craft & Audio */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 border-b border-[#E6D5C3] pb-2 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveTab('details')}
                    className={`pb-1 border-b-2 transition-all ${
                      activeTab === 'details'
                        ? 'border-[#8B5E34] text-[#8B5E34] font-bold'
                        : 'border-transparent text-[#8C7355]'
                    }`}
                  >
                    {language === 'hi' ? 'उत्पाद विवरण' : 'Product Story'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('craft')}
                    className={`pb-1 border-b-2 transition-all ${
                      activeTab === 'craft'
                        ? 'border-[#8B5E34] text-[#8B5E34] font-bold'
                        : 'border-transparent text-[#8C7355]'
                    }`}
                  >
                    {t.craftTechnique}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('audio')}
                    className={`pb-1 border-b-2 transition-all ${
                      activeTab === 'audio'
                        ? 'border-[#8B5E34] text-[#8B5E34] font-bold'
                        : 'border-transparent text-[#8C7355]'
                    }`}
                  >
                    {language === 'hi' ? 'ऑडियो सुनें' : 'Audio Story'}
                  </button>
                </div>

                {activeTab === 'details' && (
                  <div className="space-y-2 text-xs text-[#6D5843] leading-relaxed">
                    {/* Primary text based on selected language */}
                    {language === 'hi' ? (
                      <div>
                        <p className="font-serif leading-relaxed text-[#3E2723]">
                          {product.descriptionHindi || product.descriptionEnglish}
                        </p>
                        {product.descriptionEnglish && (
                          <div className="mt-3 p-2.5 bg-[#FAF9F7] rounded-xl border border-[#E6D5C3] text-[11px] text-[#8C7355]">
                            <span className="font-bold block text-[#6D5843]">English Summary:</span>
                            {product.descriptionEnglish}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className="leading-relaxed text-[#3E2723]">
                          {product.descriptionEnglish}
                        </p>
                        {product.descriptionHindi && (
                          <div className="mt-3 p-2.5 bg-[#FAF9F7] rounded-xl border border-[#E6D5C3] text-[11px] text-[#8C7355] font-serif">
                            <span className="font-bold block text-[#6D5843]">हिंदी विवरण:</span>
                            {product.descriptionHindi}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'craft' && (
                  <div className="space-y-2 text-xs text-[#6D5843]">
                    <p>
                      <strong className="text-[#3E2723]">{t.craftTechnique}:</strong>{' '}
                      {product.craftTechnique ||
                        (language === 'hi'
                          ? 'पारंपरिक भारतीय हस्तशिल्प'
                          : 'Traditional Indian Handcraft')}
                    </p>
                    <p>
                      <strong className="text-[#3E2723]">{t.materialsUsed}:</strong>{' '}
                      {product.materials ||
                        (language === 'hi'
                          ? 'प्राकृतिक एवं शुद्ध सामग्री'
                          : 'Sustainably sourced natural materials')}
                    </p>
                    <p>
                      <strong className="text-[#3E2723]">{t.clusterOrigin}:</strong>{' '}
                      {product.artisanLocation}
                    </p>
                  </div>
                )}

                {activeTab === 'audio' && (
                  <div className="p-4 bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl space-y-4">
                    {/* Language Selector for Voice Story */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#3E2723] block">
                        {language === 'hi'
                          ? 'कहानी सुनने के लिए अपनी पसंदीदा भाषा चुनें:'
                          : 'Choose voice story language:'}
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { code: 'hi', label: 'हिन्दी (Hindi)' },
                          { code: 'en', label: 'English' },
                          { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
                          { code: 'mr', label: 'मराठी (Marathi)' },
                          { code: 'bn', label: 'বাংলা (Bengali)' },
                          { code: 'ta', label: 'தமிழ் (Tamil)' },
                          { code: 'te', label: 'తెలుగు (Telugu)' },
                        ].map((langItem) => (
                          <button
                            key={langItem.code}
                            type="button"
                            onClick={() => {
                              if (isPlayingAudio) {
                                window.speechSynthesis.cancel();
                                setIsPlayingAudio(false);
                              }
                              setVoiceStoryLang(langItem.code);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                              voiceStoryLang === langItem.code
                                ? 'bg-[#8B5E34] text-white shadow-2xs scale-105'
                                : 'bg-white text-[#6D5843] border border-[#E6D5C3] hover:bg-[#F5F1EE]'
                            }`}
                          >
                            {langItem.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={handleTogglePlayAudio}
                        className={`p-3.5 rounded-full text-white shadow-xs transition-transform active:scale-95 flex items-center justify-center cursor-pointer ${
                          isPlayingAudio
                            ? 'bg-[#3E2723] ring-4 ring-[#8B5E34]/30'
                            : 'bg-[#8B5E34] hover:bg-[#734B26]'
                        }`}
                      >
                        <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                      </button>
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-[#3E2723] flex items-center gap-2">
                          <span>
                            {isPlayingAudio
                              ? language === 'hi'
                                ? '▶ कहानी सुनाई जा रही है...'
                                : '▶ Narrating Craft Story...'
                              : language === 'hi'
                              ? 'कारीगर की आवाज में शिल्प की कहानी सुनें'
                              : 'Listen to Handcrafted Heritage Voice Narrative'}
                          </span>
                          {isPlayingAudio && (
                            <span className="flex items-center gap-0.5">
                              <span className="w-1 h-3 bg-[#8B5E34] animate-pulse rounded-full" />
                              <span className="w-1 h-5 bg-[#8B5E34] animate-pulse delay-75 rounded-full" />
                              <span className="w-1 h-2 bg-[#8B5E34] animate-pulse delay-150 rounded-full" />
                              <span className="w-1 h-4 bg-[#8B5E34] animate-pulse delay-100 rounded-full" />
                            </span>
                          )}
                        </h4>
                        <p className="text-[11px] text-[#8C7355]">
                          {language === 'hi'
                            ? 'प्रामाणिक शिल्पी परंपरा और तकनीक की मौखिक व्याख्या'
                            : 'Authentic spoken lore and craft techniques in your preferred Indian language'}
                        </p>
                      </div>
                    </div>

                    {/* Story Spoken Text Preview */}
                    <div className="p-3 bg-white border border-[#E6D5C3] rounded-xl text-xs text-[#6D5843] italic leading-relaxed">
                      "{getStoryTextByLanguage(voiceStoryLang)}"
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {product.tags.map((tg, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium bg-[#F5F1EE] text-[#6D5843] px-2 py-0.5 rounded-md border border-[#E6D5C3] flex items-center gap-1"
                    >
                      <Tag className="w-2.5 h-2.5 text-[#8B5E34]" /> {tg}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated Customer Customization Request Modal */}
      {isCustomizationOpen && (
        <RequestCustomizationModal
          isOpen={isCustomizationOpen}
          onClose={() => setIsCustomizationOpen(false)}
          product={product}
          onSubmit={(reqData) => {
            if (onRequestCustomization) {
              onRequestCustomization(reqData);
            }
          }}
        />
      )}
    </div>
  );
};
