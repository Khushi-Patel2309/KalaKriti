import React, { useState, useEffect, useRef } from 'react';
import { Sliders, Sparkles, ExternalLink, RefreshCw, Check, Sun, Contrast, Palette, Eye, ArrowRight } from 'lucide-react';

interface PhotoEnhancerStudioProps {
  originalImage: string;
  enhancedImage?: string | null;
  onApplyEnhanced: (enhancedUrl: string, mode: 'removebg' | 'studio' | 'none') => void;
  onCancel?: () => void;
}

export const PhotoEnhancerStudio: React.FC<PhotoEnhancerStudioProps> = ({
  originalImage,
  enhancedImage: initialEnhanced,
  onApplyEnhanced,
  onCancel,
}) => {
  const [brightness, setBrightness] = useState(106); // 100 is normal
  const [contrast, setContrast] = useState(112); // 100 is normal
  const [saturation, setSaturation] = useState(110);
  const [warmth, setWarmth] = useState(104);
  const [backdrop, setBackdrop] = useState<'pure-white' | 'studio-cream' | 'warm-linen' | 'none'>('pure-white');
  const [removeBgKey, setRemoveBgKey] = useState(localStorage.getItem('kalakriti_removebg_key') || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentEnhancedUrl, setCurrentEnhancedUrl] = useState<string>(initialEnhanced || originalImage);
  const [viewMode, setViewMode] = useState<'comparison' | 'enhanced-only' | 'original-only'>('comparison');
  const [statusMessage, setStatusMessage] = useState<string>('Real photo is preserved. Studio lighting and contrast applied.');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate canvas-enhanced image based on the sliders and backdrop
  const generateEnhancedCanvas = () => {
    if (!originalImage) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw backdrop if selected
      if (backdrop === 'pure-white') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (backdrop === 'studio-cream') {
        ctx.fillStyle = '#FDFBF7';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (backdrop === 'warm-linen') {
        ctx.fillStyle = '#F4E9D5';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Apply non-destructive optical enhancements (brightness, contrast, vibrance, warmth)
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${warmth > 100 ? (warmth - 100) * 0.4 : 0}%)`;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const enhancedDataUrl = canvas.toDataURL('image/jpeg', 0.94);
      setCurrentEnhancedUrl(enhancedDataUrl);
    };
    img.src = originalImage;
  };

  useEffect(() => {
    generateEnhancedCanvas();
  }, [brightness, contrast, saturation, warmth, backdrop, originalImage]);

  // Real Remove.bg API integration if user provides key
  const handleRemoveBgApi = async () => {
    if (!removeBgKey.trim()) {
      setStatusMessage('Enter your free remove.bg API key, or use 1-click "Open Remove.bg" in new tab.');
      return;
    }
    setIsProcessing(true);
    setStatusMessage('Connecting to remove.bg API to extract perfect background cutout...');

    try {
      localStorage.setItem('kalakriti_removebg_key', removeBgKey.trim());
      const response = await fetch(originalImage);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('image_file', blob);
      formData.append('size', 'auto');
      formData.append('bg_color', backdrop === 'pure-white' ? 'FFFFFF' : 'FDFBF7');

      const res = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': removeBgKey.trim(),
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`remove.bg error (${res.status}): Please check API key.`);
      }

      const outBlob = await res.blob();
      const objectUrl = URL.createObjectURL(outBlob);
      setCurrentEnhancedUrl(objectUrl);
      setStatusMessage('✨ Background successfully removed with remove.bg! Real item preserved.');
    } catch (err: any) {
      console.warn('Remove.bg error:', err);
      setStatusMessage(`Notice: ${err.message || 'API request failed'}. Using high-definition studio filter enhancement.`);
      generateEnhancedCanvas();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setWarmth(100);
    setBackdrop('none');
    setCurrentEnhancedUrl(originalImage);
    setStatusMessage('Reset to original photo.');
  };

  const handleAutoEnhance = () => {
    setBrightness(108);
    setContrast(115);
    setSaturation(112);
    setWarmth(104);
    setBackdrop('pure-white');
    setStatusMessage('✨ Applied intelligent e-commerce studio lighting & white backdrop.');
  };

  return (
    <div className="space-y-6">
      {/* Studio Header Card */}
      <div className="p-4 bg-white border border-[#E6D5C3] rounded-2xl shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#8B5E34] text-white rounded-lg">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="font-bold font-serif text-[#3E2723] text-base">KalaKriti Photo Studio & Background Enhancer</h3>
            </div>
            <p className="text-xs text-[#8C7355] mt-0.5">
              The real product is never transformed or replaced — we enhance clarity, lighting, and clean backdrops.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAutoEnhance}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#8B5E34] text-white hover:bg-[#734B26] rounded-xl shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" /> 1-Click Auto Studio Polish
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#8C7355] hover:text-[#3E2723] bg-white border border-[#E6D5C3] rounded-xl hover:bg-[#FAF9F7]"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Remove.bg Direct Link & Integration Banner */}
      <div className="p-4 bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 bg-[#8B5E34] text-white rounded-md uppercase tracking-wider">
                Recommended Tool
              </span>
              <a
                href="https://www.remove.bg/"
                target="_blank"
                rel="noreferrer"
                className="text-sm font-bold text-[#8B5E34] hover:underline flex items-center gap-1"
              >
                https://www.remove.bg/ <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-xs text-[#6D5843]">
              Use remove.bg to cut out backgrounds in 5 seconds. Open the tool or enter your remove.bg API key below for direct integration.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://www.remove.bg/"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 text-xs font-bold text-[#3E2723] bg-white border border-[#E6D5C3] hover:bg-[#F5F1EE] rounded-xl shadow-xs flex items-center gap-1.5 whitespace-nowrap"
            >
              Open Remove.bg <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[#E6D5C3] flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Paste optional remove.bg API key for automated cutout..."
            value={removeBgKey}
            onChange={(e) => setRemoveBgKey(e.target.value)}
            className="flex-1 min-w-[240px] px-3 py-1.5 text-xs bg-white border border-[#E6D5C3] rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#8B5E34] text-[#3E2723]"
          />
          <button
            type="button"
            onClick={handleRemoveBgApi}
            disabled={isProcessing}
            className="px-3 py-1.5 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-lg disabled:opacity-60 transition-colors"
          >
            {isProcessing ? 'Processing...' : 'Apply Remove.bg'}
          </button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#8B5E34] uppercase tracking-wider">
          Visual Preview ({viewMode === 'comparison' ? 'Side-by-Side Comparison' : viewMode})
        </span>
        <div className="flex items-center p-0.5 bg-[#F5F1EE] rounded-xl text-xs border border-[#E6D5C3]">
          <button
            type="button"
            onClick={() => setViewMode('comparison')}
            className={`px-3 py-1 font-semibold rounded-lg transition-all ${
              viewMode === 'comparison' ? 'bg-[#8B5E34] text-white shadow-xs' : 'text-[#8C7355]'
            }`}
          >
            Side-by-Side
          </button>
          <button
            type="button"
            onClick={() => setViewMode('enhanced-only')}
            className={`px-3 py-1 font-semibold rounded-lg transition-all ${
              viewMode === 'enhanced-only' ? 'bg-[#8B5E34] text-white shadow-xs' : 'text-[#8C7355]'
            }`}
          >
            Enhanced Only
          </button>
          <button
            type="button"
            onClick={() => setViewMode('original-only')}
            className={`px-3 py-1 font-semibold rounded-lg transition-all ${
              viewMode === 'original-only' ? 'bg-[#8B5E34] text-white shadow-xs' : 'text-[#8C7355]'
            }`}
          >
            Original
          </button>
        </div>
      </div>

      {/* Visual Comparison Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original Photo */}
        {(viewMode === 'comparison' || viewMode === 'original-only') && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-[#8C7355] px-1">
              <span>📷 Original Photo</span>
              <span className="text-[10px] font-normal">Unedited Raw Capture</span>
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF9F7] border border-[#E6D5C3] shadow-inner flex items-center justify-center">
              <img
                src={originalImage}
                alt="Original Product"
                className="w-full h-full object-contain p-2"
              />
            </div>
          </div>
        )}

        {/* Enhanced Photo */}
        {(viewMode === 'comparison' || viewMode === 'enhanced-only') && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-[#8B5E34] px-1">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> ✨ Studio Enhanced Photo
              </span>
              <span className="text-[10px] font-semibold bg-[#F5F1EE] text-[#8B5E34] px-2 py-0.5 rounded-full border border-[#E6D5C3]">
                Marketplace Ready
              </span>
            </div>
            <div
              className={`relative aspect-square rounded-2xl overflow-hidden border-2 border-[#8B5E34] shadow-md flex items-center justify-center transition-colors ${
                backdrop === 'pure-white'
                  ? 'bg-white'
                  : backdrop === 'studio-cream'
                  ? 'bg-[#FAF9F7]'
                  : backdrop === 'warm-linen'
                  ? 'bg-[#F5F1EE]'
                  : 'bg-[#FAF9F7]'
              }`}
            >
              <img
                src={currentEnhancedUrl}
                alt="Enhanced Product"
                className="w-full h-full object-contain p-2 transition-all drop-shadow-md"
              />
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-center text-[#6D5843] font-medium bg-[#FAF9F7] py-1.5 rounded-lg border border-[#E6D5C3]">
        {statusMessage}
      </p>

      {/* Adjustment Sliders & Backdrop Palette */}
      <div className="p-5 bg-white border border-[#E6D5C3] rounded-2xl space-y-4 shadow-xs">
        <h4 className="text-xs font-bold text-[#8B5E34] uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-[#8B5E34]" /> Fine-Tune Studio Lighting Controls
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Brightness */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-[#3E2723]">
              <span className="flex items-center gap-1"><Sun className="w-3.5 h-3.5 text-[#8B5E34]" /> Brightness</span>
              <span className="font-mono text-[11px]">{brightness}%</span>
            </div>
            <input
              type="range"
              min="80"
              max="140"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full accent-[#8B5E34]"
            />
          </div>

          {/* Contrast */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-[#3E2723]">
              <span className="flex items-center gap-1"><Contrast className="w-3.5 h-3.5 text-[#8B5E34]" /> Contrast & Clarity</span>
              <span className="font-mono text-[11px]">{contrast}%</span>
            </div>
            <input
              type="range"
              min="80"
              max="150"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-full accent-[#8B5E34]"
            />
          </div>

          {/* Saturation */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-[#3E2723]">
              <span className="flex items-center gap-1"><Palette className="w-3.5 h-3.5 text-[#8B5E34]" /> Color Vibrance</span>
              <span className="font-mono text-[11px]">{saturation}%</span>
            </div>
            <input
              type="range"
              min="80"
              max="140"
              value={saturation}
              onChange={(e) => setSaturation(Number(e.target.value))}
              className="w-full accent-[#8B5E34]"
            />
          </div>

          {/* Warmth */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-[#3E2723]">
              <span className="flex items-center gap-1">🌿 Natural Earthen Tone</span>
              <span className="font-mono text-[11px]">{warmth}%</span>
            </div>
            <input
              type="range"
              min="100"
              max="130"
              value={warmth}
              onChange={(e) => setWarmth(Number(e.target.value))}
              className="w-full accent-[#8B5E34]"
            />
          </div>
        </div>

        {/* Backdrop selector */}
        <div className="pt-3 border-t border-[#E6D5C3] space-y-1.5">
          <label className="text-xs font-bold text-[#3E2723] block">
            E-Commerce Studio Backdrop
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'pure-white', name: 'Pure White (Amazon/Flipkart Ready)', color: 'bg-white' },
              { id: 'studio-cream', name: 'Creme White (KalaKriti Signature)', color: 'bg-[#FAF9F7]' },
              { id: 'warm-linen', name: 'Warm Linen (Earthy Heritage)', color: 'bg-[#F5F1EE]' },
              { id: 'none', name: 'Keep Original Environment', color: 'bg-[#E6D5C3]' },
            ].map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBackdrop(b.id as any)}
                className={`p-2 rounded-xl text-left border text-xs transition-all flex items-center gap-2 ${
                  backdrop === b.id
                    ? 'border-[#8B5E34] bg-[#F5F1EE] font-bold text-[#8B5E34] ring-2 ring-[#8B5E34]/20'
                    : 'border-[#E6D5C3] bg-white text-[#3E2723] hover:bg-[#FAF9F7]'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border border-black/20 ${b.color}`} />
                <span className="truncate">{b.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-sm font-semibold text-[#8C7355] hover:text-[#3E2723] rounded-xl transition-colors"
          >
            ← Back
          </button>
        ) : <div />}

        <button
          type="button"
          onClick={() => onApplyEnhanced(currentEnhancedUrl, removeBgKey ? 'removebg' : 'studio')}
          className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-md transition-all"
        >
          <Check className="w-4 h-4" /> Save & Use Enhanced Photo <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
