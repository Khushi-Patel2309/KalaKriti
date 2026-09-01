import React, { useState } from 'react';
import { Order } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  AlertTriangle,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface CancelOrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: (orderId: string, reason: string, comments?: string) => void;
}

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  order,
  isOpen,
  onClose,
  onConfirmCancel,
}) => {
  const { language, t } = useLanguage();

  const CANCELLATION_REASONS = [
    {
      en: 'Ordered by mistake / placed duplicate order',
      hi: 'गलती से ऑर्डर हो गया / दोहरा ऑर्डर दर्ज हो गया',
    },
    {
      en: 'Found another handcrafted product on KalaKriti',
      hi: 'कलाकृति पर दूसरा हस्तशिल्प उत्पाद पसंद आ गया',
    },
    {
      en: 'Need to change delivery address or recipient contact details',
      hi: 'डिलीवरी का पता या संपर्क विवरण बदलना है',
    },
    {
      en: 'Estimated delivery duration is taking too long',
      hi: 'अनुमानित डिलीवरी का समय बहुत अधिक है',
    },
    {
      en: 'Change of mind / budget adjustment',
      hi: 'विचार बदल गया / बजट संबंधी कारण',
    },
    {
      en: 'Other reasons',
      hi: 'अन्य कोई कारण',
    },
  ];

  const [selectedReason, setSelectedReason] = useState(
    language === 'hi' ? CANCELLATION_REASONS[0].hi : CANCELLATION_REASONS[0].en
  );
  const [customComment, setCustomComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !order) return null;

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmCancel(order.id, selectedReason, customComment);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3E2723]/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white border border-[#E6D5C3] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 bg-[#FAF9F7] border-b border-[#E6D5C3] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F5F1EE] border border-[#E6D5C3] text-[#8B5E34] flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-[#3E2723]">
                {t.cancelOrderTitle}
              </h3>
              <p className="text-xs text-[#8C7355]">
                {t.orderId}: #{order.trackingId}
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

        {/* Modal Body Form */}
        <form onSubmit={handleCancelSubmit} className="p-6 space-y-5">
          {/* Order Summary & 100% Refund Guarantee Box */}
          <div className="p-4 bg-[#FAF9F7] rounded-2xl border border-[#E6D5C3] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8C7355]">
                {language === 'hi' ? 'रिफंड की जाने वाली कुल राशि:' : 'Total Refund Amount:'}
              </span>
              <span className="text-base font-bold font-serif text-[#8B5E34]">
                ₹{order.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8C7355]">
                {language === 'hi' ? 'रिफंड माध्यम:' : 'Refund Destination:'}
              </span>
              <span className="font-semibold text-[#3E2723] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8B5E34]" />
                {order.paymentMethod.includes('UPI')
                  ? language === 'hi'
                    ? 'मूल UPI खाता (तत्काल)'
                    : 'Original UPI Account (Instant)'
                  : language === 'hi'
                  ? 'मूल भुगतान स्रोत'
                  : 'Original Payment Source'}
              </span>
            </div>
            <p className="text-[11px] text-[#6D5843] pt-1.5 border-t border-[#E6D5C3]/80">
              {t.cancelOrderDesc}
            </p>
          </div>

          {/* Reason Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#3E2723] block">
              {t.cancelReasonLabel} *
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {CANCELLATION_REASONS.map((reasonObj, idx) => {
                const text = language === 'hi' ? reasonObj.hi : reasonObj.en;
                const isSelected = selectedReason === text;
                return (
                  <label
                    key={idx}
                    onClick={() => setSelectedReason(text)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#8B5E34] bg-[#FAF9F7] font-semibold text-[#3E2723]'
                        : 'border-[#E6D5C3] bg-white text-[#6D5843] hover:bg-[#FAF9F7]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancel_reason"
                      checked={isSelected}
                      onChange={() => setSelectedReason(text)}
                      className="mt-0.5 accent-[#8B5E34]"
                    />
                    <span>{text}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Optional custom feedback */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#3E2723] block">
              {language === 'hi' ? 'अतिरिक्त टिप्पणी (वैकल्पिक)' : 'Additional Comments (Optional)'}
            </label>
            <textarea
              value={customComment}
              onChange={(e) => setCustomComment(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'कारीगर या क्लस्टर सहायता के लिए कोई विशेष संदेश...'
                  : 'Provide any specific feedback for artisan or fulfillment collective...'
              }
              rows={2}
              className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-xs text-[#3E2723] focus:ring-1 focus:ring-[#8B5E34]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E6D5C3]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-[#8C7355] hover:bg-[#FAF9F7] rounded-xl"
            >
              {language === 'hi' ? 'नहीं, ऑर्डर रखें' : 'No, Keep Order'}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  {language === 'hi' ? 'रद्द किया जा रहा है...' : 'Cancelling...'}
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t.cancelConfirmBtn}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
