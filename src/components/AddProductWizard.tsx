import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product, ProductCategory, ArtisanProfile } from '../types';
import { PhotoEnhancerStudio } from './PhotoEnhancerStudio';
import { VoiceRecorderModal } from './VoiceRecorderModal';
import {
  Upload,
  Mic,
  Sparkles,
  Check,
  RefreshCw,
  IndianRupee,
  ArrowRight,
  Sliders,
  AlertCircle,
  HelpCircle,
  Zap,
} from 'lucide-react';

interface AddProductWizardProps {
  artisanProfile: ArtisanProfile;
  initialProductToEdit?: Product | null;
  onProductPublished: (product: Product) => void;
  onCancel: () => void;
  onSwitchTo30Seconds?: () => void;
}

const CATEGORIES: ProductCategory[] = [
  'Textiles & Weaving',
  'Pottery & Ceramics',
  'Jewelry',
  'Woodwork',
  'Metalwork',
  'Home Decor',
  'Paintings & Art',
];

export const AddProductWizard: React.FC<AddProductWizardProps> = ({
  artisanProfile,
  initialProductToEdit,
  onProductPublished,
  onCancel,
  onSwitchTo30Seconds,
}) => {
  // Read existing draft from sessionStorage to survive page refresh safely
  const getInitialDraft = () => {
    if (initialProductToEdit) return null;
    try {
      const saved = sessionStorage.getItem('kalakriti_wizard_draft');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const draft = getInitialDraft();

  const [step, setStep] = useState<number>(draft?.step || 1);
  const [maxVisitedStep, setMaxVisitedStep] = useState<number>(draft?.maxVisitedStep || 1);
  const [originalPhoto, setOriginalPhoto] = useState<string>(
    initialProductToEdit?.imageOriginal || initialProductToEdit?.imageEnhanced || draft?.originalPhoto || ''
  );
  const [enhancedPhoto, setEnhancedPhoto] = useState<string | null>(
    initialProductToEdit?.imageEnhanced || draft?.enhancedPhoto || null
  );
  const [enhanceMode, setEnhanceMode] = useState<'removebg' | 'studio' | 'none'>(
    initialProductToEdit?.enhanceMode || draft?.enhanceMode || 'studio'
  );

  const [voiceText, setVoiceText] = useState(
    initialProductToEdit?.descriptionEnglish || draft?.voiceText || ''
  );
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isGeneratingListing, setIsGeneratingListing] = useState(false);
  const [step3Error, setStep3Error] = useState<string>('');

  // Form Fields
  const [name, setName] = useState(initialProductToEdit?.name || draft?.name || '');
  const [category, setCategory] = useState<ProductCategory>(
    initialProductToEdit?.category || draft?.category || 'Textiles & Weaving'
  );
  const [materials, setMaterials] = useState(initialProductToEdit?.materials || draft?.materials || '');
  const [color, setColor] = useState(initialProductToEdit?.color || draft?.color || '');
  const [craftTechnique, setCraftTechnique] = useState(
    initialProductToEdit?.craftTechnique || draft?.craftTechnique || ''
  );
  const [descriptionEnglish, setDescriptionEnglish] = useState(
    initialProductToEdit?.descriptionEnglish || draft?.descriptionEnglish || ''
  );
  const [descriptionHindi, setDescriptionHindi] = useState(
    initialProductToEdit?.descriptionHindi || draft?.descriptionHindi || ''
  );
  const [tags, setTags] = useState<string[]>(
    initialProductToEdit?.tags || draft?.tags || ['handmade', 'artisan-crafted']
  );
  const [tagInput, setTagInput] = useState('');
  const [quantity, setQuantity] = useState<number>(initialProductToEdit?.quantity || draft?.quantity || 5);

  // Pricing Fields
  const [price, setPrice] = useState<number>(initialProductToEdit?.price || draft?.price || 1450);
  const [suggestedPrice, setSuggestedPrice] = useState<number>(
    initialProductToEdit?.suggestedPrice || draft?.suggestedPrice || 1450
  );
  const [minPrice, setMinPrice] = useState<number>(
    initialProductToEdit?.minPrice || draft?.minPrice || 1100
  );
  const [maxPrice, setMaxPrice] = useState<number>(
    initialProductToEdit?.maxPrice || draft?.maxPrice || 1850
  );
  const [pricingReasoning, setPricingReasoning] = useState<string>(
    draft?.pricingReasoning || 'Fair artisan price benchmarked for handcrafted quality.'
  );
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);

  // Update max visited step
  useEffect(() => {
    if (step > maxVisitedStep) {
      setMaxVisitedStep(step);
    }
  }, [step, maxVisitedStep]);

  // Persist draft to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(
        'kalakriti_wizard_draft',
        JSON.stringify({
          step,
          maxVisitedStep,
          originalPhoto,
          enhancedPhoto,
          enhanceMode,
          voiceText,
          name,
          category,
          materials,
          color,
          craftTechnique,
          descriptionEnglish,
          descriptionHindi,
          tags,
          quantity,
          price,
          suggestedPrice,
          minPrice,
          maxPrice,
          pricingReasoning,
        })
      );
    } catch {
      // Ignore sessionStorage issues
    }
  }, [
    step,
    maxVisitedStep,
    originalPhoto,
    enhancedPhoto,
    enhanceMode,
    voiceText,
    name,
    category,
    materials,
    color,
    craftTechnique,
    descriptionEnglish,
    descriptionHindi,
    tags,
    quantity,
    price,
    suggestedPrice,
    minPrice,
    maxPrice,
    pricingReasoning,
  ]);

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setOriginalPhoto(dataUrl);
      setEnhancedPhoto(dataUrl);
      setStep(2); // Move to Studio Enhancer
    };
    reader.readAsDataURL(file);
  };

  // AI Generate Listing API Call
  const handleGenerateListing = async () => {
    if (!voiceText.trim()) {
      setStep3Error('Please enter or speak a description of your craft first, or click "Continue to Next Step (Manual Entry)".');
      return;
    }
    setStep3Error('');
    setIsGeneratingListing(true);

    try {
      const res = await fetch('/api/gemini/generate-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: voiceText,
          categoryHint: category,
        }),
      });

      if (!res.ok) {
        throw new Error('AI service was temporarily unavailable.');
      }

      const data = await res.json();
      if (data.name) setName(data.name);
      if (data.category && CATEGORIES.includes(data.category)) setCategory(data.category);
      if (data.materials) setMaterials(data.materials);
      if (data.color) setColor(data.color);
      if (data.craftTechnique) setCraftTechnique(data.craftTechnique);
      if (data.descriptionEnglish) setDescriptionEnglish(data.descriptionEnglish);
      if (data.descriptionHindi) setDescriptionHindi(data.descriptionHindi);
      if (data.tags && Array.isArray(data.tags)) setTags(data.tags);

      setStep(4); // Move to Review
    } catch (err: any) {
      console.error('Error generating listing:', err);
      setStep3Error(
        err.message || 'Unable to connect to AI listing generator. You can retry or proceed directly to enter details manually.'
      );
      // Populate basic values so progress is preserved
      if (!name) setName(voiceText.slice(0, 45));
      if (!descriptionEnglish) setDescriptionEnglish(voiceText);
    } finally {
      setIsGeneratingListing(false);
    }
  };

  // AI Fair Price Suggestion API Call
  const handleFetchPriceSuggestion = async () => {
    setIsCalculatingPrice(true);
    try {
      const res = await fetch('/api/gemini/suggest-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          materials,
          craftTechnique,
          name,
        }),
      });

      const data = await res.json();
      if (data.suggestedPrice) {
        setSuggestedPrice(data.suggestedPrice);
        setPrice(data.suggestedPrice);
      }
      if (data.minPrice) setMinPrice(data.minPrice);
      if (data.maxPrice) setMaxPrice(data.maxPrice);
      if (data.reasoning) setPricingReasoning(data.reasoning);
    } catch (err) {
      console.error('Error fetching price suggestion:', err);
      // Fallback sensible defaults
      setSuggestedPrice(1450);
      setMinPrice(1100);
      setMaxPrice(1850);
      setPricingReasoning('Fair trade artisan price benchmarked for handmade authentic quality.');
    } finally {
      setIsCalculatingPrice(false);
    }
  };

  // Tag helper
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Publish Product Handler
  const handlePublish = async () => {
    console.log('ARTISAN PROFILE BEING USED:', artisanProfile);
  try {
    // 1. Find the selected category in Supabase
    let { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('name', category)
      .maybeSingle();

    if (categoryError) {
      throw categoryError;
    }

    // 2. If the category doesn't exist, create it
    if (!categoryData) {
  throw new Error(`Category "${category}" not found in the database.`);
}

    // 3. Insert the product into Supabase
    const { data: savedProduct, error: productError } = await supabase
      .from('products')
      .insert({
        artisan_id: artisanProfile.id,
        category_id: categoryData.id,
        name: name || 'Handcrafted Heritage Item',
        description:
          descriptionEnglish ||
          'Exquisitely handcrafted by master artisan.',
        hindi_description:
          descriptionHindi ||
          'मास्टर कारीगर द्वारा पारंपरिक विरासत तकनीकों से निर्मित हस्तशिल्प।',
        price: price,
        quantity: quantity,
        material: materials || 'Authentic natural materials',
        technique: craftTechnique || 'Traditional Indian Handcraft',
        color: color || 'Natural earth tones',
        craft_type: category,
        image_url: enhancedPhoto || originalPhoto || null,
        status: 'published',
        ai_generated: true,
      })
      .select()
      .single();

    if (productError) {
      throw productError;
    }

    console.log('PRODUCT SAVED TO SUPABASE:', savedProduct);

    // 4. Create the Product object your existing website expects
    const newProduct: Product = {
      id: savedProduct.id,
      name: name || 'Handcrafted Heritage Item',
      category,
      materials: materials || 'Authentic natural materials',
      color: color || 'Natural earth tones',
      craftTechnique: craftTechnique || 'Traditional Indian Handcraft',
      descriptionEnglish:
        descriptionEnglish ||
        'Exquisitely handcrafted by master artisan.',
      descriptionHindi:
        descriptionHindi ||
        'पारंपरिक विरासत तकनीकों से निर्मित हस्तशिल्प।',
      tags,
      price,
      oldPrice: Math.round(price * 1.25),
      suggestedPrice,
      minPrice,
      maxPrice,
      quantity,
      status: 'published',
      emoji: '🪷',
      views: 0,
      sold: 0,
      imageOriginal: originalPhoto,
      imageEnhanced: enhancedPhoto || originalPhoto,
      enhanceMode,
      artisanId: artisanProfile.id,
      artisanName: artisanProfile.name,
      artisanLocation: artisanProfile.location,
      createdAt: Date.now(),
    };

    sessionStorage.removeItem('kalakriti_wizard_draft');

    // 5. Update the existing dashboard
    onProductPublished(newProduct);

  } catch (error: any) {
    console.error('ERROR SAVING PRODUCT:', error);
    alert(
      `Unable to publish product: ${
        error?.message || 'Unknown database error'
      }`
    );
  }
};

  const handleSafeCancel = () => {
    sessionStorage.removeItem('kalakriti_wizard_draft');
    onCancel();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Wizard Header & Stepper */}
      <div className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-[#8B5E34] block">
              KalaKriti Artisan Studio
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#3E2723]">
              {initialProductToEdit ? 'Edit Product Listing' : 'Add New Craft to Marketplace'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleSafeCancel}
            className="text-xs font-semibold text-[#8C7355] hover:text-[#3E2723] px-3 py-1.5 rounded-lg hover:bg-[#FAF9F7] transition-colors cursor-pointer"
          >
            Exit to Dashboard
          </button>
        </div>

        {/* Dynamic Progress Stepper Bar with safe navigation clicks */}
        <div className="grid grid-cols-5 gap-2 pt-2">
          {[
            { num: 1, label: '1. Photo' },
            { num: 2, label: '2. Studio' },
            { num: 3, label: '3. Text Identification' },
            { num: 4, label: '4. Listing Details' },
            { num: 5, label: '5. Fair Price' },
          ].map((s) => {
            const isClickable = s.num <= Math.max(step, maxVisitedStep);
            return (
              <button
                key={s.num}
                type="button"
                disabled={!isClickable}
                onClick={() => {
                  if (isClickable) setStep(s.num);
                }}
                className={`space-y-1 text-left w-full transition-all focus:outline-none ${
                  isClickable ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-50'
                }`}
              >
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    step >= s.num ? 'bg-[#8B5E34]' : 'bg-[#E6D5C3]'
                  }`}
                />
                <span
                  className={`text-[10px] font-bold block truncate ${
                    step === s.num ? 'text-[#8B5E34]' : 'text-[#8C7355]'
                  }`}
                >
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Upload / Take Real Photo */}
      {step === 1 && (
        <div className="p-8 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-6 text-center">
          {/* Optional Prominent "Product Ready in 30 Seconds" Fast Mode Switcher */}
          {onSwitchTo30Seconds && (
            <div className="p-4 bg-gradient-to-r from-[#244238] via-[#1D362E] to-[#142620] text-white rounded-2xl flex flex-wrap items-center justify-between gap-3 text-left shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D8962B] text-[#244238] flex items-center justify-center font-bold shrink-0">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    ✨ Want 30-Second AI Creation?
                  </span>
                  <span className="text-[11px] text-[#C2D8D0] block">
                    Upload 1 photo, name, and materials — AI does the rest in 30s!
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onSwitchTo30Seconds}
                className="px-4 py-2 bg-[#D8962B] hover:bg-[#C28524] text-[#244238] text-xs font-bold rounded-xl shadow-xs transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Switch to 30s Fast Mode</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div>
            <h3 className="text-lg font-bold font-serif text-[#3E2723]">Step 1: Upload a Real Craft Photo</h3>
            <p className="text-xs text-[#8C7355] max-w-md mx-auto mt-1">
              Take a clear picture of your craft under natural light. In the next step, our AI Photo Studio will enhance the lighting without altering your real craft.
            </p>
          </div>

          {originalPhoto ? (
            <div className="space-y-4 max-w-sm mx-auto">
              <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-[#E6D5C3] p-2 shadow-inner">
                <img src={originalPhoto} alt="Product Preview" className="w-full h-full object-contain" />
              </div>
              <div className="flex gap-2 justify-center">
                <label className="px-4 py-2 text-xs font-bold text-[#3E2723] bg-[#FAF9F7] border border-[#E6D5C3] hover:bg-[#F5F1EE] rounded-xl cursor-pointer">
                  Change Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </label>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  Enhance in Studio <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 border-2 border-dashed border-[#8B5E34]/40 rounded-2xl bg-[#FAF9F7] space-y-4 max-w-md mx-auto">
              <label className="inline-flex flex-col items-center justify-center p-6 bg-white border border-[#E6D5C3] rounded-2xl shadow-xs hover:border-[#8B5E34] cursor-pointer transition-all">
                <Upload className="w-8 h-8 text-[#8B5E34] mb-2" />
                <span className="text-sm font-bold text-[#3E2723]">Upload / Take Photo</span>
                <span className="text-[11px] text-[#8C7355] mt-0.5">Supports JPG, PNG, WEBP from camera or gallery</span>
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>
          )}

          <div className="flex justify-start pt-4 border-t border-[#E6D5C3]">
            <button
              type="button"
              onClick={handleSafeCancel}
              className="text-xs font-semibold text-[#8C7355] hover:text-[#3E2723] cursor-pointer"
            >
              Cancel to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Photo Studio & Remove.bg Enhancement */}
      {step === 2 && (
        <div className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-6">
          <PhotoEnhancerStudio
            originalImage={originalPhoto}
            enhancedImage={enhancedPhoto}
            onApplyEnhanced={(enhancedUrl, mode) => {
              setEnhancedPhoto(enhancedUrl);
              setEnhanceMode(mode);
              setStep(3); // Move to Text Identification
            }}
            onCancel={() => setStep(1)}
          />
        </div>
      )}

      {/* STEP 3: Text Identification & Spoken Description */}
      {step === 3 && (
        <div className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6D5C3]">
            <div>
              <h3 className="text-lg font-bold font-serif text-[#3E2723] flex items-center gap-2">
                <Mic className="w-5 h-5 text-[#8B5E34]" /> Text Identification & Voice Input
              </h3>
              <p className="text-xs text-[#8C7355]">
                Speak or type naturally in Hindi, Gujarati, English, or any Indian language. Our AI converts your voice directly into text and structures your listing.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSafeCancel}
              className="text-xs font-semibold text-[#8C7355] hover:text-[#3E2723] px-2.5 py-1 rounded-md hover:bg-[#FAF9F7]"
            >
              Exit
            </button>
          </div>

          {/* Inline Error & Retry Banner if AI encountered an error */}
          {step3Error && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <span className="font-bold block">AI Processing Notice</span>
                  <span>{step3Error}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1 pl-7">
                <button
                  type="button"
                  onClick={handleGenerateListing}
                  className="px-3 py-1.5 bg-[#8B5E34] text-white text-xs font-bold rounded-lg shadow-xs hover:bg-[#734B26] transition-colors cursor-pointer"
                >
                  🔄 Retry AI Identification
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-3 py-1.5 bg-white border border-amber-300 text-amber-900 text-xs font-bold rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
                >
                  Continue to Step 4 Manually →
                </button>
              </div>
            </div>
          )}

          {/* Voice-to-Text Action Card */}
          <div className="p-6 bg-[#FAF9F7] rounded-2xl border border-[#E6D5C3] text-center space-y-3">
            <button
              type="button"
              onClick={() => setIsVoiceModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#8B5E34] hover:bg-[#734B26] text-white font-bold text-sm rounded-2xl shadow-md transition-all hover:scale-105 cursor-pointer"
            >
              <Mic className="w-5 h-5" /> 🎙️ Open Voice-to-Text Recorder
            </button>
            <p className="text-xs text-[#6D5843]">
              Supports Hindi, English, Gujarati, Marathi, Bengali, Tamil, Telugu with real-time transcription.
            </p>
          </div>

          {/* Spoken / Typed Transcript Textarea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#8B5E34] uppercase tracking-wider block">
                Craft Description & Transcript
              </label>
              <span className="text-[11px] text-[#8C7355]">
                {voiceText.length} characters
              </span>
            </div>
            <textarea
              value={voiceText}
              onChange={(e) => {
                setVoiceText(e.target.value);
                if (step3Error) setStep3Error('');
              }}
              placeholder="e.g. This is a handwoven Kala cotton dupatta made with organic indigo and madder dyes. It took 14 hours on a traditional pit loom with mirror embroidery..."
              rows={4}
              className="w-full p-3.5 text-xs bg-white border border-[#E6D5C3] rounded-xl focus:ring-2 focus:ring-[#8B5E34] text-[#3E2723]"
            />
          </div>

          {/* Informational Guidance Notice (Never silently trapping the user) */}
          {!voiceText.trim() && !step3Error && (
            <div className="p-3 bg-[#FAF9F7] border border-[#E6D5C3] rounded-xl text-xs text-[#8C7355] flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#8B5E34] shrink-0" />
              <span>
                💡 Speak or type a craft description above to let AI structure your title and tags, or click <strong>"Continue to Step 4 (Manual Entry)"</strong> to enter details manually.
              </span>
            </div>
          )}

          {/* Loading State Banner during AI generation with Cancel option */}
          {isGeneratingListing && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-blue-900">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-700" />
                <span>AI is analyzing your craft description, identifying materials, and generating bilingual copy...</span>
              </div>
              <button
                type="button"
                onClick={() => setIsGeneratingListing(false)}
                className="px-2.5 py-1 bg-white border border-blue-300 text-blue-800 rounded-lg font-bold hover:bg-blue-100"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Step 3 Navigation Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E6D5C3]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-semibold text-[#8C7355] hover:text-[#3E2723] hover:bg-[#FAF9F7] rounded-xl transition-all cursor-pointer"
              >
                ← Previous: Photo Studio
              </button>
              <button
                type="button"
                onClick={handleSafeCancel}
                className="px-3 py-2 text-xs font-semibold text-[#8C7355] hover:text-[#3E2723] transition-colors cursor-pointer"
              >
                Exit
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Skip AI / Manual Entry is ALWAYS accessible so the artisan is never trapped */}
              <button
                type="button"
                onClick={() => {
                  if (voiceText.trim() && !descriptionEnglish) {
                    setDescriptionEnglish(voiceText);
                    if (!name) setName(voiceText.slice(0, 45));
                  }
                  setStep(4);
                }}
                className="px-4 py-2.5 text-xs font-bold text-[#8B5E34] bg-[#FAF9F7] hover:bg-[#F5F1EE] border border-[#E6D5C3] rounded-xl transition-colors cursor-pointer"
              >
                Skip AI & Enter Manually →
              </button>

              {/* AI Generation Button */}
              <button
                type="button"
                onClick={handleGenerateListing}
                disabled={isGeneratingListing}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] disabled:opacity-50 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                {isGeneratingListing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> AI Organizing Listing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white" /> Generate AI Product Listing →
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Review & Refine AI Listing (English + Hindi) */}
      {step === 4 && (
        <div className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6D5C3]">
            <div>
              <h3 className="text-lg font-bold font-serif text-[#3E2723] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#8B5E34]" /> Review Your Listing Details
              </h3>
              <p className="text-xs text-[#8C7355]">
                Review or edit title, materials, craft technique, and bilingual descriptions.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSafeCancel}
              className="text-xs font-semibold text-[#8C7355] hover:text-[#3E2723] px-2.5 py-1 rounded-md hover:bg-[#FAF9F7]"
            >
              Exit
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="font-bold text-[#8B5E34] block mb-1">Product Title *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Handwoven Pashmina Shawl with Sozni Needlework"
                className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl font-bold text-[#3E2723]"
              />
            </div>

            <div>
              <label className="font-bold text-[#8B5E34] block mb-1">Craft Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-[#8B5E34] block mb-1">Available Stock / Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
              />
            </div>

            <div>
              <label className="font-bold text-[#8B5E34] block mb-1">Materials Used *</label>
              <input
                type="text"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                placeholder="e.g. Organic Kala cotton, natural madder and indigo dyes"
                className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
              />
            </div>

            <div>
              <label className="font-bold text-[#8B5E34] block mb-1">Craft Technique / Heritage Lineage</label>
              <input
                type="text"
                value={craftTechnique}
                onChange={(e) => setCraftTechnique(e.target.value)}
                placeholder="e.g. Traditional Pit Loom Weaving"
                className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-[#8B5E34] block mb-1">English Customer Description *</label>
              <textarea
                value={descriptionEnglish}
                onChange={(e) => setDescriptionEnglish(e.target.value)}
                rows={3}
                className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-[#8B5E34] block mb-1">हिंदी विवरण (Hindi Description)</label>
              <textarea
                value={descriptionHindi}
                onChange={(e) => setDescriptionHindi(e.target.value)}
                rows={2}
                className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
              />
            </div>

            {/* Tags */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-bold text-[#8B5E34] block">Search Tags</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-[#FAF9F7] text-[#3E2723] border border-[#E6D5C3] px-2.5 py-1 rounded-lg flex items-center gap-1"
                  >
                    #{t}
                    <button type="button" onClick={() => handleRemoveTag(t)} className="hover:text-[#8B5E34] cursor-pointer">
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add custom tag (e.g. eco-friendly)..."
                  className="flex-1 p-2 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-[#FAF9F7] border border-[#E6D5C3] text-[#3E2723] hover:bg-[#F5F1EE] font-bold text-xs rounded-xl cursor-pointer"
                >
                  + Add Tag
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E6D5C3]">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-4 py-2 text-xs font-semibold text-[#8C7355] hover:text-[#3E2723] cursor-pointer"
            >
              ← Back to Text Identification
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(5);
                handleFetchPriceSuggestion();
              }}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs cursor-pointer"
            >
              Continue to Fair Pricing →
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Fair-Trade Pricing & Publish */}
      {step === 5 && (
        <div className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6D5C3]">
            <div>
              <h3 className="text-lg font-bold font-serif text-[#3E2723] flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-[#8B5E34]" /> AI Fair Pricing & Instant Publish
              </h3>
              <p className="text-xs text-[#8C7355]">
                KalaKriti benchmarks artisan labor, material costs, and market rates so you always earn a fair wage.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSafeCancel}
              className="text-xs font-semibold text-[#8C7355] hover:text-[#3E2723] px-2.5 py-1 rounded-md hover:bg-[#FAF9F7]"
            >
              Exit
            </button>
          </div>

          {/* AI Price Calculation Card */}
          <div className="p-5 bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold text-[#8B5E34] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> AI Recommended Price
              </span>
              {isCalculatingPrice && (
                <span className="text-xs text-[#8B5E34] flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Calculating fair rate...
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-serif text-[#3E2723]">
                ₹{suggestedPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-[#8C7355]">
                (Recommended Range: ₹{minPrice.toLocaleString('en-IN')} – ₹{maxPrice.toLocaleString('en-IN')})
              </span>
            </div>

            <p className="text-xs text-[#6D5843] leading-relaxed italic">
              "{pricingReasoning}"
            </p>
          </div>

          {/* Artisan Final Set Price Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8B5E34] uppercase tracking-wider block">
              Set Your Final Retail Selling Price (₹) *
            </label>
            <div className="relative max-w-xs">
              <span className="absolute left-3.5 top-2.5 text-base font-bold text-[#3E2723]">₹</span>
              <input
                type="number"
                min="1"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2.5 text-lg font-bold font-serif bg-white border-2 border-[#8B5E34] rounded-xl focus:ring-2 focus:ring-[#8B5E34] text-[#3E2723]"
              />
            </div>
            <p className="text-[11px] text-[#8C7355]">
              100% of this sale goes to your registered UPI ID ({artisanProfile.upiId}) upon delivery.
            </p>
          </div>

          {/* Product Preview Snippet */}
          <div className="p-4 bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white border border-[#E6D5C3] overflow-hidden flex items-center justify-center shrink-0">
              {enhancedPhoto ? (
                <img src={enhancedPhoto} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">🧵</span>
              )}
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#3E2723]">{name || 'Your Product'}</h4>
              <p className="text-xs text-[#8C7355]">{category} · {artisanProfile.name}</p>
              <p className="text-xs font-bold text-[#8B5E34] mt-0.5">₹{price.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E6D5C3]">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="px-4 py-2 text-xs font-semibold text-[#8C7355] hover:text-[#3E2723] cursor-pointer"
            >
              ← Back to Review
            </button>
            <button
              type="button"
              onClick={handlePublish}
              className="flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-md hover:scale-[1.02] transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" /> Publish Product to KalaKriti Marketplace
            </button>
          </div>
        </div>
      )}

      {/* Voice Recorder Modal */}
      <VoiceRecorderModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        initialText={voiceText}
        onTranscriptComplete={(text) => {
          setVoiceText(text);
          setIsVoiceModalOpen(false);
          setStep3Error('');
        }}
      />
    </div>
  );
};
