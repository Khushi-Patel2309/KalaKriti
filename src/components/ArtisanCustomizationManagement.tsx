import React, { useState } from 'react';
import { CustomizationRequest, ArtisanProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Palette,
  Scissors,
  Ruler,
  Phone,
  Mail,
  User,
  IndianRupee,
  Calendar,
  Filter,
} from 'lucide-react';

interface ArtisanCustomizationManagementProps {
  customizations: CustomizationRequest[];
  profile: ArtisanProfile;
  onUpdateStatus: (
    id: string,
    status: 'Accepted' | 'Declined',
    details?: { artisanResponse?: string; estimatedDays?: number; estimatedPrice?: number }
  ) => void;
}

export const ArtisanCustomizationManagement: React.FC<ArtisanCustomizationManagementProps> = ({
  customizations,
  profile,
  onUpdateStatus,
}) => {
  const { language, t } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'Pending' | 'Accepted' | 'Declined'>('all');
  const [selectedReq, setSelectedReq] = useState<CustomizationRequest | null>(null);
  const [actionType, setActionType] = useState<'accept' | 'decline' | null>(null);

  // Modal response form state
  const [estDays, setEstDays] = useState<number>(7);
  const [estPrice, setEstPrice] = useState<number>(0);
  const [responseText, setResponseText] = useState('');

  const myRequests = customizations.filter(
    (c) => c.artisanId === profile.id || c.artisanName === profile.name
  );

  const filteredRequests =
    filter === 'all' ? myRequests : myRequests.filter((r) => r.status === filter);

  const pendingCount = myRequests.filter((r) => r.status === 'Pending').length;

  const handleOpenAction = (req: CustomizationRequest, type: 'accept' | 'decline') => {
    setSelectedReq(req);
    setActionType(type);
    setEstPrice(req.productPrice);
    setEstDays(7);
    setResponseText(
      type === 'accept'
        ? language === 'hi'
          ? 'नमस्ते! हमें आपके लिए यह पारंपरिक शिल्प तैयार करने में अत्यधिक प्रसन्नता होगी। हम प्रामाणिक सामग्री और हस्तकला का उपयोग करेंगे।'
          : 'Hello! We would be honored to craft this custom piece for you using traditional artisan techniques and sustainable natural materials.'
        : language === 'hi'
        ? 'दुर्भाग्यवश वर्तमान में इस विशेष माप या रंग की कच्ची सामग्री उपलब्ध नहीं है।'
        : 'Unfortunately, the specific natural dye or loom dimensions are currently unavailable for this customization.'
    );
  };

  const handleConfirmAction = () => {
    if (!selectedReq || !actionType) return;

    if (actionType === 'accept') {
      onUpdateStatus(selectedReq.id, 'Accepted', {
        artisanResponse: responseText.trim(),
        estimatedDays: estDays || 7,
        estimatedPrice: estPrice || selectedReq.productPrice,
      });
    } else {
      onUpdateStatus(selectedReq.id, 'Declined', {
        artisanResponse: responseText.trim(),
      });
    }

    setSelectedReq(null);
    setActionType(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-[#3E2723] text-white rounded-3xl shadow-md border border-[#8B5E34]/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#E6D5C3]" />
            <span className="text-xs uppercase tracking-wider font-bold text-[#E6D5C3]">
              {language === 'hi' ? 'सीधे ग्राहक कस्टमाइज़ेशन अनुरोध' : 'Direct Customer Customization Requests'}
            </span>
          </div>
          {pendingCount > 0 && (
            <span className="text-xs font-bold bg-[#8B5E34] text-white px-3 py-1 rounded-full shadow-2xs">
              {pendingCount} {language === 'hi' ? 'समीक्षा हेतु लंबित' : 'Pending Review'}
            </span>
          )}
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
          {t.customizationRequestsTab}
        </h2>
        <p className="text-xs text-[#E6D5C3] max-w-2xl leading-relaxed">
          {language === 'hi'
            ? 'ग्राहक आपके मूल उत्पादों के लिए विशेष रंग, पारंपरिक रूपांकन या कस्टम आकार का अनुरोध कर सकते हैं। आप यहाँ अनुरोध स्वीकार या अस्वीकार कर सकते हैं।'
            : 'Customers can request custom colors, natural dye palettes, bespoke dimensions, or heirloom motifs for your crafts. Review, accept with crafting estimates, or decline respectfully.'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6D5C3] pb-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#8C7355]" />
          {(['all', 'Pending', 'Accepted', 'Declined'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filter === st
                  ? 'bg-[#8B5E34] text-white shadow-2xs'
                  : 'bg-white text-[#6D5843] border border-[#E6D5C3] hover:bg-[#FAF9F7]'
              }`}
            >
              {st === 'all'
                ? language === 'hi'
                  ? `सभी (${myRequests.length})`
                  : `All (${myRequests.length})`
                : st === 'Pending'
                ? language === 'hi'
                  ? `लंबित (${myRequests.filter((r) => r.status === 'Pending').length})`
                  : `Pending (${myRequests.filter((r) => r.status === 'Pending').length})`
                : st === 'Accepted'
                ? language === 'hi'
                  ? `स्वीकृत (${myRequests.filter((r) => r.status === 'Accepted').length})`
                  : `Accepted (${myRequests.filter((r) => r.status === 'Accepted').length})`
                : language === 'hi'
                ? `अस्वीकृत (${myRequests.filter((r) => r.status === 'Declined').length})`
                : `Declined (${myRequests.filter((r) => r.status === 'Declined').length})`}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-[#8C7355]">
          {language === 'hi' ? 'मूल उत्पाद अप्रभावित रहता है' : 'Original product remains completely unchanged'}
        </span>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="p-12 text-center bg-white border border-[#E6D5C3] rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF9F7] text-[#8B5E34] flex items-center justify-center mx-auto border border-[#E6D5C3]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-[#3E2723]">{t.noCustomizationRequests}</h4>
          <p className="text-xs text-[#8C7355] max-w-sm mx-auto">
            {language === 'hi'
              ? 'जब ग्राहक आपके हस्तशिल्प के लिए विशेष कस्टमाइज़ेशन का अनुरोध करेंगे, वे यहाँ दिखाई देंगे।'
              : 'When customers request customized variations of your handcrafted products, they will appear right here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="p-5 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-4 hover:border-[#8B5E34]/50 transition-colors"
            >
              {/* Card Top Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6D5C3] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#FAF9F7] border border-[#E6D5C3] flex items-center justify-center text-2xl overflow-hidden shrink-0">
                    {req.productImage ? (
                      <img src={req.productImage} alt={req.productName} className="w-full h-full object-cover" />
                    ) : (
                      <span>{req.productEmoji || '🧵'}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#3E2723]">{req.productName}</h4>
                    <p className="text-[11px] text-[#8C7355]">
                      {language === 'hi' ? 'मूल मूल्य:' : 'Original Price:'}{' '}
                      <span className="font-bold text-[#8B5E34]">₹{req.productPrice.toLocaleString('en-IN')}</span> ·{' '}
                      <span className="font-mono text-[10px]">{new Date(req.createdAt).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>

                {/* Status Pill */}
                <div>
                  {req.status === 'Pending' && (
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-300 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                      <Clock className="w-3.5 h-3.5 text-amber-700" /> {t.customizationStatusPending}
                    </span>
                  )}
                  {req.status === 'Accepted' && (
                    <span className="text-xs font-bold text-green-800 bg-green-50 border border-green-300 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-700" /> {t.customizationStatusAccepted}
                    </span>
                  )}
                  {req.status === 'Declined' && (
                    <span className="text-xs font-bold text-red-800 bg-red-50 border border-red-300 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                      <XCircle className="w-3.5 h-3.5 text-red-700" /> {t.customizationStatusDeclined}
                    </span>
                  )}
                </div>
              </div>

              {/* Customization Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-[#FAF9F7] rounded-xl border border-[#E6D5C3] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#8C7355] flex items-center gap-1">
                    <Palette className="w-3 h-3 text-[#8B5E34]" /> {t.customColorLabel}
                  </span>
                  <p className="font-bold text-[#3E2723]">{req.color}</p>
                </div>

                <div className="p-3 bg-[#FAF9F7] rounded-xl border border-[#E6D5C3] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#8C7355] flex items-center gap-1">
                    <Scissors className="w-3 h-3 text-[#8B5E34]" /> {t.customPatternLabel}
                  </span>
                  <p className="font-bold text-[#3E2723]">{req.pattern}</p>
                </div>

                <div className="p-3 bg-[#FAF9F7] rounded-xl border border-[#E6D5C3] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#8C7355] flex items-center gap-1">
                    <Ruler className="w-3 h-3 text-[#8B5E34]" /> {t.customSizeLabel}
                  </span>
                  <p className="font-bold text-[#3E2723]">{req.size}</p>
                </div>
              </div>

              {/* Special Message & Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#FAF9F7] rounded-xl border border-[#E6D5C3] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#8C7355] flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-[#8B5E34]" /> {t.customMessageLabel}
                  </span>
                  <p className="text-[#3E2723] italic leading-relaxed">
                    {req.message ? `"${req.message}"` : language === 'hi' ? 'कोई अतिरिक्त टिप्पणी नहीं' : 'No additional message provided.'}
                  </p>
                </div>

                <div className="p-3 bg-[#FAF9F7] rounded-xl border border-[#E6D5C3] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#8C7355] flex items-center gap-1">
                    <User className="w-3 h-3 text-[#8B5E34]" /> {language === 'hi' ? 'ग्राहक विवरण' : 'Customer Info'}
                  </span>
                  <div className="text-[#3E2723] space-y-0.5">
                    <p className="font-bold">{req.customerName}</p>
                    <p className="flex items-center gap-1 text-[11px] text-[#8C7355]">
                      <Phone className="w-3 h-3 text-[#8B5E34]" /> {req.customerPhone}
                    </p>
                    {req.customerEmail && (
                      <p className="flex items-center gap-1 text-[11px] text-[#8C7355]">
                        <Mail className="w-3 h-3 text-[#8B5E34]" /> {req.customerEmail}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Completed / Handled Status Note */}
              {req.status !== 'Pending' && req.artisanResponse && (
                <div className={`p-3.5 rounded-xl text-xs border ${
                  req.status === 'Accepted' ? 'bg-green-50/70 border-green-200 text-green-900' : 'bg-red-50/70 border-red-200 text-red-900'
                }`}>
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span>{language === 'hi' ? 'आपकी प्रतिक्रिया:' : 'Your Response to Customer:'}</span>
                    {req.status === 'Accepted' && req.estimatedDays && (
                      <span className="flex items-center gap-2">
                        <span className="flex items-center gap-0.5"><Calendar className="w-3.5 h-3.5" /> {req.estimatedDays} {language === 'hi' ? 'दिन' : 'days'}</span>
                        {req.estimatedPrice && <span>· ₹{req.estimatedPrice.toLocaleString('en-IN')}</span>}
                      </span>
                    )}
                  </div>
                  <p className="italic">"{req.artisanResponse}"</p>
                </div>
              )}

              {/* Action Buttons if Pending */}
              {req.status === 'Pending' && (
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E6D5C3]">
                  <button
                    type="button"
                    onClick={() => handleOpenAction(req, 'decline')}
                    className="px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-50 border border-red-200 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" /> {t.declineCustomizationBtn}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenAction(req, 'accept')}
                    className="px-5 py-2 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> {t.acceptCustomizationBtn}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Accept / Decline Modal Dialog */}
      {selectedReq && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3E2723]/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-[#E6D5C3] rounded-3xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E6D5C3] pb-3">
              <h3 className="text-base font-bold font-serif text-[#3E2723] flex items-center gap-2">
                {actionType === 'accept' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span>{t.acceptCustomizationBtn}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span>{t.declineCustomizationBtn}</span>
                  </>
                )}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedReq(null);
                  setActionType(null);
                }}
                className="text-[#8C7355] hover:text-[#3E2723] text-sm"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-[#6D5843] space-y-1">
              <p>
                <strong className="text-[#3E2723]">{language === 'hi' ? 'उत्पाद:' : 'Craft:'}</strong> {selectedReq.productName}
              </p>
              <p>
                <strong className="text-[#3E2723]">{language === 'hi' ? 'ग्राहक:' : 'Customer:'}</strong> {selectedReq.customerName} ({selectedReq.customerPhone})
              </p>
            </div>

            {actionType === 'accept' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3E2723]">{t.artisanEstimateDaysLabel}</label>
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={estDays}
                    onChange={(e) => setEstDays(parseInt(e.target.value) || 7)}
                    className="w-full p-2 bg-white border border-[#E6D5C3] rounded-xl text-xs font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3E2723]">{t.artisanEstimatePriceLabel}</label>
                  <input
                    type="number"
                    min={selectedReq.productPrice}
                    value={estPrice}
                    onChange={(e) => setEstPrice(parseInt(e.target.value) || selectedReq.productPrice)}
                    className="w-full p-2 bg-white border border-[#E6D5C3] rounded-xl text-xs font-mono font-bold text-[#8B5E34]"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#3E2723]">
                {actionType === 'accept' ? (language === 'hi' ? 'ग्राहक को संदेश' : 'Message to Customer') : (language === 'hi' ? 'अस्वीकृति का कारण' : 'Decline Reason')}
              </label>
              <textarea
                rows={3}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder={actionType === 'accept' ? t.artisanNotePlaceholder : t.declineReasonPlaceholder}
                className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-xs text-[#3E2723] leading-relaxed resize-y"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E6D5C3]">
              <button
                type="button"
                onClick={() => {
                  setSelectedReq(null);
                  setActionType(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-[#8C7355] hover:text-[#3E2723]"
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-colors ${
                  actionType === 'accept' ? 'bg-[#8B5E34] hover:bg-[#734B26]' : 'bg-red-700 hover:bg-red-800'
                }`}
              >
                {actionType === 'accept' ? t.acceptCustomizationBtn : t.declineCustomizationBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
