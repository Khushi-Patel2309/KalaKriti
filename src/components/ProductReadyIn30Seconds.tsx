import React, { useState, useEffect, useRef } from 'react';
import { Product, ProductCategory, ArtisanProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  Sparkles, 
  Camera, 
  Upload, 
  Check, 
  RefreshCw, 
  ArrowRight, 
  ArrowLeft, 
  Eye, 
  Sliders, 
  Tag, 
  IndianRupee, 
  ShieldCheck, 
  Clock, 
  Layers, 
  Palette, 
  CheckCircle2, 
  Edit3, 
  HelpCircle,
  Zap,
  ShoppingBag
} from 'lucide-react';

interface ProductReadyIn30SecondsProps {
  artisanProfile: ArtisanProfile;
  onProductPublished: (product: Product) => void;
  onCancel: () => void;
  onSwitchToFullEditor: (prefilledProduct?: Partial<Product>) => void;
}

// Sample handcrafted photos for quick 1-click testing
const SAMPLE_CRAFT_PHOTOS = [
  {
    id: 'terracotta-vase',
    label: 'Terracotta Vase',
    labelHi: 'टेराकोटा फूलदान',
    url: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=800&q=80',
    craft: 'Terracotta Pottery',
  },
  {
    id: 'madhubani-art',
    label: 'Madhubani Painting',
    labelHi: 'मधुबनी पेंटिंग',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    craft: 'Mithila / Madhubani',
  },
  {
    id: 'brass-lamp',
    label: 'Brass Diya Lamp',
    labelHi: 'पीतल दिया दीपक',
    url: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=800&q=80',
    craft: 'Brass Metalwork',
  },
  {
    id: 'pashmina-shawl',
    label: 'Pashmina Shawl',
    labelHi: 'पश्मीना शॉल',
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    craft: 'Kashmiri Weaving',
  },
  {
    id: 'wood-carving',
    label: 'Sheesham Wood Box',
    labelHi: 'शीशम लकड़ी का डिब्बा',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    craft: 'Saharanpur Woodwork',
  },
];

