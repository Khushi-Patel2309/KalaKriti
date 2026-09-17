import React, { useState, useEffect, useRef } from 'react';
import { ArtisanProfile, Product, Order } from '../types';
import { VoiceRecorderModal } from './VoiceRecorderModal';
import { ArtisanAnnualReport } from './ArtisanAnnualReport';
import { useLanguage } from '../context/LanguageContext';
import {
  User,
  Award,
  MapPin,
  Phone,
  Mail,
  QrCode,
  Mic,
  Check,
  AlertCircle,
  Sparkles,
  Edit3,
  ShieldCheck,
  BarChart3,
  FileText,
  TrendingUp,
  RefreshCw,
  Copy,
  X,
  ArrowLeft,
  ArrowRight,
  Camera,
  Upload,
  Trash2,
  Volume2,
  Play,
  Square,
} from 'lucide-react';

interface ArtisanProfileViewProps {
  profile: ArtisanProfile;
  onUpdateProfile: (updated: ArtisanProfile) => void;
  products?: Product[];
  orders?: Order[];
  initialTab?: 'report' | 'details';
}

export const ArtisanProfileView: React.FC<ArtisanProfileViewProps> = ({
  profile,
  onUpdateProfile,
  products = [],
  orders = [],
  initialTab = 'report',
}) => {
  const { language } = useLanguage();

  // Read saved draft on mount to survive page refresh
  const getInitialDraft = () => {
    try {
      const saved = sessionStorage.getItem('kalakriti_artisan_profile_draft');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const draft = getInitialDraft();

  const [profileTab, setProfileTab] = useState<'report' | 'details'>(
    draft?.profileTab || initialTab
  );
  const [formData, setFormData] = useState<ArtisanProfile>(draft?.formData || profile);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isPlayingVoiceStory, setIsPlayingVoiceStory] = useState(false);
  const [isRecordingVoiceStory, setIsRecordingVoiceStory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // QR Modal Section State
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(draft?.isQrModalOpen || false);
  const [qrStatus, setQrStatus] = useState<'ready' | 'generating' | 'error'>('ready');
  const [qrError, setQrError] = useState('');
  const [qrCopied, setQrCopied] = useState(false);
  const [qrKey, setQrKey] = useState<number>(Date.now());

  // Photo Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Profile photo size should be under 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData((prev) => ({ ...prev, photo: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Voice Story Speech Synthesis
  const handleTogglePlayVoiceStory = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingVoiceStory) {
      window.speechSynthesis.cancel();
      setIsPlayingVoiceStory(false);
      return;
    }

    window.speechSynthesis.cancel();
    const text =
      formData.story ||
      formData.bio ||
      `नमस्ते, मेरा नाम ${formData.name} है। मैं ${formData.location} से हूँ और विगत ${formData.experienceYears} वर्षों से ${formData.craft} की पारंपरिक हस्तकला का निर्माण कर रहा हूँ।`;

    const utterance = new SpeechSynthesisUtterance(text);
    const lang = formData.voiceStoryLanguage || 'hi';
    utterance.lang = lang === 'en' ? 'en-IN' : lang === 'gu' ? 'gu-IN' : lang === 'mr' ? 'mr-IN' : 'hi-IN';
    utterance.rate = 0.95;
    utterance.onstart = () => setIsPlayingVoiceStory(true);
    utterance.onend = () => setIsPlayingVoiceStory(false);
    utterance.onerror = () => setIsPlayingVoiceStory(false);
    window.speechSynthesis.speak(utterance);
  };

  // Voice Story Dictation
  const handleToggleRecordVoiceStory = () => {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMsg('Voice dictation is not supported in this browser.');
      return;
    }

    if (isRecordingVoiceStory) {
      setIsRecordingVoiceStory(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const lang = formData.voiceStoryLanguage || 'hi';
      recognition.lang = lang === 'en' ? 'en-IN' : 'hi-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecordingVoiceStory(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setFormData((prev) => ({
          ...prev,
          story: prev.story ? `${prev.story} ${transcript}` : transcript,
        }));
        setIsRecordingVoiceStory(false);
      };

      recognition.onerror = () => {
        setIsRecordingVoiceStory(false);
      };

      recognition.onend = () => {
        setIsRecordingVoiceStory(false);
      };

      recognition.start();
    } catch {
      setIsRecordingVoiceStory(false);
    }
  };

  // Persist draft to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(
        'kalakriti_artisan_profile_draft',
        JSON.stringify({
          profileTab,
          formData,
          isQrModalOpen,
        })
      );
    } catch {
      // Ignore
    }
  }, [profileTab, formData, isQrModalOpen]);

  // Strictly enforce non-negative experience validation
  const handleExperienceChange = (value: string) => {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      setFormData({ ...formData, experienceYears: 0 });
      return;
    }
    // Strictly prevent negative values
    const nonNegativeValue = Math.max(0, parsed);
    setFormData({ ...formData, experienceYears: nonNegativeValue });
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.craft.trim() || !formData.location.trim()) {
      setErrorMsg('Please fill in your Name, Craft Category, and Location.');
      return;
    }

    if (formData.experienceYears < 0) {
      setErrorMsg('Experience years cannot be negative. Minimum is 0.');
      return;
    }

    setErrorMsg('');
    sessionStorage.removeItem('kalakriti_artisan_profile_draft');
    onUpdateProfile({
      ...formData,
      experienceYears: Math.max(0, formData.experienceYears),
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Safe QR generation with duplicate request prevention
  const handleGenerateOrRefreshQr = () => {
    if (qrStatus === 'generating') return; // Guard against duplicate requests
    setQrStatus('generating');
    setQrError('');

    setTimeout(() => {
      setQrKey(Date.now());
      setQrStatus('ready');
    }, 500);
  };

  const handleCopyUpi = () => {
    if (formData.upiId) {
      navigator.clipboard.writeText(formData.upiId);
      setQrCopied(true);
      setTimeout(() => setQrCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-[#E6D5C3] pb-1">
        <button
          type="button"
          onClick={() => setProfileTab('report')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            profileTab === 'report'
              ? 'border-[#8B5E34] text-[#8B5E34]'
              : 'border-transparent text-[#8C7355] hover:text-[#3E2723]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Annual Impact Report & Progress</span>
        </button>

        <button
          type="button"
          onClick={() => setProfileTab('details')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            profileTab === 'details'
              ? 'border-[#8B5E34] text-[#8B5E34]'
              : 'border-transparent text-[#8C7355] hover:text-[#3E2723]'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Artisan Profile Details & Story</span>
        </button>
      </div>

      {/* TAB 1: Annual Report & Progress Dashboard */}
      {profileTab === 'report' && (
        <ArtisanAnnualReport
          profile={formData}
          products={products}
          orders={orders}
          onEditProfile={() => setProfileTab('details')}
        />
      )}

      {/* TAB 2: Edit Profile Details */}
      {profileTab === 'details' && (
        <div className="p-6 sm:p-8 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E6D5C3]">
            <div>
              <h2 className="text-xl font-bold font-serif text-[#3E2723]">
                Artisan Profile & Craft Lineage
              </h2>
              <p className="text-xs text-[#8C7355]">
                Your public profile helps conscious buyers connect with your heritage story.
              </p>
            </div>
            {isSaved && (
              <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full flex items-center gap-1 font-bold">
                <Check className="w-3.5 h-3.5" /> Changes Saved
              </span>
            )}
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Artisan Profile Photo Card */}
          <div className="p-4 bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative group w-20 h-20 rounded-full border-2 border-[#8B5E34] overflow-hidden bg-white flex items-center justify-center shadow-xs">
                {formData.photo ? (
                  <img
                    src={formData.photo}
                    alt={formData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-[#8C7355]" />
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Change photo"
                >
                  <Camera className="w-6 h-6" />
                </button>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#3E2723]">Artisan Profile Photo</h3>
                <p className="text-[11px] text-[#8C7355]">
                  Add or edit your artisan portrait. Visible to craft collectors and buyers.
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-[#8B5E34] hover:bg-[#734B26] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload / Change Photo</span>
                  </button>
                  {formData.photo && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, photo: undefined }))}
                      className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-[#3E2723] block mb-1">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723] font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-[#3E2723] block mb-1">Primary Craft Specialization *</label>
              <input
                type="text"
                value={formData.craft}
                onChange={(e) => setFormData({ ...formData, craft: e.target.value })}
                className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
              />
            </div>

            <div>
              <label className="font-bold text-[#3E2723] block mb-1">Village / Region & State *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
              />
            </div>

            <div>
              <label className="font-bold text-[#3E2723] block mb-1">
                Years of Craft Experience * (Non-negative)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.experienceYears}
                onChange={(e) => handleExperienceChange(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723] font-bold"
              />
              <p className="text-[10px] text-[#8C7355] mt-0.5">
                Must be 0 or higher. Represents your lineage experience.
              </p>
            </div>

            <div>
              <label className="font-bold text-[#3E2723] block mb-1">Phone Number (For WhatsApp Order Alerts)</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
              />
            </div>

            {/* UPI ID Section with View & Test Store QR Code button */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-[#3E2723] block">
                  UPI ID for Direct Customer QR Payments *
                </label>
                <button
                  type="button"
                  onClick={() => setIsQrModalOpen(true)}
                  className="text-[11px] font-bold text-[#8B5E34] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>View / Test Store QR</span>
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                  placeholder="e.g. devji.vankar@okhdfcbank"
                  className="flex-1 p-2.5 bg-white border border-[#E6D5C3] rounded-xl font-mono text-[#8B5E34] font-bold"
                />
                <button
                  type="button"
                  onClick={() => setIsQrModalOpen(true)}
                  className="px-3 py-2 bg-[#FAF9F7] hover:bg-[#F5F1EE] border border-[#E6D5C3] rounded-xl font-bold text-[#3E2723] flex items-center gap-1 cursor-pointer"
                  title="Open QR Section"
                >
                  <QrCode className="w-4 h-4 text-[#8B5E34]" />
                  <span>QR</span>
                </button>
              </div>
              <p className="text-[10px] text-[#8C7355] mt-0.5">
                Customer payments from UPI QR scan will be credited directly to this VPA with 0% platform fee.
              </p>
            </div>

            {/* Artisan Biography & Heritage Story */}
            <div className="sm:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[#3E2723] block">
                  Artisan Biography & Craft Lineage (Written Overview)
                </label>
                <button
                  type="button"
                  onClick={() => setIsVoiceOpen(true)}
                  className="text-xs font-bold text-[#8B5E34] hover:text-[#734B26] flex items-center gap-1.5 cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5" /> AI Bio Assistant
                </button>
              </div>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                placeholder="Tell buyers about your family traditions, raw materials, looms, and techniques..."
                className="w-full p-3 bg-white border border-[#E6D5C3] rounded-xl text-xs leading-relaxed text-[#3E2723]"
              />
            </div>

            {/* DEDICATED ARTISAN VOICE STORY SECTION */}
            <div className="sm:col-span-2 p-5 bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E6D5C3] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#8B5E34] text-white flex items-center justify-center shadow-xs">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#3E2723]">
                      Artisan Oral Voice Story (कारीगर मौखिक शिल्प गाथा)
                    </h3>
                    <p className="text-[11px] text-[#8C7355]">
                      Recorded in your own voice or narrated for craft buyers in your regional language.
                    </p>
                  </div>
                </div>

                {/* Voice Story Language Selector */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-[#3E2723]">Story Language:</span>
                  {[
                    { code: 'hi', label: 'हिन्दी' },
                    { code: 'gu', label: 'ગુજરાતી' },
                    { code: 'mr', label: 'मराठी' },
                    { code: 'bn', label: 'বাংলা' },
                    { code: 'ta', label: 'தமிழ்' },
                    { code: 'te', label: 'తెలుగు' },
                    { code: 'en', label: 'English' },
                  ].map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, voiceStoryLanguage: l.code }))
                      }
                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                        (formData.voiceStoryLanguage || 'hi') === l.code
                          ? 'bg-[#8B5E34] text-white'
                          : 'bg-white text-[#6D5843] border border-[#E6D5C3] hover:bg-[#F5F1EE]'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={formData.story || ''}
                onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                rows={3}
                placeholder="Enter or dictate the spoken story of your craft journey, ancestral techniques, and inspiration..."
                className="w-full p-3 bg-white border border-[#E6D5C3] rounded-xl text-xs leading-relaxed text-[#3E2723]"
              />

              <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
                <div className="flex items-center gap-2">
                  {/* Dictate Button */}
                  <button
                    type="button"
                    onClick={handleToggleRecordVoiceStory}
                    className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                      isRecordingVoiceStory
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-white border border-[#E6D5C3] text-[#3E2723] hover:bg-[#F5F1EE]'
                    }`}
                  >
                    <Mic className="w-4 h-4 text-[#8B5E34]" />
                    <span>
                      {isRecordingVoiceStory ? 'Listening... Speak Now' : 'Dictate with Voice'}
                    </span>
                  </button>

                  {/* Play Voice Story Button */}
                  <button
                    type="button"
                    onClick={handleTogglePlayVoiceStory}
                    className={`px-4 py-2 text-xs font-bold text-white rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer ${
                      isPlayingVoiceStory
                        ? 'bg-[#3E2723] ring-2 ring-[#8B5E34]'
                        : 'bg-[#8B5E34] hover:bg-[#734B26]'
                    }`}
                  >
                    {isPlayingVoiceStory ? (
                      <>
                        <Square className="w-3.5 h-3.5" />
                        <span>Stop Voice Story</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Listen to Voice Story</span>
                      </>
                    )}
                  </button>
                </div>

                {isPlayingVoiceStory && (
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-3 bg-[#8B5E34] animate-pulse rounded-full" />
                    <span className="w-1 h-5 bg-[#8B5E34] animate-pulse delay-75 rounded-full" />
                    <span className="w-1 h-2 bg-[#8B5E34] animate-pulse delay-150 rounded-full" />
                    <span className="w-1 h-4 bg-[#8B5E34] animate-pulse delay-100 rounded-full" />
                    <span className="text-[11px] font-bold text-[#8B5E34] ml-1">Playing narration</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E6D5C3] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsQrModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-[#8B5E34] bg-[#FAF9F7] hover:bg-[#F5F1EE] border border-[#E6D5C3] rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Inspect Store UPI QR Code</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs cursor-pointer"
            >
              Save Artisan Profile
            </button>
          </div>
        </div>
      )}

      {/* DEDICATED ARTISAN STORE UPI QR CODE SECTION MODAL */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3E2723]/60 backdrop-blur-xs">
          <div className="w-full max-w-md overflow-hidden bg-white border border-[#E6D5C3] rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
            {/* Header with Exit */}
            <div className="px-6 py-4 bg-[#F5F1EE] border-b border-[#E6D5C3] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#8B5E34] text-white shadow-xs">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif text-[#3E2723]">
                    Artisan Store Direct UPI QR Code
                  </h3>
                  <p className="text-xs text-[#8C7355]">
                    Linked to: {formData.name}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                aria-label="Exit QR section"
                className="text-[#8C7355] hover:text-[#3E2723] p-1.5 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QR Content */}
            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="p-3 bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl text-center">
                <span className="text-xs text-[#8C7355] block">Direct Beneficiary Account</span>
                <span className="text-sm font-bold font-mono text-[#8B5E34]">
                  {formData.upiId || 'No UPI ID Set'}
                </span>
              </div>

              {/* QR Error Banner */}
              {qrStatus === 'error' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>{qrError || 'QR code refresh was interrupted.'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateOrRefreshQr}
                    className="px-3 py-1 bg-[#8B5E34] text-white font-bold rounded-lg hover:bg-[#734B26] transition-colors cursor-pointer"
                  >
                    🔄 Retry QR Generation
                  </button>
                </div>
              )}

              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center p-5 bg-white border-2 border-dashed border-[#A68B6D]/50 rounded-2xl shadow-xs">
                {qrStatus === 'generating' ? (
                  <div className="w-44 h-44 flex flex-col items-center justify-center space-y-3 bg-[#FAF9F7] rounded-xl border border-[#E6D5C3]">
                    <RefreshCw className="w-8 h-8 text-[#8B5E34] animate-spin" />
                    <span className="text-xs font-semibold text-[#8C7355]">Generating QR...</span>
                  </div>
                ) : (
                  <div key={qrKey} className="relative p-3 bg-white border border-[#E6D5C3] rounded-xl shadow-xs">
                    <svg viewBox="0 0 160 160" className="w-44 h-44" fill="none">
                      <rect width="160" height="160" fill="white" />
                      <rect x="10" y="10" width="38" height="38" fill="#3E2723" rx="6" />
                      <rect x="16" y="16" width="26" height="26" fill="white" rx="3" />
                      <rect x="22" y="22" width="14" height="14" fill="#8B5E34" rx="2" />

                      <rect x="112" y="10" width="38" height="38" fill="#3E2723" rx="6" />
                      <rect x="118" y="16" width="26" height="26" fill="white" rx="3" />
                      <rect x="124" y="22" width="14" height="14" fill="#8B5E34" rx="2" />

                      <rect x="10" y="112" width="38" height="38" fill="#3E2723" rx="6" />
                      <rect x="16" y="118" width="26" height="26" fill="white" rx="3" />
                      <rect x="22" y="124" width="14" height="14" fill="#8B5E34" rx="2" />

                      <path
                        d="M56 12h6v6h-6zM68 12h12v6H68zM86 12h6v6h-6zM98 12h6v6h-6zM56 24h12v6H56zM74 24h6v6h-6zM86 24h18v6H86zM56 36h6v12h-6zM68 36h12v6H68zM86 42h6v6h-6zM98 36h6v12h-6zM12 56h18v6H12zM36 56h6v6h-6zM48 56h6v6h-6zM60 56h12v6H60zM78 56h6v12h-6zM90 56h18v6H90zM114 56h6v6h-6zM126 56h18v6h-18zM12 68h6v6h-6zM24 68h18v6H24zM48 68h6v12h-6zM60 68h6v6h-6zM72 68h18v6H72zM96 68h6v6h-6zM108 68h12v6h-12zM126 68h6v18h-6zM138 68h12v6h-12zM12 80h12v6H12zM30 80h6v6h-6zM60 80h12v6H60zM84 80h18v6H84zM108 80h6v6h-6zM120 80h6v6h-6zM138 80h12v6h-12zM12 92h6v6h-6zM24 92h18v6H24zM48 92h6v6h-6zM60 92h6v12h-6zM72 92h18v6H72zM96 92h12v6H96zM114 92h6v6h-6zM126 92h18v6h-18zM56 104h12v6H56zM74 104h6v6h-6zM86 104h12v6H86zM104 104h6v6h-6zM114 104h18v6h-18zM138 104h12v6h-12zM56 116h6v6h-6zM68 116h18v6H68zM92 116h6v18h-6zM104 116h12v6h-12zM122 116h6v6h-6zM134 116h12v6h-12zM56 128h18v6H56zM80 128h6v6h-6zM104 128h6v6h-6zM116 128h18v6h-18zM56 140h6v6h-6zM68 140h12v6H68zM86 140h6v6h-6zM98 140h12v6H98zM116 140h6v6h-6zM128 140h18v6h-18z"
                        fill="#3E2723"
                      />
                      <circle cx="80" cy="80" r="16" fill="white" stroke="#8B5E34" strokeWidth="2" />
                      <text x="80" y="84" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#3E2723">
                        UPI
                      </text>
                    </svg>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs font-mono font-bold text-[#3E2723] bg-[#FAF9F7] px-2.5 py-1 rounded-lg border border-[#E6D5C3]">
                    {formData.upiId}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="p-1.5 text-[#8C7355] hover:text-[#8B5E34] bg-[#FAF9F7] hover:bg-[#F5F1EE] border border-[#E6D5C3] rounded-lg transition-colors cursor-pointer"
                    title="Copy UPI ID"
                  >
                    {qrCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between w-full mt-2 pt-2 border-t border-[#E6D5C3]/60 text-[11px] text-[#8C7355]">
                  <span>Direct Artisan Settlement</span>
                  <button
                    type="button"
                    disabled={qrStatus === 'generating'}
                    onClick={handleGenerateOrRefreshQr}
                    className="font-bold text-[#8B5E34] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${qrStatus === 'generating' ? 'animate-spin' : ''}`} />
                    <span>Regenerate QR</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Controls: Previous, Exit, Next */}
            <div className="px-6 py-4 bg-[#FAF9F7] border-t border-[#E6D5C3] flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                {/* QR section -> Previous */}
                <button
                  type="button"
                  onClick={() => setIsQrModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-[#6D5843] hover:text-[#3E2723] hover:bg-white rounded-xl border border-transparent hover:border-[#E6D5C3] transition-all flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {/* QR section -> Exit */}
                <button
                  type="button"
                  onClick={() => setIsQrModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-[#8C7355] hover:text-[#3E2723] transition-colors cursor-pointer"
                >
                  Exit
                </button>
              </div>

              {/* QR section -> Next / Continue */}
              <button
                type="button"
                onClick={() => {
                  setIsQrModalOpen(false);
                  handleSave();
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Save & Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voice Recorder Modal */}
      <VoiceRecorderModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        initialText={formData.bio}
        onTranscriptComplete={(text) => {
          setFormData({ ...formData, bio: text });
          setIsVoiceOpen(false);
        }}
      />
    </div>
  );
};
