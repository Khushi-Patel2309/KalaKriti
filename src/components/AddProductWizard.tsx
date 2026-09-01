import React, { useState } from 'react';
import { Product, ProductCategory, ArtisanProfile } from '../types';
import { PhotoEnhancerStudio } from './PhotoEnhancerStudio';
import { VoiceRecorderModal } from './VoiceRecorderModal';
import { Camera, Mic, Sparkles, Check, ArrowRight, ArrowLeft, RefreshCw, IndianRupee, Tag, AlertCircle, Upload, Eye } from 'lucide-react';

interface AddProductWizardProps {
  onProductPublished: (product: Product) => void;
  onCancel: () => void;
  artisanProfile: ArtisanProfile;
  initialProductToEdit?: Product | null;
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
  onProductPublished,
  onCancel,
  artisanProfile,
  initialProductToEdit,
}) => {
  const [step, setStep] = useState<number>(1);
  const [originalPhoto, setOriginalPhoto] = useState<string>(initialProductToEdit?.imageOriginal || initialProductToEdit?.imageEnhanced || '');
  const [enhancedPhoto, setEnhancedPhoto] = useState<string | null>(initialProductToEdit?.imageEnhanced || null);
  const [enhanceMode, setEnhanceMode] = useState<'removebg' | 'studio' | 'none'>(initialProductToEdit?.enhanceMode || 'studio');

  const [voiceText, setVoiceText] = useState(initialProductToEdit?.descriptionEnglish || '');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isGeneratingListing, setIsGeneratingListing] = useState(false);

  // Form Fields
  const [name, setName] = useState(initialProductToEdit?.name || '');
  const [category, setCategory] = useState<ProductCategory>(initialProductToEdit?.category || 'Textiles & Weaving');
  const [materials, setMaterials] = useState(initialProductToEdit?.materials || '');
  const [color, setColor] = useState(initialProductToEdit?.color || '');
  const [craftTechnique, setCraftTechnique] = useState(initialProductToEdit?.craftTechnique || '');
  const [descriptionEnglish, setDescriptionEnglish] = useState(initialProductToEdit?.descriptionEnglish || '');
  const [descriptionHindi, setDescriptionHindi] = useState(initialProductToEdit?.descriptionHindi || '');
  const [tags, setTags] = useState<string[]>(initialProductToEdit?.tags || ['handmade', 'artisan-crafted']);
  const [tagInput, setTagInput] = useState('');
  const [quantity, setQuantity] = useState<number>(initialProductToEdit?.quantity || 5);

  // Pricing Fields
  const [price, setPrice] = useState<number>(initialProductToEdit?.price || 1450);
  const [suggestedPrice, setSuggestedPrice] = useState<number>(initialProductToEdit?.suggestedPrice || 1450);
  const [minPrice, setMinPrice] = useState<number>(initialProductToEdit?.minPrice || 1100);
  const [maxPrice, setMaxPrice] = useState<number>(initialProductToEdit?.maxPrice || 1850);
  const [pricingReasoning, setPricingReasoning] = useState<string>('Fair artisan price benchmarked for handcrafted quality.');
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);

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
      alert('Please speak or type a short description of your product first.');
      return;
    }
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
    } catch (err) {
      console.error('Error generating listing:', err);
      // Fallback
      setName(voiceText.slice(0, 45));
      setDescriptionEnglish(voiceText);
      setStep(4);
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
          name,
          category,
          materials,
          craftTechnique,
          description: descriptionEnglish,
        }),
      });

      const data = await res.json();
      if (data.suggestedPrice) {
        setSuggestedPrice(data.suggestedPrice);
        setPrice(data.suggestedPrice);
        setMinPrice(data.minPrice || Math.round(data.suggestedPrice * 0.75));
        setMaxPrice(data.maxPrice || Math.round(data.suggestedPrice * 1.25));
        setPricingReasoning(data.reasoning || 'Fair trade artisan labor estimate.');
      }
    } catch (err) {
      console.error('Error getting price:', err);
    } finally {
      setIsCalculatingPrice(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handlePublish = () => {
    if (!name.trim()) {
      alert('Please enter a product title.');
      setStep(4);
      return;
    }
    if (price <= 0) {
      alert('Please enter a valid selling price greater than ₹0.');
      return;
    }

    const categoryEmojis: Record<string, string> = {
      'Textiles & Weaving': '🧵',
      'Pottery & Ceramics': '🏺',
      'Jewelry': '💍',
      'Woodwork': '🪵',
      'Metalwork': '⚒️',
      'Home Decor': '🏠',
      'Paintings & Art': '🎨',
    };

    const newProduct: Product = {
      id: initialProductToEdit?.id || 'prod_' + Date.now(),
      name: name.trim(),
      category,
      materials: materials.trim() || 'Natural materials',
      color: color.trim() || 'Traditional colors',
      craftTechnique: craftTechnique.trim() || 'Handmade',
      descriptionEnglish: descriptionEnglish.trim() || voiceText || 'Handcrafted by Indian artisan.',
      descriptionHindi: descriptionHindi.trim() || 'कारीगर द्वारा हस्तनिर्मित।',
      tags: tags.length > 0 ? tags : ['handmade', 'kalakriti'],
      price,
      oldPrice: Math.round(price * 1.25),
      suggestedPrice,
      minPrice,
      maxPrice,
      quantity: Math.max(1, quantity),
      status: 'published',
      emoji: categoryEmojis[category] || '🎁',
      views: initialProductToEdit?.views || 0,
      sold: initialProductToEdit?.sold || 0,
      imageOriginal: originalPhoto || null,
      imageEnhanced: enhancedPhoto || originalPhoto || null,
      enhanceMode,
      artisanId: artisanProfile.id,
      artisanName: artisanProfile.name,
      artisanLocation: artisanProfile.location,
      createdAt: initialProductToEdit?.createdAt || Date.now(),
    };

    onProductPublished(newProduct);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Stepper Progress Header */}
      <div className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-[#8B5E34]">
              Artisan Catalog Creator
            </span>
            <h2 className="text-xl font-bold font-serif text-[#3E2723]">
              {initialProductToEdit ? 'Edit Product Listing' : 'Add New Handmade Product'}
            </h2>
          </div>
          <span className="text-xs font-bold text-[#8B5E34] bg-[#F5F1EE] border border-[#E6D5C3] px-3 py-1 rounded-full">
            Step {step} of 5
          </span>
        </div>

        {/* Progress Bar */}
        <div className="grid grid-cols-5 gap-2">
          {[
            { num: 1, label: '1. Photo' },
            { num: 2, label: '2. Studio Enhance' },
            { num: 3, label: '3. Voice Details' },
            { num: 4, label: '4. AI Listing' },
            { num: 5, label: '5. Price & Publish' },
          ].map((s) => (
            <div key={s.num} className="space-y-1">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  step >= s.num ? 'bg-[#8B5E34]' : 'bg-[#E6D5C3]'
                }`}
              />
              <span className={`text-[10px] font-bold block truncate ${step === s.num ? 'text-[#8B5E34]' : 'text-[#8C7355]'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Upload / Take Real Photo */}
      {step === 1 && (
        <div className="p-8 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-[#F5F1EE] text-[#8B5E34] border border-[#E6D5C3] flex items-center justify-center mx-auto shadow-xs">
            <Camera className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-bold font-serif text-[#3E2723]">
              Capture Your Real Product
            </h3>
            <p className="text-xs text-[#8C7355] max-w-md mx-auto mt-1">
              Take a clear picture of your craft under natural light. In the next step, our AI Photo Studio will enhance the lighting and remove the background without changing your real craft.
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
                  className="px-6 py-2 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs flex items-center gap-1.5"
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
              onClick={onCancel}
              className="text-xs font-semibold text-[#8C7355] hover:text-[#3E2723]"
            >
              Cancel
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
              setStep(3); // Move to Voice Details
            }}
            onCancel={() => setStep(1)}
          />
        </div>
      )}

      {/* STEP 3: Voice-to-Text & Product Description */}
      {step === 3 && (
        <div className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6D5C3]">
            <div>
              <h3 className="text-lg font-bold font-serif text-[#3E2723] flex items-center gap-2">
                <Mic className="w-5 h-5 text-[#8B5E34]" /> Tell Us About Your Craft (Voice or Text)
              </h3>
              <p className="text-xs text-[#8C7355]">
                Speak naturally in Hindi, Gujarati, English, or any Indian language. Our AI converts your voice directly into text!
              </p>
            </div>
          </div>

          <div className="p-6 bg-[#FAF9F7] rounded-2xl border border-[#E6D5C3] text-center space-y-4">
            <button
              type="button"
              onClick={() => setIsVoiceModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#8B5E34] hover:bg-[#734B26] text-white font-bold text-sm rounded-2xl shadow-md transition-all hover:scale-105"
            >
              <Mic className="w-5 h-5" /> 🎙️ Open Voice-to-Text Recorder
            </button>
            <p className="text-xs text-[#6D5843]">
              Supports Hindi, English, Gujarati, Marathi, Bengali, Tamil, Telugu with real-time transcription.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8B5E34] uppercase tracking-wider block">
              Spoken Description Transcript
            </label>
            <textarea
              value={voiceText}
              onChange={(e) => setVoiceText(e.target.value)}
              placeholder="e.g. This is a handwoven Kala cotton dupatta made with organic indigo and madder dyes. It took 14 hours on a traditional pit loom with mirror embroidery..."
              rows={4}
              className="w-full p-3.5 text-xs bg-white border border-[#E6D5C3] rounded-xl focus:ring-2 focus:ring-[#8B5E34] text-[#3E2723]"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E6D5C3]">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 text-xs font-semibold text-[#8C7355]"
            >
              ← Back to Photo Studio
            </button>
            <button
              type="button"
              onClick={handleGenerateListing}
              disabled={isGeneratingListing || !voiceText.trim()}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] disabled:opacity-50 rounded-xl shadow-xs"
            >
              {isGeneratingListing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> AI Organising Listing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" /> Generate AI Product Listing →
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Review & Refine AI Listing (English + Hindi) */}
      {step === 4 && (
        <div className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6D5C3]">
            <div>
              <h3 className="text-lg font-bold font-serif text-[#3E2723] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#8B5E34]" /> Review Your AI Structured Listing
              </h3>
              <p className="text-xs text-[#8C7355]">
                AI structured your words into a bilingual listing. You can edit any details.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="font-bold text-[#8B5E34] block mb-1">Product Title *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kutchi Handwoven Organic Cotton Dupatta"
                className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl font-semibold text-sm text-[#3E2723]"
              />
            </div>

            <div>
              <label className="font-bold text-[#8B5E34] block mb-1">Craft Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-[#8B5E34] block mb-1">Quantity in Stock *</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
              />
            </div>

            <div>
              <label className="font-bold text-[#8B5E34] block mb-1">Materials Used</label>
              <input
                type="text"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                placeholder="e.g. Kala cotton, natural indigo dye"
                className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
              />
            </div>

            <div>
              <label className="font-bold text-[#8B5E34] block mb-1">Craft Technique</label>
              <input
                type="text"
                value={craftTechnique}
                onChange={(e) => setCraftTechnique(e.target.value)}
                placeholder="e.g. Pit loom extra-weft weaving"
                className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-[#8B5E34] block mb-1">English Description (Customer Facing)</label>
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
                    <button type="button" onClick={() => handleRemoveTag(t)} className="hover:text-[#8B5E34]">
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
                  className="px-4 py-2 bg-[#FAF9F7] border border-[#E6D5C3] text-[#3E2723] hover:bg-[#F5F1EE] font-bold text-xs rounded-xl"
                >
                  + Add Tag
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E6D5C3]">
            <button type="button" onClick={() => setStep(3)} className="px-4 py-2 text-xs font-semibold text-[#8C7355]">
              ← Back to Voice
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(5);
                handleFetchPriceSuggestion();
              }}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs"
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
            <button type="button" onClick={() => setStep(4)} className="px-4 py-2 text-xs font-semibold text-[#8C7355]">
              ← Back to Review
            </button>
            <button
              type="button"
              onClick={handlePublish}
              className="flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-md hover:scale-[1.02] transition-all"
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
        }}
      />
    </div>
  );
};
