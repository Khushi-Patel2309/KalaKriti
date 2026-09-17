import React, { useState, useEffect, useRef } from 'react';
import { Product, ProductCategory, ArtisanProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Camera,
  Sparkles,
  Check,
  RefreshCw,
  IndianRupee,
  ArrowRight,
  Upload,
  ArrowLeft,
  Eye,
  Sliders,
  AlertCircle,
  Clock,
  CheckCircle2,
  Edit3,
  HelpCircle,
  Zap,
  ShoppingBag,
} from 'lucide-react';

interface ProductReadyIn30SecondsProps {
  artisanProfile: ArtisanProfile;
  onProductPublished: (product: Product) => void;
  onCancel: () => void;
  onSwitchToFullEditor: (prefilledProduct?: Partial<Product>) => void;
}

// Sample handcrafted crafts for quick 1-click testing
const SAMPLE_CRAFT_PHOTOS = [
  {
    id: 'terracotta-vase',
    label: 'Terracotta Vase',
    labelHi: 'टेराकोटा फूलदान',
    url: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=800&q=80',
    craft: 'Terracotta Pottery',
    defaultName: 'Handmade Terracotta Decorative Pitcher',
    defaultMaterials: 'Natural riverbed clay, organic mineral slip',
  },
  {
    id: 'madhubani-art',
    label: 'Madhubani Painting',
    labelHi: 'मधुबनी पेंटिंग',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    craft: 'Mithila / Madhubani',
    defaultName: 'Madhubani Tree of Life Folk Canvas',
    defaultMaterials: 'Handmade paper, natural plant and twig pigments',
  },
  {
    id: 'brass-lamp',
    label: 'Brass Diya Lamp',
    labelHi: 'पीतल दिया दीपक',
    url: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=800&q=80',
    craft: 'Brass Metalwork',
    defaultName: 'Traditional Hand-Etched Brass Peacock Diya',
    defaultMaterials: 'Solid cast brass alloy, antique natural patina',
  },
  {
    id: 'pashmina-shawl',
    label: 'Pashmina Shawl',
    labelHi: 'पश्मीना शॉल',
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    craft: 'Kashmiri Weaving',
    defaultName: 'Kashmiri Handwoven Pure Pashmina Stole',
    defaultMaterials: 'Authentic Himalayan pashm fiber, organic azo-free dyes',
  },
  {
    id: 'wood-carving',
    label: 'Sheesham Wood Box',
    labelHi: 'शीशम लकड़ी का डिब्बा',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    craft: 'Saharanpur Woodwork',
    defaultName: 'Carved Sheesham Wood Keepsake Box',
    defaultMaterials: 'Sustainably harvested Sheesham rosewood, natural beeswax polish',
  },
];

const POPULAR_MATERIALS = [
  'Natural Terracotta Clay',
  'Solid Brass Alloy',
  'Pure Handspun Cotton',
  'Mulberry Silk & Zari',
  'Sheesham Rosewood',
  'Organic Mineral Pigments',
  'Bell Metal / Dhokra Bronze',
];

