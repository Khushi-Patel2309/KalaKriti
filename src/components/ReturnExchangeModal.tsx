import React, { useState } from 'react';
import { Order } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  RotateCcw,
  RefreshCw,
  Truck,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Package,
} from 'lucide-react';

interface ReturnExchangeModalProps {
  order: Order | null;
  isOpen: boolean;
  initialMode?: 'return' | 'exchange';
  onClose: () => void;
  onSubmitReturn: (
    orderId: string,
    reason: string,
    refundMethod: string,
    comments?: string
  ) => void;
  onSubmitExchange: (
    orderId: string,
    reason: string,
    exchangeDetails: string,
    comments?: string
  ) => void;
}

export const ReturnExchangeModal: React.FC<ReturnExchangeModalProps> = ({
  order,
  isOpen,
  initialMode = 'return',
  onClose,
  onSubmitReturn,
  onSubmitExchange,
}) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'return' | 'exchange'>(initialMode);

  // Return Reasons
  const RETURN_REASONS = [
    {
      en: 'Item damaged or chipped during courier transit',
      hi: 'कूरियर परिवहन के दौरान उत्पाद क्षतिग्रस्त या टूट गया',
    },
    {
      en: 'Craft color shade or pattern differs significantly from photos',
      hi: 'शिल्प का रंग या पैटर्न फ़ोटो से काफी भिन्न है',
    },
    {
      en: 'Finishing, weaving or structural quality imperfection',
      hi: 'बुनाई, नक्काशी या फ़िनिशिंग में गुणवत्ता संबंधी कमी',
    },
    {
      en: 'Incorrect item or variant delivered',
      hi: 'गलत उत्पाद या आकार प्राप्त हुआ',
    },
    {
      en: 'Craft dimensions do not fit my living space / wardrobe',
      hi: 'हस्तशिल्प का आकार मेरी जगह या अलमारी में फिट नहीं बैठता',
    },
    {
      en: 'Other return reason',
      hi: 'अन्य कोई वापसी कारण',
    },
  ];

  // Exchange Reasons
  const EXCHANGE_REASONS = [
    {
      en: 'Need different size / dimension for this handmade piece',
      hi: 'इस हस्तनिर्मित उत्पाद के लिए दूसरा आकार (साइज़) चाहिए',
    },
    {
      en: 'Exchange for different color shade or artisan pattern',
      hi: 'दूसरे रंग या डिज़ाइन पैटर्न के साथ बदलना चाहते हैं',
    },
    {
      en: 'Minor natural variation - request fresh replacement piece',
      hi: 'हल्का बदलाव - उसी शिल्प का नया प्रतिस्थापन चाहिए',
    },
    {
      en: 'Exchange with another craft from same master artisan',
      hi: 'उसी मास्टर कारीगर के अन्य शिल्प के साथ बदलना',
    },
    {
      en: 'Other exchange reason',
      hi: 'अन्य कोई एक्सचेंज कारण',
    },
  ];

  const [selectedReturnReason, setSelectedReturnReason] = useState(
    language === 'hi' ? RETURN_REASONS[0].hi : RETURN_REASONS[0].en
  );
  const [selectedExchangeReason, setSelectedExchangeReason] = useState(
    language === 'hi' ? EXCHANGE_REASONS[0].hi : EXCHANGE_REASONS[0].en
  );
  const [refundMethod, setRefundMethod] = useState<'UPI' | 'BANK' | 'STORE_CREDIT'>('UPI');
  const [exchangeDetailsText, setExchangeDetailsText] = useState('');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      if (activeTab === 'return') {
        const methodStr =
          refundMethod === 'UPI'
            ? 'Original UPI Account (Direct Instant)'
            : refundMethod === 'BANK'
            ? 'Direct Bank Transfer (NEFT/IMPS)'
            : 'KalaKriti Artisan Store Credits';
        onSubmitReturn(order.id, selectedReturnReason, methodStr, comments);
      } else {
        onSubmitExchange(
          order.id,
          selectedExchangeReason,
          exchangeDetailsText ||
            (language === 'hi'
              ? 'समान उत्पाद का नया पीस प्रतिस्थापन'
              : 'Direct replacement of same craft piece'),
          comments
        );
      }
      setIsSubmitting(false);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3E2723]/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white border border-[#E6D5C3] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-[#FAF9F7] border-b border-[#E6D5C3] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F5F1EE] border border-[#E6D5C3] text-[#8B5E34] flex items-center justify-center">
              {activeTab === 'return' ? (
                <RotateCcw className="w-5 h-5" />
              ) : (
                <RefreshCw className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-[#3E2723]">
                {activeTab === 'return' ? t.returnProductTitle : t.exchangeProductTitle}
              </h3>
              <p className="text-xs text-[#8C7355]">
                {t.orderId}: #{order.trackingId} · {order.items.length}{' '}
                {language === 'hi' ? 'उत्पाद' : 'items'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#8C7355] hover:text-[#3E2723] hover:bg-[#F5F1EE] rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Return vs Exchange */}
        <div className="p-4 bg-white border-b border-[#E6D5C3]">
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('return')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'return'
                  ? 'bg-[#8B5E34] text-white shadow-xs'
                  : 'text-[#6D5843] hover:text-[#3E2723]'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {language === 'hi' ? 'वापसी और 100% रिफंड (Return)' : 'Return & Refund'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('exchange')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'exchange'
                  ? 'bg-[#8B5E34] text-white shadow-xs'
                  : 'text-[#6D5843] hover:text-[#3E2723]'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {language === 'hi' ? 'एक्सचेंज / नया उत्पाद (Exchange)' : 'Exchange Craft'}
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Ordered Products Preview */}
          <div className="p-3 bg-[#FAF9F7] rounded-2xl border border-[#E6D5C3] space-y-2">
            <span className="text-[11px] font-bold uppercase text-[#8C7355] block">
              {language === 'hi' ? 'ऑर्डर किए गए शिल्प उत्पाद:' : 'Ordered Craft Items:'}
            </span>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#E6D5C3] flex items-center justify-center shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span>{item.emoji}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#3E2723] truncate">{item.name}</p>
                    <p className="text-[10px] text-[#8C7355]">
                      {language === 'hi' ? 'कारीगर' : 'By'} {item.artisanName} · ₹
                      {item.price.toLocaleString('en-IN')} × {item.qty}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reason Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#3E2723] block">
              {activeTab === 'return' ? t.returnReasonLabel : t.exchangeReasonLabel} *
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {(activeTab === 'return' ? RETURN_REASONS : EXCHANGE_REASONS).map(
                (reasonObj, idx) => {
                  const text = language === 'hi' ? reasonObj.hi : reasonObj.en;
                  const isSelected =
                    activeTab === 'return'
                      ? selectedReturnReason === text
                      : selectedExchangeReason === text;

                  return (
                    <label
                      key={idx}
                      onClick={() => {
                        if (activeTab === 'return') setSelectedReturnReason(text);
                        else setSelectedExchangeReason(text);
                      }}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#8B5E34] bg-[#FAF9F7] font-semibold text-[#3E2723]'
                          : 'border-[#E6D5C3] bg-white text-[#6D5843] hover:bg-[#FAF9F7]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reason_group"
                        checked={isSelected}
                        onChange={() => {
                          if (activeTab === 'return') setSelectedReturnReason(text);
                          else setSelectedExchangeReason(text);
                        }}
                        className="mt-0.5 accent-[#8B5E34]"
                      />
                      <span>{text}</span>
                    </label>
                  );
                }
              )}
            </div>
          </div>

          {/* Tab Specific Options */}
          {activeTab === 'return' ? (
            /* Return: Refund Destination */
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#3E2723] block">
                {t.returnRefundOptionLabel} *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <label
                  onClick={() => setRefundMethod('UPI')}
                  className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between ${
                    refundMethod === 'UPI'
                      ? 'border-[#8B5E34] bg-[#FAF9F7] font-semibold text-[#3E2723]'
                      : 'border-[#E6D5C3] bg-white text-[#6D5843]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold">Original UPI</span>
                    <input
                      type="radio"
                      name="refund_opt"
                      checked={refundMethod === 'UPI'}
                      onChange={() => setRefundMethod('UPI')}
                      className="accent-[#8B5E34]"
                    />
                  </div>
                  <span className="text-[10px] text-[#8C7355]">
                    {language === 'hi' ? 'तत्काल बैंक ट्रांसफर' : 'Direct & Instant'}
                  </span>
                </label>

                <label
                  onClick={() => setRefundMethod('BANK')}
                  className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between ${
                    refundMethod === 'BANK'
                      ? 'border-[#8B5E34] bg-[#FAF9F7] font-semibold text-[#3E2723]'
                      : 'border-[#E6D5C3] bg-white text-[#6D5843]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold">Bank Account</span>
                    <input
                      type="radio"
                      name="refund_opt"
                      checked={refundMethod === 'BANK'}
                      onChange={() => setRefundMethod('BANK')}
                      className="accent-[#8B5E34]"
                    />
                  </div>
                  <span className="text-[10px] text-[#8C7355]">
                    {language === 'hi' ? 'NEFT / IMPS' : 'NEFT / IMPS'}
                  </span>
                </label>

                <label
                  onClick={() => setRefundMethod('STORE_CREDIT')}
                  className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between ${
                    refundMethod === 'STORE_CREDIT'
                      ? 'border-[#8B5E34] bg-[#FAF9F7] font-semibold text-[#3E2723]'
                      : 'border-[#E6D5C3] bg-white text-[#6D5843]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold">KalaKriti Credit</span>
                    <input
                      type="radio"
                      name="refund_opt"
                      checked={refundMethod === 'STORE_CREDIT'}
                      onChange={() => setRefundMethod('STORE_CREDIT')}
                      className="accent-[#8B5E34]"
                    />
                  </div>
                  <span className="text-[10px] text-[#8C7355]">
                    {language === 'hi' ? '+5% बोनस' : '+5% Bonus Craft Credit'}
                  </span>
                </label>
              </div>
            </div>
          ) : (
            /* Exchange: Replacement Requirements */
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#3E2723] block">
                {t.exchangeReplacementReqLabel} *
              </label>
              <textarea
                value={exchangeDetailsText}
                onChange={(e) => setExchangeDetailsText(e.target.value)}
                placeholder={t.exchangeReplacementReqPlaceholder}
                rows={2}
                className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-xs text-[#3E2723] focus:ring-1 focus:ring-[#8B5E34]"
              />
            </div>
          )}

          {/* Reverse Pickup Address Confirmation */}
          <div className="p-3.5 bg-[#FAF9F7] rounded-2xl border border-[#E6D5C3] space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#3E2723] flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#8B5E34]" /> {t.returnPickupAddress}
              </span>
              <span className="text-[10px] text-[#8B5E34] font-semibold">
                {language === 'hi' ? 'ब्लू डार्ट कूरियर पिकअप' : 'BlueDart Express Reverse Pickup'}
              </span>
            </div>
            <p className="text-[#6D5843] pt-1">
              <strong>{order.shippingDetails.fullName}</strong> ({order.shippingDetails.phone})
            </p>
            <p className="text-[#8C7355] text-[11px]">
              {order.shippingDetails.addressLine1}, {order.shippingDetails.city},{' '}
              {order.shippingDetails.state} - {order.shippingDetails.pincode}
            </p>
          </div>

          {/* Additional Notes */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#3E2723] block">
              {language === 'hi' ? 'अतिरिक्त टिप्पणी (वैकल्पिक)' : 'Additional Comments (Optional)'}
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'कारीगर या कूरियर टीम के लिए कोई विशेष निर्देश...'
                  : 'Any special instructions for courier pickup or artisan collective...'
              }
              rows={2}
              className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-xs text-[#3E2723]"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E6D5C3]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-[#8C7355] hover:bg-[#FAF9F7] rounded-xl"
            >
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  {language === 'hi' ? 'सबमिट किया जा रहा है...' : 'Processing...'}
                </>
              ) : activeTab === 'return' ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  {t.returnSubmitBtn}
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  {t.exchangeSubmitBtn}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
