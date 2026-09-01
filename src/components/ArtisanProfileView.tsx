import React, { useState } from 'react';
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
  const [profileTab, setProfileTab] = useState<'report' | 'details'>(initialTab);
  const [formData, setFormData] = useState<ArtisanProfile>(profile);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

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
    onUpdateProfile({
      ...formData,
      experienceYears: Math.max(0, formData.experienceYears),
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Profile Summary */}
      <div className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-[#8B5E34] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md">
            {formData.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-serif text-[#3E2723]">{formData.name}</h2>
              <span className="text-[10px] font-bold text-[#8B5E34] bg-[#F5F1EE] px-2.5 py-0.5 rounded-full border border-[#E6D5C3]">
                ✓ {language === 'hi' ? 'सत्यापित मास्टर शिल्पकार' : 'Verified Master Artisan'}
              </span>
            </div>
            <p className="text-xs text-[#8C7355] flex items-center gap-1.5 mt-0.5">
              <Award className="w-3.5 h-3.5 text-[#8B5E34]" /> {formData.craft} ·{' '}
              <strong>
                {formData.experienceYears} {language === 'hi' ? 'वर्ष का अनुभव' : 'Years Experience'}
              </strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub-tab switcher */}
          <div className="flex items-center p-1 bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setProfileTab('report')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
                profileTab === 'report'
                  ? 'bg-[#8B5E34] text-white shadow-2xs'
                  : 'text-[#6D5843] hover:text-[#3E2723]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              {language === 'hi' ? 'वार्षिक रिपोर्ट एवं प्रगति' : 'Annual Report & Progress'}
            </button>
            <button
              type="button"
              onClick={() => setProfileTab('details')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
                profileTab === 'details'
                  ? 'bg-[#8B5E34] text-white shadow-2xs'
                  : 'text-[#6D5843] hover:text-[#3E2723]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              {language === 'hi' ? 'प्रोफ़ाइल विवरण संपादित करें' : 'Edit Profile Credentials'}
            </button>
          </div>

          {profileTab === 'details' && (
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs transition-colors"
            >
              {language === 'hi' ? 'सहेजें' : 'Save Changes'}
            </button>
          )}
        </div>
      </div>

      {isSaved && (
        <div className="p-3.5 bg-green-50 text-green-800 border border-green-200 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-green-600" />
          {language === 'hi'
            ? 'शिल्पकार प्रोफ़ाइल सफलतापूर्वक सहेजी गई!'
            : 'Artisan profile saved successfully with verified credentials!'}
        </div>
      )}

      {/* Sub-tab 1: Annual Report & Progress */}
      {profileTab === 'report' && (
        <ArtisanAnnualReport profile={profile} products={products} orders={orders} />
      )}

      {/* Sub-tab 2: Profile Form Details */}
      {profileTab === 'details' && (
        <div className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-6">
          <h3 className="text-base font-bold font-serif text-[#3E2723] flex items-center gap-2 pb-3 border-b border-[#E6D5C3]">
            <User className="w-4 h-4 text-[#8B5E34]" /> Personal & Craft Credentials
          </h3>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="font-bold text-[#3E2723] block mb-1">Artisan Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
              />
            </div>

            <div>
              <label className="font-bold text-[#3E2723] block mb-1">Craft Specialization *</label>
              <input
                type="text"
                value={formData.craft}
                onChange={(e) => setFormData({ ...formData, craft: e.target.value })}
                placeholder="e.g. Kutchi Handloom Weaving & Natural Dyeing"
                className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
              />
            </div>

            {/* STRICTLY NON-NEGATIVE EXPERIENCE FIELD */}
            <div>
              <label className="font-bold text-[#3E2723] block mb-1">
                Craft Experience (in Years) *{' '}
                <span className="text-xs text-[#8C7355] font-normal">(Cannot be negative)</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.experienceYears}
                onChange={(e) => handleExperienceChange(e.target.value)}
                onKeyDown={(e) => {
                  // Prevent typing negative minus sign
                  if (e.key === '-' || e.key === 'e' || e.key === '+') {
                    e.preventDefault();
                  }
                }}
                className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl font-bold font-mono focus:ring-2 focus:ring-[#8B5E34] text-[#3E2723]"
              />
              <p className="text-[10px] text-[#8C7355] mt-0.5">
                Enter 0 or greater. Helps buyers understand your master craft lineage.
              </p>
            </div>

            <div>
              <label className="font-bold text-[#3E2723] block mb-1">Artisan Village / City & State *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Bhujodi, Kutch, Gujarat"
                className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
              />
            </div>

            <div>
              <label className="font-bold text-[#3E2723] block mb-1">Contact Phone Number</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
              />
            </div>

            <div>
              <label className="font-bold text-[#3E2723] block mb-1">
                UPI ID for Direct Customer QR Payments *
              </label>
              <input
                type="text"
                value={formData.upiId}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                placeholder="e.g. devji.vankar@okhdfcbank"
                className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl font-mono text-[#8B5E34] font-bold"
              />
              <p className="text-[10px] text-[#8C7355] mt-0.5">
                Customer payments from UPI QR scan will be credited directly to this VPA.
              </p>
            </div>

            {/* Artisan Biography & Heritage Story with Voice Recorder */}
            <div className="sm:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[#3E2723] block">
                  Artisan Story & Craft Lineage (English & Hindi)
                </label>
                <button
                  type="button"
                  onClick={() => setIsVoiceOpen(true)}
                  className="text-xs font-bold text-[#8B5E34] hover:underline flex items-center gap-1"
                >
                  <Mic className="w-3.5 h-3.5" /> 🎙️ Record Story via Voice
                </button>
              </div>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                placeholder="Tell buyers about your family traditions, raw materials, looms, and techniques..."
                className="w-full p-3 bg-white border border-[#E6D5C3] rounded-xl text-xs leading-relaxed text-[#3E2723]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E6D5C3] flex items-center justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs"
            >
              Save Artisan Profile
            </button>
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