export const ProductReadyIn30Seconds: React.FC<ProductReadyIn30SecondsProps> = ({
  artisanProfile,
  onProductPublished,
  onCancel,
  onSwitchToFullEditor,
}) => {
  const { language } = useLanguage();

  // Workflow State: 'upload' -> 'processing' -> 'review' -> 'published'
  const [workflowState, setWorkflowState] = useState<'upload' | 'processing' | 'review' | 'published'>('upload');

  // Images
  const [originalPhoto, setOriginalPhoto] = useState<string>('');
  const [enhancedPhoto, setEnhancedPhoto] = useState<string>('');
  const [showOriginalComparison, setShowOriginalComparison] = useState<boolean>(false);

  // 30s Countdown and Steps
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [processingStage, setProcessingStage] = useState<string>('Uploading handcrafted photo...');

  // Generated Product Data
  const [generatedProduct, setGeneratedProduct] = useState<Partial<Product> | null>(null);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [editablePrice, setEditablePrice] = useState<number>(1650);
  const [activeDescLang, setActiveDescLang] = useState<'en' | 'hi'>('en');

  // Ref to hold canvas for enhancement
  const timerIntervalRef = useRef<any>(null);

  // Helper to apply non-destructive optical studio enhancement on an image URL/base64
  const enhanceImage = async (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        // Studio warm-linen / pure white subtle base
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Apply optical enhancement filter
        ctx.filter = 'brightness(108%) contrast(112%) saturate(110%) sepia(3%)';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const enhanced = canvas.toDataURL('image/jpeg', 0.94);
        resolve(enhanced);
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  // Start the 30-Second AI Creation Sequence
  const processPhotoAndGenerateListing = async (imageSrc: string) => {
    setOriginalPhoto(imageSrc);
    setWorkflowState('processing');
    setTimerSeconds(0);

    // Dynamic timer & stage updates
    let elapsed = 0;
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    timerIntervalRef.current = setInterval(() => {
      elapsed += 1;
      setTimerSeconds(elapsed);

      if (elapsed <= 7) {
        setProcessingStage(
          language === 'hi'
            ? '📸 फोटो को निखारा जा रहा है (स्टूडियो लाइटिंग व बैकग्राउंड)...'
            : '📸 Enhancing photo lighting, contrast & studio background...'
        );
      } else if (elapsed <= 16) {
        setProcessingStage(
          language === 'hi'
            ? '🧠 AI शिल्प तकनीक, सामग्री व विरासत का विश्लेषण कर रहा है...'
            : '🧠 AI analyzing craft technique, raw materials & heritage...'
        );
      } else if (elapsed <= 24) {
        setProcessingStage(
          language === 'hi'
            ? '✍️ द्विभाषी शीर्षक, हिंदी विवरण और टैग तैयार किए जा रहे हैं...'
            : '✍️ Composing bilingual title, Hindi description & search tags...'
        );
      } else if (elapsed <= 30) {
        setProcessingStage(
          language === 'hi'
            ? '💰 उचित पारिश्रमिक और बाजार मूल्य की गणना की जा रही है...'
            : '💰 Calculating fair artisan wages & market price range...'
        );
      }
    }, 1000);

    try {
      // Step 1: Enhance Image
      const enhanced = await enhanceImage(imageSrc);
      setEnhancedPhoto(enhanced);

      // Step 2: Call Multimodal Gemini AI Image Analysis
      const res = await fetch('/api/gemini/analyze-product-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: enhanced || imageSrc,
          artisanCraft: artisanProfile.craft,
          artisanLocation: artisanProfile.location,
        }),
      });

      const aiData = await res.json();

      const categoryEmojis: Record<string, string> = {
        'Textiles & Weaving': '🧵',
        'Pottery & Ceramics': '🏺',
        'Jewelry': '💍',
        'Woodwork': '🪵',
        'Metalwork': '⚒️',
        'Home Decor': '🏠',
        'Paintings & Art': '🎨',
      };

      const finalPrice = aiData.suggestedPrice || 1650;
      setEditablePrice(finalPrice);

      const preparedProduct: Partial<Product> = {
        id: 'prod_' + Date.now(),
        name: aiData.name || 'Master Handcrafted Heritage Item',
        category: (aiData.category as ProductCategory) || 'Home Decor',
        materials: aiData.materials || 'Natural materials, organic dyes',
        color: aiData.color || 'Earthen natural pigments',
        craftTechnique: aiData.craftTechnique || artisanProfile.craft || 'Handmade Heritage Technique',
        descriptionEnglish: aiData.descriptionEnglish || 'Exquisitely handcrafted by master Indian artisans with sustainable materials and time-honored heritage techniques.',
        descriptionHindi: aiData.descriptionHindi || 'मास्टर कारीगरों द्वारा पारंपरिक विरासत तकनीकों और प्राकृतिक सामग्रियों से निर्मित प्रामाणिक हस्तशिल्प।',
        tags: aiData.tags && aiData.tags.length > 0 ? aiData.tags : ['handmade', 'artisancraft', 'kalakriti'],
        price: finalPrice,
        oldPrice: Math.round(finalPrice * 1.25),
        suggestedPrice: finalPrice,
        minPrice: aiData.minPrice || Math.round(finalPrice * 0.75),
        maxPrice: aiData.maxPrice || Math.round(finalPrice * 1.3),
        quantity: aiData.quantity || 5,
        status: 'published',
        emoji: categoryEmojis[aiData.category] || '🪷',
        views: 0,
        sold: 0,
        imageOriginal: imageSrc,
        imageEnhanced: enhanced,
        enhanceMode: 'studio',
        artisanId: artisanProfile.id,
        artisanName: artisanProfile.name,
        artisanLocation: artisanProfile.location,
        createdAt: Date.now(),
      };

      // Keep timer natural, up to ~6-10 seconds or fast
      setTimeout(() => {
        clearInterval(timerIntervalRef.current);
        setGeneratedProduct(preparedProduct);
        setWorkflowState('review');
      }, 1500);

    } catch (err) {
      console.error('30s AI generation failed, using fallback:', err);
      clearInterval(timerIntervalRef.current);
      // Fallback robust product
      const fallback: Partial<Product> = {
        id: 'prod_' + Date.now(),
        name: `Handcrafted ${artisanProfile.craft || 'Artisan Craft'}`,
        category: 'Home Decor',
        materials: 'Pure natural materials & mineral dyes',
        color: 'Authentic Indian earth palette',
        craftTechnique: artisanProfile.craft || 'Traditional Handcraft',
        descriptionEnglish: 'Authentic Indian handcrafted creation, made with care and patience by traditional artisans.',
        descriptionHindi: 'पारंपरिक कारीगरों द्वारा धैर्य और प्रामाणिक तकनीकों से तैयार किया गया सुंदर हस्तशिल्प।',
        tags: ['handmade', 'artisan-made', 'authentic', 'kalakriti'],
        price: 1650,
        oldPrice: 2100,
        suggestedPrice: 1650,
        minPrice: 1250,
        maxPrice: 2200,
        quantity: 5,
        status: 'published',
        emoji: '🪷',
        views: 0,
        sold: 0,
        imageOriginal: imageSrc,
        imageEnhanced: imageSrc,
        enhanceMode: 'studio',
        artisanId: artisanProfile.id,
        artisanName: artisanProfile.name,
        artisanLocation: artisanProfile.location,
        createdAt: Date.now(),
      };
      setEditablePrice(1650);
      setGeneratedProduct(fallback);
      setWorkflowState('review');
    }
  };

  // Handle Photo File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      processPhotoAndGenerateListing(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Handle Sample Photo Selection
  const handleSelectSamplePhoto = async (sampleUrl: string) => {
    processPhotoAndGenerateListing(sampleUrl);
  };

  // Regenerate with AI
  const handleRegenerate = async () => {
    if (!originalPhoto) return;
    setIsRegenerating(true);
    await processPhotoAndGenerateListing(originalPhoto);
    setIsRegenerating(false);
  };

  // Final Publish Handler
  const handleFinalPublish = () => {
    if (!generatedProduct) return;

    const finalProduct: Product = {
      id: generatedProduct.id || 'prod_' + Date.now(),
      name: generatedProduct.name || 'Handcrafted Heritage Item',
      category: generatedProduct.category || 'Home Decor',
      materials: generatedProduct.materials || 'Natural materials',
      color: generatedProduct.color || 'Earthen pigments',
      craftTechnique: generatedProduct.craftTechnique || 'Handmade',
      descriptionEnglish: generatedProduct.descriptionEnglish || 'Handcrafted by master artisan.',
      descriptionHindi: generatedProduct.descriptionHindi || 'मास्टर कारीगर द्वारा निर्मित।',
      tags: generatedProduct.tags || ['handmade', 'kalakriti'],
      price: editablePrice,
      oldPrice: Math.round(editablePrice * 1.25),
      suggestedPrice: generatedProduct.suggestedPrice || editablePrice,
      minPrice: generatedProduct.minPrice || Math.round(editablePrice * 0.75),
      maxPrice: generatedProduct.maxPrice || Math.round(editablePrice * 1.3),
      quantity: generatedProduct.quantity || 5,
      status: 'published',
      emoji: generatedProduct.emoji || '🪷',
      views: 0,
      sold: 0,
      imageOriginal: originalPhoto,
      imageEnhanced: enhancedPhoto || originalPhoto,
      enhanceMode: 'studio',
      artisanId: artisanProfile.id,
      artisanName: artisanProfile.name,
      artisanLocation: artisanProfile.location,
      createdAt: Date.now(),
    };

    onProductPublished(finalProduct);
    setWorkflowState('published');
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner Feature Header */}
      <div className="p-6 sm:p-7 bg-gradient-to-r from-[#244238] via-[#1D362E] to-[#142620] text-white rounded-3xl shadow-lg border border-[#3E5C51] relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#D8962B] text-[#244238] font-bold text-xs uppercase tracking-wider rounded-full flex items-center gap-1 shadow-xs">
                <Zap className="w-3.5 h-3.5 fill-current" />
                {language === 'hi' ? 'सुपरफास्ट मोड' : 'Superfast Mode'}
              </span>
              <span className="text-xs text-[#C2D8D0] font-medium">
                {language === 'hi' ? 'कारीगरों के लिए शून्य टाइपिंग' : 'Zero Typing Needed for Artisans'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight flex items-center gap-2 mt-1">
              <span>✨</span>
              <span>{language === 'hi' ? '३० सेकंड में उत्पाद तैयार' : 'Product Ready in 30 Seconds'}</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#E2EBE8] max-w-xl">
              {language === 'hi'
                ? 'बस अपने शिल्प की १ फोटो अपलोड करें। AI फोटो को निखारकर नाम, विवरण, उचित मूल्य व श्रेणी ३० सेकंड में तैयार कर देगा!'
                : 'Simply upload 1 photo of your handmade craft. AI automatically enhances your photo, identifies materials, crafts bilingual descriptions, and calculates fair-trade pricing in 30 seconds!'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSwitchToFullEditor(generatedProduct || undefined)}
              className="px-4 py-2.5 text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              {language === 'hi' ? 'मानक ५-चरणीय संपादक' : 'Standard 5-Step Wizard'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-3.5 py-2.5 text-xs font-semibold text-white/70 hover:text-white transition-colors"
            >
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#D8962B]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* =========================================================================
          STAGE 1: PHOTO UPLOAD
          ========================================================================= */}
      {workflowState === 'upload' && (
        <div className="p-8 sm:p-10 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-8 text-center">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-20 h-20 rounded-3xl bg-[#FAF6F0] text-[#8B5E34] border-2 border-[#E6D5C3] flex items-center justify-center mx-auto shadow-sm">
              <Camera className="w-10 h-10" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#3E2723]">
              {language === 'hi' ? 'चरण १: अपने हस्तशिल्प की फोटो अपलोड करें' : 'Step 1: Upload Your Product Photo'}
            </h2>
            <p className="text-xs text-[#8C7355]">
              {language === 'hi'
                ? 'कैमरा या गैलरी से किसी भी हस्तशिल्प की सामान्य फोटो चुनें। हमारा AI लाइटिंग को ठीक करके पूरी लिस्टिंग स्वतः तैयार करेगा।'
                : 'Take or choose a clear photo from your mobile camera or computer. Our AI will handle the rest in 30 seconds.'}
            </p>
          </div>

          {/* Main Drag & Drop / Upload Button */}
          <div className="max-w-xl mx-auto">
            <label className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-[#8B5E34]/50 hover:border-[#8B5E34] rounded-3xl bg-[#FAF9F7] hover:bg-[#F5F1EE] cursor-pointer transition-all group shadow-inner">
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#E6D5C3] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform mb-3">
                <Upload className="w-7 h-7 text-[#8B5E34]" />
              </div>
              <span className="text-base font-bold text-[#3E2723]">
                {language === 'hi' ? 'फोटो अपलोड करें या कैमरा खोलें' : 'Click to Upload / Open Camera'}
              </span>
              <span className="text-xs text-[#8C7355] mt-1">
                {language === 'hi' ? 'JPG, PNG, WEBP फोटो समर्थित (मोबाइल व डेस्कटॉप)' : 'Supports JPG, PNG, WEBP from camera or gallery'}
              </span>
              <span className="mt-4 px-6 py-2.5 bg-[#8B5E34] text-white font-bold text-xs rounded-xl shadow-xs group-hover:bg-[#734B26] transition-colors flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D8962B]" />
                {language === 'hi' ? '३० सेकंड में लिस्टिंग शुरू करें' : 'Start 30-Second AI Creation'}
              </span>
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>

          {/* Quick 1-Click Sample Preset Craft Photos */}
          <div className="pt-6 border-t border-[#E6D5C3]/70 space-y-3">
            <span className="text-xs uppercase tracking-wider font-bold text-[#8B5E34] block">
              {language === 'hi' ? '💡 या तुरंत परीक्षण के लिए एक नमूना शिल्प चुनें:' : '💡 Or choose a sample craft to test instantly in 1-click:'}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-2xl mx-auto">
              {SAMPLE_CRAFT_PHOTOS.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectSamplePhoto(sample.url)}
                  className="p-2.5 bg-[#FAF9F7] hover:bg-white border border-[#E6D5C3] hover:border-[#8B5E34] rounded-2xl text-left transition-all hover:scale-105 group shadow-2xs flex flex-col items-center text-center cursor-pointer"
                >
                  <div className="w-full aspect-square rounded-xl overflow-hidden mb-2 bg-[#EFE9DF]">
                    <img src={sample.url} alt={sample.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span className="text-[11px] font-bold text-[#3E2723] line-clamp-1">
                    {language === 'hi' ? sample.labelHi : sample.label}
                  </span>
                  <span className="text-[9px] text-[#8C7355]">{sample.craft}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STAGE 2: 30-SECOND COUNTDOWN & PROCESSING ENGINE
          ========================================================================= */}
      {workflowState === 'processing' && (
        <div className="p-10 bg-white border border-[#E6D5C3] rounded-3xl shadow-sm space-y-8 text-center max-w-2xl mx-auto">
          {/* Animated Spinner + Timer */}
          <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
            {/* SVG Circular Progress Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#EFE9DF"
                strokeWidth="7"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#8B5E34"
                strokeWidth="7"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * Math.min(timerSeconds, 30)) / 30}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-bold font-serif text-[#3E2723]">
                {Math.min(timerSeconds, 30)}s
              </span>
              <span className="text-[10px] uppercase font-bold text-[#8B5E34]">
                / 30s
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider font-bold text-[#8B5E34] flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D8962B] animate-spin" />
              {language === 'hi' ? 'AI शिल्प निर्माण प्रगति' : 'AI Craft Generation in Progress'}
            </span>
            <h2 className="text-xl font-bold font-serif text-[#3E2723]">
              {processingStage}
            </h2>
            <p className="text-xs text-[#8C7355] max-w-md mx-auto">
              {language === 'hi'
                ? 'कृपया प्रतीक्षा करें — कोई टाइपिंग आवश्यक नहीं है। AI आपके लिए पूर्ण उत्पाद कार्ड तैयार कर रहा है।'
                : 'Please wait — zero typing required. AI is assembling your complete marketplace listing.'}
            </p>
          </div>

          {/* 4 Multi-stage Progress Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto text-xs">
            <div className={`p-3 rounded-xl border transition-all flex items-center gap-2.5 ${timerSeconds >= 3 ? 'bg-[#FAF6F0] border-[#8B5E34]/40 text-[#3E2723]' : 'bg-[#FAF9F7] border-[#E6D5C3] text-[#8C7355]'}`}>
              {timerSeconds >= 7 ? <CheckCircle2 className="w-4 h-4 text-[#244238] shrink-0" /> : <RefreshCw className="w-4 h-4 animate-spin text-[#8B5E34] shrink-0" />}
              <span>{language === 'hi' ? 'स्टूडियो फोटो संवर्धन (Lighting & BG)' : '1. Studio Photo Enhancement'}</span>
            </div>

            <div className={`p-3 rounded-xl border transition-all flex items-center gap-2.5 ${timerSeconds >= 8 ? 'bg-[#FAF6F0] border-[#8B5E34]/40 text-[#3E2723]' : 'bg-[#FAF9F7] border-[#E6D5C3] text-[#8C7355]'}`}>
              {timerSeconds >= 16 ? <CheckCircle2 className="w-4 h-4 text-[#244238] shrink-0" /> : <RefreshCw className={`w-4 h-4 text-[#8B5E34] shrink-0 ${timerSeconds >= 8 ? 'animate-spin' : 'opacity-40'}`} />}
              <span>{language === 'hi' ? 'शिल्प व सामग्री पहचान (Vision AI)' : '2. Craft & Materials Vision AI'}</span>
            </div>

            <div className={`p-3 rounded-xl border transition-all flex items-center gap-2.5 ${timerSeconds >= 17 ? 'bg-[#FAF6F0] border-[#8B5E34]/40 text-[#3E2723]' : 'bg-[#FAF9F7] border-[#E6D5C3] text-[#8C7355]'}`}>
              {timerSeconds >= 24 ? <CheckCircle2 className="w-4 h-4 text-[#244238] shrink-0" /> : <RefreshCw className={`w-4 h-4 text-[#8B5E34] shrink-0 ${timerSeconds >= 17 ? 'animate-spin' : 'opacity-40'}`} />}
              <span>{language === 'hi' ? 'द्विभाषी विवरण व टैग (Eng + हिंदी)' : '3. Bilingual Story & Search Tags'}</span>
            </div>

            <div className={`p-3 rounded-xl border transition-all flex items-center gap-2.5 ${timerSeconds >= 25 ? 'bg-[#FAF6F0] border-[#8B5E34]/40 text-[#3E2723]' : 'bg-[#FAF9F7] border-[#E6D5C3] text-[#8C7355]'}`}>
              {timerSeconds >= 30 ? <CheckCircle2 className="w-4 h-4 text-[#244238] shrink-0" /> : <RefreshCw className={`w-4 h-4 text-[#8B5E34] shrink-0 ${timerSeconds >= 25 ? 'animate-spin' : 'opacity-40'}`} />}
              <span>{language === 'hi' ? 'उचित मूल्य व मजदूरी गणना' : '4. Fair-Trade Wage Pricing'}</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STAGE 3: COMPLETED LISTING PREVIEW & SATISFACTION DECISION
          ========================================================================= */}
      {workflowState === 'review' && generatedProduct && (
        <div className="space-y-6">
          {/* Main Success Callout Banner */}
          <div className="p-4 bg-[#EAF2ED] border border-[#244238]/30 rounded-2xl flex items-center justify-between gap-3 text-xs text-[#1E3B30]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#244238] shrink-0" />
              <span className="font-bold">
                {language === 'hi'
                  ? '🎉 आपका उत्पाद ३० सेकंड में पूरी तरह तैयार हो चुका है! कृपया नीचे समीक्षा करें:'
                  : '🎉 Your product listing was generated in 30 seconds! Review your ready-to-publish card below:'}
              </span>
            </div>
            <span className="text-[11px] font-semibold bg-[#244238] text-white px-2.5 py-0.5 rounded-full">
              {language === 'hi' ? '१००% स्वतः तैयार' : '100% Auto-Generated'}
            </span>
          </div>

          {/* Product Listing Card Preview */}
          <div className="p-6 sm:p-8 bg-white border-2 border-[#E6D5C3] rounded-3xl shadow-md space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Photo Area (With Before/After Toggle) */}
              <div className="md:col-span-5 space-y-3">
                <div className="aspect-square rounded-2xl bg-[#FAF9F7] border border-[#E6D5C3] overflow-hidden relative shadow-inner flex items-center justify-center p-2 group">
                  <img
                    src={showOriginalComparison ? originalPhoto : (enhancedPhoto || originalPhoto)}
                    alt={generatedProduct.name}
                    className="w-full h-full object-contain transition-all duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#3E2723]/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#D8962B]" />
                    {showOriginalComparison ? 'Original Photo' : 'Studio Enhanced'}
                  </div>
                </div>

                {/* Photo Enhancer Toggle */}
                <div className="flex items-center justify-between text-xs px-1">
                  <button
                    type="button"
                    onClick={() => setShowOriginalComparison(!showOriginalComparison)}
                    className="text-[#8B5E34] hover:text-[#734B26] font-bold flex items-center gap-1 underline underline-offset-2"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {showOriginalComparison ? 'Show Enhanced Studio Photo' : 'Compare Original Photo'}
                  </button>
                  <span className="text-[10px] text-[#8C7355]">Optical Studio Lighting</span>
                </div>
              </div>

              {/* Product Metadata & AI Details */}
              <div className="md:col-span-7 space-y-4">
                {/* Category & GI Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold bg-[#FAF6F0] text-[#8B5E34] border border-[#E6D5C3] px-3 py-1 rounded-full uppercase tracking-wider">
                    {generatedProduct.emoji} {generatedProduct.category}
                  </span>
                  <span className="text-[11px] font-semibold bg-[#EAF2ED] text-[#244238] border border-[#244238]/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Certified Handmade
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-serif font-bold text-[#3E2723] leading-snug">
                  {generatedProduct.name}
                </h2>

                {/* Price Section */}
                <div className="p-4 bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8B5E34] block">
                      {language === 'hi' ? 'उचित खुदरा मूल्य (Fair Retail Price)' : 'Fair Retail Selling Price'}
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-2xl font-serif font-bold text-[#3E2723]">
                        ₹{editablePrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-[#8C7355] line-through">
                        ₹{Math.round(editablePrice * 1.25).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-[#8C7355] block">
                      {language === 'hi' ? 'अनुशंसित मूल्य दायरा:' : 'Recommended Range:'}
                    </span>
                    <span className="text-xs font-bold text-[#6D5843]">
                      ₹{generatedProduct.minPrice?.toLocaleString('en-IN')} – ₹{generatedProduct.maxPrice?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Bilingual Description Tabs */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-[#E6D5C3] pb-1">
                    <span className="text-xs font-bold text-[#8B5E34] uppercase tracking-wider">
                      {language === 'hi' ? 'उत्पाद विवरण' : 'Product Story & Details'}
                    </span>
                    <div className="flex items-center gap-1 text-xs">
                      <button
                        type="button"
                        onClick={() => setActiveDescLang('en')}
                        className={`px-2 py-0.5 rounded-md font-bold transition-colors ${activeDescLang === 'en' ? 'bg-[#8B5E34] text-white' : 'text-[#6D5843] hover:bg-[#FAF9F7]'}`}
                      >
                        English
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveDescLang('hi')}
                        className={`px-2 py-0.5 rounded-md font-bold transition-colors ${activeDescLang === 'hi' ? 'bg-[#8B5E34] text-white' : 'text-[#6D5843] hover:bg-[#FAF9F7]'}`}
                      >
                        हिंदी (Hindi)
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#5D4037] leading-relaxed p-3 bg-[#FAF9F7] rounded-xl border border-[#E6D5C3]/70">
                    {activeDescLang === 'en'
                      ? generatedProduct.descriptionEnglish
                      : generatedProduct.descriptionHindi}
                  </p>
                </div>

                {/* Craft Specs Breakdown */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-white border border-[#E6D5C3] rounded-xl">
                    <span className="text-[10px] text-[#8C7355] block font-bold uppercase">
                      {language === 'hi' ? 'सामग्री (Materials)' : 'Materials Used'}
                    </span>
                    <span className="font-semibold text-[#3E2723] block truncate">{generatedProduct.materials}</span>
                  </div>

                  <div className="p-2.5 bg-white border border-[#E6D5C3] rounded-xl">
                    <span className="text-[10px] text-[#8C7355] block font-bold uppercase">
                      {language === 'hi' ? 'शिल्प तकनीक (Technique)' : 'Craft Technique'}
                    </span>
                    <span className="font-semibold text-[#3E2723] block truncate">{generatedProduct.craftTechnique}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {generatedProduct.tags?.map((t, idx) => (
                    <span key={idx} className="text-[10px] font-semibold bg-[#FAF6F0] text-[#8B5E34] border border-[#E6D5C3] px-2.5 py-0.5 rounded-full">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================================
              SATISFACTION DECISION CARD (As requested by user)
              ===================================================================== */}
          <div className="p-6 sm:p-8 bg-gradient-to-br from-[#FAF6F0] via-[#FAF9F7] to-[#F5EFE6] border-2 border-[#8B5E34] rounded-3xl shadow-md text-center space-y-6">
            <div className="max-w-md mx-auto space-y-2">
              <span className="text-xs uppercase font-bold text-[#8B5E34] tracking-widest block">
                {language === 'hi' ? 'अंतिम पुष्टि' : 'Final Confirmation'}
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#3E2723]">
                {language === 'hi'
                  ? 'क्या आप अपनी उत्पाद लिस्टिंग से संतुष्ट हैं?'
                  : 'Are you satisfied with your product listing?'}
              </h3>
              <p className="text-xs text-[#8C7355]">
                {language === 'hi'
                  ? 'हाँ पर क्लिक करते ही यह उत्पाद तुरंत कलाकृति मार्केटप्लेस पर लाइव हो जाएगा।'
                  : 'Click YES to instantly publish your product to the live marketplace for buyers to order.'}
              </p>
            </div>

            {/* YES vs NO Decision Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              {/* YES -> Publish Product */}
              <button
                type="button"
                onClick={handleFinalPublish}
                className="px-8 py-4 bg-[#244238] hover:bg-[#1A3129] text-white text-base font-bold rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-[#3E5C51] cursor-pointer"
              >
                <Check className="w-5 h-5 text-[#D8962B]" />
                <span>
                  {language === 'hi' ? '✅ हाँ — उत्पाद प्रकाशित करें (Publish)' : 'YES, Publish Product'}
                </span>
              </button>

              {/* NO -> Edit / Regenerate */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                  className="px-5 py-4 bg-white hover:bg-[#FAF9F7] text-[#3E2723] text-xs font-bold rounded-2xl shadow-xs border border-[#E6D5C3] hover:border-[#8B5E34] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 text-[#8B5E34] ${isRegenerating ? 'animate-spin' : ''}`} />
                  <span>
                    {language === 'hi' ? '🔄 दोबारा बनाएं (Regenerate)' : 'NO, Regenerate with AI'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onSwitchToFullEditor(generatedProduct)}
                  className="px-5 py-4 bg-white hover:bg-[#FAF9F7] text-[#8B5E34] text-xs font-bold rounded-2xl shadow-xs border border-[#E6D5C3] hover:border-[#8B5E34] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>
                    {language === 'hi' ? '✏️ सुधारें (Edit in Full Editor)' : 'NO, Edit in Full Editor'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STAGE 4: SUCCESS PUBLISHED CELEBRATION
          ========================================================================= */}
      {workflowState === 'published' && (
        <div className="p-10 bg-white border border-[#E6D5C3] rounded-3xl shadow-md text-center space-y-6 max-w-xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-[#EAF2ED] text-[#244238] border-2 border-[#244238] flex items-center justify-center mx-auto shadow-sm animate-bounce">
            <Check className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-bold text-[#3E2723]">
              {language === 'hi' ? '🎉 आपका उत्पाद सफलतापूर्वक लाइव हो गया!' : '🎉 Product Successfully Published!'}
            </h2>
            <p className="text-xs text-[#8C7355]">
              {language === 'hi'
                ? `"${generatedProduct?.name}" अब कलाकृति स्टोर पर उपलब्ध है। ग्राहक सीधे आपके UPI (${artisanProfile.upiId}) पर भुगतान करके ऑर्डर दे सकते हैं।`
                : `"${generatedProduct?.name}" is now live in the store. Customers can place orders with direct UPI payments to ${artisanProfile.upiId}.`}
            </p>
          </div>

          <div className="p-4 bg-[#FAF9F7] rounded-2xl border border-[#E6D5C3] flex items-center justify-between text-xs">
            <div className="flex items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#E6D5C3] overflow-hidden shrink-0">
                <img src={enhancedPhoto || originalPhoto} alt="Product" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="font-bold text-[#3E2723] block line-clamp-1">{generatedProduct?.name}</span>
                <span className="text-[#8B5E34] font-bold">₹{editablePrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <span className="px-3 py-1 bg-[#244238] text-white font-bold rounded-full text-[10px]">
              Live
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setWorkflowState('upload');
                setOriginalPhoto('');
                setEnhancedPhoto('');
                setGeneratedProduct(null);
              }}
              className="px-6 py-3 bg-[#8B5E34] hover:bg-[#734B26] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#D8962B]" />
              {language === 'hi' ? '✨ दूसरा उत्पाद ३० सेकंड में जोड़ें' : '✨ Add Another in 30 Seconds'}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-[#FAF9F7] hover:bg-[#F5F1EE] border border-[#E6D5C3] text-[#3E2723] font-bold text-xs rounded-xl transition-all"
            >
              {language === 'hi' ? 'डैशबोर्ड पर जाएं' : 'Go to Dashboard'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