export const ProductReadyIn30Seconds: React.FC<ProductReadyIn30SecondsProps> = ({
  artisanProfile,
  onProductPublished,
  onCancel,
  onSwitchToFullEditor,
}) => {
  const { language } = useLanguage();

  // Load initial draft from sessionStorage if available to prevent broken state on refresh
  const getStoredDraft = () => {
    try {
      const saved = sessionStorage.getItem('kalakriti_ready30s_draft');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const draft = getStoredDraft();

  // Workflow State: 'upload' -> 'processing' -> 'review' -> 'published'
  const [workflowState, setWorkflowState] = useState<'upload' | 'processing' | 'review' | 'published'>(
    draft?.workflowState || 'upload'
  );

  // The 3 required inputs: 1. Photo, 2. Product Name, 3. Materials Used
  const [originalPhoto, setOriginalPhoto] = useState<string>(draft?.originalPhoto || '');
  const [productName, setProductName] = useState<string>(draft?.productName || '');
  const [materials, setMaterials] = useState<string>(draft?.materials || '');

  // Form validation feedback
  const [validationError, setValidationError] = useState<string>('');

  // AI Generated output & enhancement
  const [enhancedPhoto, setEnhancedPhoto] = useState<string>(draft?.enhancedPhoto || '');
  const [showOriginalComparison, setShowOriginalComparison] = useState<boolean>(false);

  // 30s Countdown and Steps
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [processingStage, setProcessingStage] = useState<string>('Uploading handcrafted photo...');

  // Generated Product Data for Review
  const [generatedProduct, setGeneratedProduct] = useState<Partial<Product> | null>(
    draft?.generatedProduct || null
  );
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [editablePrice, setEditablePrice] = useState<number>(draft?.editablePrice || 1650);
  const [activeDescLang, setActiveDescLang] = useState<'en' | 'hi'>('en');

  // Timer ref
  const timerIntervalRef = useRef<any>(null);

  // Persist draft to sessionStorage
  useEffect(() => {
    try {
      if (workflowState !== 'published') {
        sessionStorage.setItem(
          'kalakriti_ready30s_draft',
          JSON.stringify({
            workflowState,
            originalPhoto,
            productName,
            materials,
            enhancedPhoto,
            generatedProduct,
            editablePrice,
          })
        );
      } else {
        sessionStorage.removeItem('kalakriti_ready30s_draft');
      }
    } catch {
      // Ignore sessionStorage errors
    }
  }, [workflowState, originalPhoto, productName, materials, enhancedPhoto, generatedProduct, editablePrice]);

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

  // Start the 30-Second AI Creation Sequence with the 3 inputs
  const start30SecondCreation = async () => {
    // Validate the 3 required fields
    if (!originalPhoto) {
      setValidationError(
        language === 'hi'
          ? 'कृपया पहले उत्पाद की फोटो अपलोड करें या एक नमूना चुनें।'
          : 'Please upload or choose a product photo.'
      );
      return;
    }
    if (!productName.trim()) {
      setValidationError(
        language === 'hi'
          ? 'कृपया उत्पाद का नाम दर्ज करें।'
          : 'Please provide the product name.'
      );
      return;
    }
    if (!materials.trim()) {
      setValidationError(
        language === 'hi'
          ? 'कृपया उपयोग की गई सामग्री (Materials Used) दर्ज करें।'
          : 'Please provide the materials used.'
      );
      return;
    }

    setValidationError('');
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
            ? '📸 फोटो को निखारा जा रहा है (स्टूडियो लाइटिंग व स्पष्टता)...'
            : '📸 Enhancing photo lighting, contrast & studio background...'
        );
      } else if (elapsed <= 16) {
        setProcessingStage(
          language === 'hi'
            ? `🧠 AI "${productName}" और "${materials}" के आधार पर शिल्प विश्लेषण कर रहा है...`
            : `🧠 AI analyzing craft technique & materials for "${productName}"...`
        );
      } else if (elapsed <= 24) {
        setProcessingStage(
          language === 'hi'
            ? '✍️ द्विभाषी अंग्रेजी व हिंदी विवरण और खोज टैग तैयार किए जा रहे हैं...'
            : '✍️ Composing bilingual English & Hindi descriptions with search tags...'
        );
      } else if (elapsed <= 30) {
        setProcessingStage(
          language === 'hi'
            ? '💰 उचित पारिश्रमिक और बाजार मूल्य सीमा की गणना हो रही है...'
            : '💰 Calculating fair artisan wages & market benchmark pricing...'
        );
      }
    }, 1000);

    try {
      // Step 1: Enhance Image
      const enhanced = await enhanceImage(originalPhoto);
      setEnhancedPhoto(enhanced);

      // Step 2: Call Multimodal Gemini AI Image Analysis
      const res = await fetch('/api/gemini/analyze-product-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: enhanced || originalPhoto,
          artisanCraft: artisanProfile.craft,
          artisanLocation: artisanProfile.location,
          productName: productName.trim(),
          materials: materials.trim(),
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
        name: productName.trim() || aiData.name || 'Master Handcrafted Item',
        category: (aiData.category as ProductCategory) || 'Home Decor',
        materials: materials.trim() || aiData.materials || 'Natural materials, organic dyes',
        color: aiData.color || 'Earthen natural pigments',
        craftTechnique: aiData.craftTechnique || artisanProfile.craft || 'Handmade Heritage Technique',
        descriptionEnglish:
          aiData.descriptionEnglish ||
          `Exquisitely handcrafted by master artisans with ${materials.trim()} and time-honored heritage techniques.`,
        descriptionHindi:
          aiData.descriptionHindi ||
          `मास्टर कारीगरों द्वारा ${materials.trim()} और पारंपरिक विरासत तकनीकों से निर्मित प्रामाणिक हस्तशिल्प।`,
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
        imageOriginal: originalPhoto,
        imageEnhanced: enhanced,
        enhanceMode: 'studio',
        artisanId: artisanProfile.id,
        artisanName: artisanProfile.name,
        artisanLocation: artisanProfile.location,
        createdAt: Date.now(),
      };

      setTimeout(() => {
        clearInterval(timerIntervalRef.current);
        setGeneratedProduct(preparedProduct);
        setWorkflowState('review');
      }, 1500);
    } catch (err) {
      console.error('30s AI generation error, using fallback:', err);
      clearInterval(timerIntervalRef.current);

      const fallback: Partial<Product> = {
        id: 'prod_' + Date.now(),
        name: productName.trim() || `Handcrafted ${artisanProfile.craft || 'Artisan Craft'}`,
        category: 'Home Decor',
        materials: materials.trim() || 'Pure natural materials & mineral pigments',
        color: 'Authentic Indian earth palette',
        craftTechnique: artisanProfile.craft || 'Traditional Handcraft',
        descriptionEnglish: `Authentic Indian handcrafted creation featuring ${materials.trim()}, crafted with patience and precision by traditional artisans.`,
        descriptionHindi: `पारंपरिक कारीगरों द्वारा ${materials.trim()} से धैर्य और प्रामाणिक तकनीकों से तैयार किया गया सुंदर हस्तशिल्प।`,
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
        imageOriginal: originalPhoto,
        imageEnhanced: originalPhoto,
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
      setOriginalPhoto(dataUrl);
      if (validationError) setValidationError('');
    };
    reader.readAsDataURL(file);
  };

  // Handle Sample Photo Selection
  const handleSelectSampleCraft = (sample: (typeof SAMPLE_CRAFT_PHOTOS)[0]) => {
    setOriginalPhoto(sample.url);
    // Prefill product name and materials if empty or matching another sample
    if (!productName || SAMPLE_CRAFT_PHOTOS.some((s) => s.defaultName === productName)) {
      setProductName(sample.defaultName);
    }
    if (!materials || SAMPLE_CRAFT_PHOTOS.some((s) => s.defaultMaterials === materials)) {
      setMaterials(sample.defaultMaterials);
    }
    if (validationError) setValidationError('');
  };

  // Quick Material Pill toggle/append
  const handleSelectMaterialPill = (mat: string) => {
    if (!materials.trim()) {
      setMaterials(mat);
    } else if (!materials.includes(mat)) {
      setMaterials(`${materials}, ${mat}`);
    }
    if (validationError) setValidationError('');
  };

  // Regenerate with AI
  const handleRegenerate = async () => {
    setIsRegenerating(true);
    await start30SecondCreation();
    setIsRegenerating(false);
  };

  // Final Publish Handler
  const handleFinalPublish = () => {
    if (!generatedProduct) return;

    const finalProduct: Product = {
      id: generatedProduct.id || 'prod_' + Date.now(),
      name: (productName.trim() || generatedProduct.name || 'Handcrafted Heritage Item').trim(),
      category: generatedProduct.category || 'Home Decor',
      materials: (materials.trim() || generatedProduct.materials || 'Natural materials').trim(),
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
    sessionStorage.removeItem('kalakriti_ready30s_draft');
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
                {language === 'hi' ? 'त्वरित एआई मोड' : 'Quick AI Mode'}
              </span>
              <span className="text-xs text-[#C2D8D0] font-medium">
                {language === 'hi' ? 'केवल ३ विवरण आवश्यक' : 'Only 3 Simple Inputs Required'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight flex items-center gap-2 mt-1">
              <span>✨</span>
              <span>{language === 'hi' ? '३० सेकंड में उत्पाद तैयार' : 'Product Ready in 30 Seconds'}</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#E2EBE8] max-w-xl">
              {language === 'hi'
                ? 'केवल १. फोटो, २. नाम, और ३. उपयोग की गई सामग्री प्रदान करें। बाकी सब कुछ (विवरण, टैग, उचित मूल्य) AI स्वतः तैयार करेगा!'
                : 'Simply provide 1. Product Photo, 2. Product Name, and 3. Materials Used. Everything else is generated by the AI system!'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSwitchToFullEditor(generatedProduct || undefined)}
              className="px-4 py-2.5 text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              {language === 'hi' ? 'विस्तृत संपादक' : 'Standard Full Editor'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-3.5 py-2.5 text-xs font-semibold text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              {language === 'hi' ? 'डैशबोर्ड पर लौटें' : 'Exit to Dashboard'}
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#D8962B]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* =========================================================================
          STAGE 1: 3-INPUT SIMPLIFIED QUICK FORM (Photo, Name, Materials)
          ========================================================================= */}
      {workflowState === 'upload' && (
        <div className="p-6 sm:p-10 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-8">
          <div className="text-center max-w-md mx-auto space-y-2">
            <span className="text-xs uppercase tracking-wider font-bold text-[#8B5E34]">
              {language === 'hi' ? 'सरल ३-चरणीय इनपुट' : 'Quick 3-Field Creator'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#3E2723]">
              {language === 'hi' ? 'अपने उत्पाद की ३ मुख्य बातें दर्ज करें' : 'Provide 3 Simple Details'}
            </h2>
            <p className="text-xs text-[#8C7355]">
              {language === 'hi'
                ? 'फोटो, उत्पाद का नाम, और सामग्री दर्ज करें — शेष विवरण और उचित मूल्य AI ३० सेकंड में तैयार करेगा।'
                : 'Enter your photo, product name, and materials used. Our AI handles the rest in 30 seconds.'}
            </p>
          </div>

          {/* Validation Banner if missing fields */}
          {validationError && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center gap-2 max-w-xl mx-auto animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span className="font-medium">{validationError}</span>
            </div>
          )}

          {/* Progress Indicators for the 3 Requirements */}
          <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
            <div
              className={`p-3 rounded-2xl border text-center transition-all ${
                originalPhoto
                  ? 'bg-green-50/70 border-green-200 text-green-800'
                  : 'bg-[#FAF9F7] border-[#E6D5C3] text-[#8C7355]'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider block">Requirement 1</span>
              <span className="text-xs font-bold flex items-center justify-center gap-1 mt-0.5">
                {originalPhoto ? <Check className="w-3.5 h-3.5 text-green-600" /> : '📸'} Product Photo
              </span>
            </div>

            <div
              className={`p-3 rounded-2xl border text-center transition-all ${
                productName.trim()
                  ? 'bg-green-50/70 border-green-200 text-green-800'
                  : 'bg-[#FAF9F7] border-[#E6D5C3] text-[#8C7355]'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider block">Requirement 2</span>
              <span className="text-xs font-bold flex items-center justify-center gap-1 mt-0.5">
                {productName.trim() ? <Check className="w-3.5 h-3.5 text-green-600" /> : '🏷️'} Product Name
              </span>
            </div>

            <div
              className={`p-3 rounded-2xl border text-center transition-all ${
                materials.trim()
                  ? 'bg-green-50/70 border-green-200 text-green-800'
                  : 'bg-[#FAF9F7] border-[#E6D5C3] text-[#8C7355]'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider block">Requirement 3</span>
              <span className="text-xs font-bold flex items-center justify-center gap-1 mt-0.5">
                {materials.trim() ? <Check className="w-3.5 h-3.5 text-green-600" /> : '🧵'} Materials Used
              </span>
            </div>
          </div>

          <div className="space-y-6 max-w-2xl mx-auto">
            {/* 1. PRODUCT PHOTO */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#3E2723] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#8B5E34] text-white flex items-center justify-center text-[10px]">1</span>
                  <span>{language === 'hi' ? 'उत्पाद फोटो *' : 'Product Photo *'}</span>
                </label>
                {originalPhoto && (
                  <span className="text-[11px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Check className="w-3 h-3" /> Photo Attached
                  </span>
                )}
              </div>

              {originalPhoto ? (
                <div className="p-4 bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-[#E6D5C3] shadow-inner shrink-0">
                      <img src={originalPhoto} alt="Product" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-[#3E2723] block">Handcrafted Photo Selected</span>
                      <span className="text-[11px] text-[#8C7355]">Ready for AI optical studio enhancement</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="px-3.5 py-2 text-xs font-bold text-[#3E2723] bg-white border border-[#E6D5C3] hover:bg-[#F5F1EE] rounded-xl cursor-pointer shadow-2xs">
                      Change Photo
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#8B5E34]/40 hover:border-[#8B5E34] rounded-3xl bg-[#FAF9F7] hover:bg-[#F5F1EE] cursor-pointer transition-all group shadow-inner">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#E6D5C3] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform mb-2">
                    <Upload className="w-6 h-6 text-[#8B5E34]" />
                  </div>
                  <span className="text-sm font-bold text-[#3E2723]">
                    {language === 'hi' ? 'फोटो अपलोड करें या कैमरा खोलें' : 'Click to Upload / Open Camera'}
                  </span>
                  <span className="text-[11px] text-[#8C7355] mt-0.5">
                    JPG, PNG, WEBP from camera or gallery
                  </span>
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileUpload} />
                </label>
              )}

              {/* Sample Craft Quick Pickers */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-[#8C7355] block">
                  {language === 'hi' ? 'या तुरंत परीक्षण के लिए नमूना शिल्प चुनें:' : 'Or pick a 1-click sample craft:'}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {SAMPLE_CRAFT_PHOTOS.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleSelectSampleCraft(sample)}
                      className={`p-2 rounded-xl text-left border transition-all flex flex-col items-center text-center cursor-pointer ${
                        originalPhoto === sample.url
                          ? 'bg-[#FAF6F0] border-[#8B5E34] ring-2 ring-[#8B5E34]/30'
                          : 'bg-white border-[#E6D5C3] hover:border-[#8B5E34]'
                      }`}
                    >
                      <img src={sample.url} alt={sample.label} className="w-12 h-12 rounded-lg object-cover mb-1 shadow-2xs" />
                      <span className="text-[10px] font-bold text-[#3E2723] line-clamp-1">
                        {language === 'hi' ? sample.labelHi : sample.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. PRODUCT NAME */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#3E2723] uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#8B5E34] text-white flex items-center justify-center text-[10px]">2</span>
                <span>{language === 'hi' ? 'उत्पाद का नाम *' : 'Product Name *'}</span>
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => {
                  setProductName(e.target.value);
                  if (validationError) setValidationError('');
                }}
                placeholder={
                  language === 'hi'
                    ? 'उदा. टेराकोटा मिट्टी का फूलदान या कश्मीरी पश्मीना शॉल'
                    : 'e.g. Terracotta Water Pitcher or Handwoven Pashmina Stole'
                }
                className="w-full px-4 py-3 text-sm bg-white border border-[#E6D5C3] rounded-2xl focus:ring-2 focus:ring-[#8B5E34] text-[#3E2723] font-semibold"
              />
            </div>

            {/* 3. MATERIALS USED */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#3E2723] uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#8B5E34] text-white flex items-center justify-center text-[10px]">3</span>
                <span>{language === 'hi' ? 'उपयोग की गई सामग्री (Materials Used) *' : 'Materials Used *'}</span>
              </label>
              <input
                type="text"
                value={materials}
                onChange={(e) => {
                  setMaterials(e.target.value);
                  if (validationError) setValidationError('');
                }}
                placeholder={
                  language === 'hi'
                    ? 'उदा. प्राकृतिक नदी की मिट्टी, जैविक रंग, धुआं पॉलिश'
                    : 'e.g. Natural riverbed clay, organic mineral slip, smoke burnishing'
                }
                className="w-full px-4 py-3 text-sm bg-white border border-[#E6D5C3] rounded-2xl focus:ring-2 focus:ring-[#8B5E34] text-[#3E2723] font-semibold"
              />

              {/* Quick 1-Tap Material Pills */}
              <div className="space-y-1">
                <span className="text-[10px] text-[#8C7355] block">
                  {language === 'hi' ? '💡 त्वरित चयन के लिए सामग्री पर क्लिक करें:' : '💡 1-tap quick suggestions to add:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_MATERIALS.map((mat, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectMaterialPill(mat)}
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                        materials.includes(mat)
                          ? 'bg-[#8B5E34] text-white border-[#8B5E34]'
                          : 'bg-[#FAF9F7] text-[#6D5843] border-[#E6D5C3] hover:border-[#8B5E34]'
                      }`}
                    >
                      + {mat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-[#E6D5C3] flex flex-wrap items-center justify-between gap-4 max-w-2xl mx-auto">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 text-xs font-semibold text-[#8C7355] hover:text-[#3E2723] hover:bg-[#FAF9F7] rounded-xl transition-all cursor-pointer"
            >
              ← Cancel to Dashboard
            </button>

            <button
              type="button"
              onClick={start30SecondCreation}
              className="px-8 py-3.5 bg-[#244238] hover:bg-[#1A3129] text-white font-bold text-sm rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-2 border border-[#3E5C51] cursor-pointer"
            >
              <Zap className="w-4 h-4 text-[#D8962B] fill-current" />
              <span>
                {language === 'hi' ? '⚡ ३० सेकंड में लिस्टिंग बनाएं' : '⚡ Start 30-Second AI Creation'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          STAGE 2: 30-SECOND COUNTDOWN & PROCESSING
          ========================================================================= */}
      {workflowState === 'processing' && (
        <div className="p-8 sm:p-12 bg-white border border-[#E6D5C3] rounded-3xl shadow-md text-center space-y-8 max-w-xl mx-auto">
          {/* Animated 30s Countdown Ring */}
          <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="#FAF6F0" strokeWidth="8" fill="none" />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#8B5E34"
                strokeWidth="8"
                strokeDasharray="264"
                strokeDashoffset={264 - (Math.min(timerSeconds, 30) / 30) * 264}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-serif font-bold text-[#3E2723]">
                {Math.max(0, 30 - timerSeconds)}s
              </span>
              <span className="text-[10px] uppercase font-bold text-[#8B5E34] tracking-wider">
                {language === 'hi' ? 'शेष समय' : 'Remaining'}
              </span>
            </div>
          </div>

          {/* Dynamic Stage Message */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#3E2723] animate-pulse">
              {processingStage}
            </h3>
            <p className="text-xs text-[#8C7355]">
              {language === 'hi'
                ? `AI आपके "${productName}" और "${materials}" के आधार पर विवरण, टैग व मूल्य तैयार कर रहा है।`
                : `AI is generating descriptions, tags, and fair trade pricing using "${productName}" and "${materials}".`}
            </p>
          </div>

          {/* Micro Progress Checklist */}
          <div className="p-4 bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl space-y-2.5 text-xs text-left max-w-md mx-auto">
            <div className="flex items-center gap-2.5">
              <CheckCircle2
                className={`w-4 h-4 ${timerSeconds >= 5 ? 'text-green-600' : 'text-[#8C7355]'}`}
              />
              <span className={timerSeconds >= 5 ? 'text-[#3E2723] font-bold' : 'text-[#8C7355]'}>
                1. Studio Lighting & Background Enhancement
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2
                className={`w-4 h-4 ${timerSeconds >= 12 ? 'text-green-600' : 'text-[#8C7355]'}`}
              />
              <span className={timerSeconds >= 12 ? 'text-[#3E2723] font-bold' : 'text-[#8C7355]'}>
                2. Analyzing Craft Technique & Materials
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2
                className={`w-4 h-4 ${timerSeconds >= 20 ? 'text-green-600' : 'text-[#8C7355]'}`}
              />
              <span className={timerSeconds >= 20 ? 'text-[#3E2723] font-bold' : 'text-[#8C7355]'}>
                3. Bilingual Descriptions (English & Hindi)
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2
                className={`w-4 h-4 ${timerSeconds >= 27 ? 'text-green-600' : 'text-[#8C7355]'}`}
              />
              <span className={timerSeconds >= 27 ? 'text-[#3E2723] font-bold' : 'text-[#8C7355]'}>
                4. Fair Trade Artisan Wage & Price Recommendation
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                clearInterval(timerIntervalRef.current);
                setWorkflowState('upload');
              }}
              className="text-xs text-[#8C7355] hover:text-[#3E2723] underline cursor-pointer"
            >
              Cancel & Return to Form
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          STAGE 3: ARTISAN REVIEW BEFORE PUBLISHING
          ========================================================================= */}
      {workflowState === 'review' && generatedProduct && (
        <div className="space-y-6">
          {/* Header */}
          <div className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold text-[#8B5E34] tracking-wider block">
                {language === 'hi' ? 'समीक्षा व अनुमोदन' : 'Review Before Publishing'}
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#3E2723]">
                {language === 'hi' ? '✨ आपकी उत्पाद लिस्टिंग ३० सेकंड में तैयार है!' : '✨ Your Product Listing is Ready!'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setWorkflowState('upload')}
                className="px-4 py-2 bg-[#FAF9F7] hover:bg-[#F5F1EE] text-[#3E2723] text-xs font-bold rounded-xl border border-[#E6D5C3] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'इनपुट बदलें' : 'Back / Change Inputs'}</span>
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-xs font-semibold text-[#8C7355] hover:text-[#3E2723] transition-colors cursor-pointer"
              >
                {language === 'hi' ? 'डैशबोर्ड' : 'Exit'}
              </button>
            </div>
          </div>

          {/* Two-Column Comparison & Data Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Column 1: Enhanced Studio Photo with Original Toggle */}
            <div className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#3E2723] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#D8962B]" />
                  {showOriginalComparison ? 'Original Uploaded Photo' : 'Studio Enhanced Photo'}
                </span>

                <button
                  type="button"
                  onClick={() => setShowOriginalComparison(!showOriginalComparison)}
                  className="px-3 py-1 bg-[#FAF9F7] hover:bg-[#F5F1EE] border border-[#E6D5C3] text-[11px] font-bold text-[#8B5E34] rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {showOriginalComparison ? 'View Enhanced Photo' : 'Compare Original Photo'}
                </button>
              </div>

              <div className="aspect-square rounded-2xl overflow-hidden bg-[#FAF9F7] border border-[#E6D5C3] relative shadow-inner">
                <img
                  src={showOriginalComparison ? originalPhoto : enhancedPhoto || originalPhoto}
                  alt={generatedProduct.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                <div className="absolute top-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold rounded-full">
                  {showOriginalComparison ? 'Original Camera Shot' : '✨ Studio Lighting Enhanced'}
                </div>
              </div>

              <p className="text-[11px] text-[#8C7355] text-center">
                {language === 'hi'
                  ? 'फोटो का कोई भी वास्तविक विवरण नहीं बदला गया है — केवल प्रकाश, कंट्रास्ट और स्पष्टता को निखारा गया है।'
                  : 'Zero authentic craft details altered — only optical exposure and contrast tuned.'}
              </p>
            </div>

            {/* Column 2: AI Generated Details (Bilingual & Pricing) */}
            <div className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-5">
              <div className="space-y-2">
                <span className="px-2.5 py-0.5 bg-[#FAF6F0] text-[#8B5E34] border border-[#E6D5C3] text-[10px] font-bold uppercase rounded-full">
                  {generatedProduct.category}
                </span>

                <h3 className="text-xl font-serif font-bold text-[#3E2723]">
                  {generatedProduct.name}
                </h3>

                <p className="text-xs text-[#8C7355]">
                  By {artisanProfile.name} · {artisanProfile.location}
                </p>
              </div>

              {/* Price Benchmarking & Slider */}
              <div className="p-4 bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-[#8B5E34] flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5" /> Fair Retail Price
                  </span>
                  <span className="text-xs font-mono font-bold text-[#8C7355]">
                    AI Range: ₹{generatedProduct.minPrice?.toLocaleString('en-IN')} – ₹
                    {generatedProduct.maxPrice?.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-serif font-bold text-[#3E2723]">
                    ₹{editablePrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
                    100% to your UPI ID ({artisanProfile.upiId})
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-[#8C7355]">
                    <span>Adjust Price:</span>
                    <span>₹{editablePrice}</span>
                  </div>
                  <input
                    type="range"
                    min={Math.max(500, Math.round((generatedProduct.minPrice || 1000) * 0.7))}
                    max={Math.round((generatedProduct.maxPrice || 2500) * 1.3)}
                    step={50}
                    value={editablePrice}
                    onChange={(e) => setEditablePrice(Number(e.target.value))}
                    className="w-full accent-[#8B5E34] cursor-pointer"
                  />
                </div>
              </div>

              {/* Bilingual Description with Tabs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-[#E6D5C3] pb-1.5">
                  <span className="text-xs font-bold text-[#3E2723]">Description</span>
                  <div className="flex items-center gap-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveDescLang('en')}
                      className={`px-2 py-0.5 rounded-md font-bold transition-colors cursor-pointer ${
                        activeDescLang === 'en' ? 'bg-[#8B5E34] text-white' : 'text-[#6D5843] hover:bg-[#FAF9F7]'
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDescLang('hi')}
                      className={`px-2 py-0.5 rounded-md font-bold transition-colors cursor-pointer ${
                        activeDescLang === 'hi' ? 'bg-[#8B5E34] text-white' : 'text-[#6D5843] hover:bg-[#FAF9F7]'
                      }`}
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
                    Materials Used
                  </span>
                  <span className="font-semibold text-[#3E2723] block truncate">
                    {generatedProduct.materials}
                  </span>
                </div>

                <div className="p-2.5 bg-white border border-[#E6D5C3] rounded-xl">
                  <span className="text-[10px] text-[#8C7355] block font-bold uppercase">
                    Craft Technique
                  </span>
                  <span className="font-semibold text-[#3E2723] block truncate">
                    {generatedProduct.craftTechnique}
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {generatedProduct.tags?.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-semibold bg-[#FAF6F0] text-[#8B5E34] border border-[#E6D5C3] px-2.5 py-0.5 rounded-full"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Satisfaction Decision Card */}
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

              {/* NO -> Regenerate or Edit */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                  className="px-5 py-4 bg-white hover:bg-[#FAF9F7] text-[#3E2723] text-xs font-bold rounded-2xl shadow-xs border border-[#E6D5C3] hover:border-[#8B5E34] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 text-[#8B5E34] ${isRegenerating ? 'animate-spin' : ''}`} />
                  <span>
                    {language === 'hi' ? '🔄 दोबारा बनाएं' : 'NO, Regenerate with AI'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onSwitchToFullEditor(generatedProduct)}
                  className="px-5 py-4 bg-white hover:bg-[#FAF9F7] text-[#8B5E34] text-xs font-bold rounded-2xl shadow-xs border border-[#E6D5C3] hover:border-[#8B5E34] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>
                    {language === 'hi' ? '✏️ सुधारें (Full Editor)' : 'NO, Edit in Full Editor'}
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
                ? `"${generatedProduct?.name}" अब कलाकृति स्टोर पर उपलब्ध है। ग्राहक सीधे आपके UPI (${artisanProfile.upiId}) पर भुगतान कर सकते हैं।`
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
                setProductName('');
                setMaterials('');
                setGeneratedProduct(null);
              }}
              className="px-6 py-3 bg-[#8B5E34] hover:bg-[#734B26] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#D8962B]" />
              {language === 'hi' ? '✨ दूसरा उत्पाद ३० सेकंड में जोड़ें' : '✨ Add Another in 30 Seconds'}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-[#FAF9F7] hover:bg-[#F5F1EE] border border-[#E6D5C3] text-[#3E2723] font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              {language === 'hi' ? 'डैशबोर्ड पर जाएं' : 'Go to Dashboard'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
