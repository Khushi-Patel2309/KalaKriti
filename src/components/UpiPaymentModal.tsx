import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  QrCode,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  Smartphone,
  AlertCircle,
  Download,
  Lock,
} from 'lucide-react';

interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  payeeUpiId?: string;
  payeeName?: string;
  orderId?: string;
  onPaymentSuccess: (transactionId: string) => void;
}

export const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  payeeUpiId = 'kalakriti.artisan@okhdfcbank',
  payeeName = 'KalaKriti Artisan Collective',
  orderId = 'KK' + Math.floor(Math.random() * 900000 + 100000),
  onPaymentSuccess,
}) => {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [utr, setUtr] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Quick helper to copy UPI ID
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(payeeUpiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Strictly enforce only numbers and max 12 digits
  const handleUtrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    // Strip everything except numbers and limit to 12 digits
    const digitsOnly = rawVal.replace(/\D/g, '').slice(0, 12);
    setUtr(digitsOnly);
    if (error) setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow control keys
    if (
      [
        'Backspace',
        'Delete',
        'Tab',
        'Escape',
        'Enter',
        'ArrowLeft',
        'ArrowRight',
        'Home',
        'End',
      ].includes(e.key) ||
      e.ctrlKey ||
      e.metaKey
    ) {
      return;
    }
    // Block non-digits
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      return;
    }
    // Block typing if already 12 digits and no text selected
    const input = e.currentTarget;
    const hasSelection =
      input.selectionStart !== null &&
      input.selectionEnd !== null &&
      input.selectionEnd > input.selectionStart;
    if (utr.length >= 12 && !hasSelection) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    const digitsOnly = pasted.replace(/\D/g, '').slice(0, 12);
    setUtr(digitsOnly);
    if (error) setError('');
  };

  const handleVerify = () => {
    if (utr.length !== 12) {
      setError(
        language === 'hi'
          ? `UPI आईडी / UTR संदर्भ संख्या केवल 12 अंकों की होनी चाहिए (वर्तमान: ${utr.length}/12 अंक)।`
          : `UPI ID / UTR must be strictly 12 digits only (currently ${utr.length}/12 digits).`
      );
      return;
    }
    setError('');
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      onPaymentSuccess(utr);
    }, 1200);
  };

  const handleSimulateInstantPay = () => {
    setIsVerifying(true);
    // Generate valid 12-digit numeric reference
    const mock12DigitUtr = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    setUtr(mock12DigitUtr);
    setError('');

    setTimeout(() => {
      setIsVerifying(false);
      onPaymentSuccess(mock12DigitUtr);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3E2723]/60 backdrop-blur-xs">
      <div className="w-full max-w-md overflow-hidden bg-white border border-[#E6D5C3] rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#F5F1EE] border-b border-[#E6D5C3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#8B5E34] text-white shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-[#3E2723]">
                {language === 'hi' ? 'UPI QR स्कैन और भुगतान' : 'Scan & Pay with UPI QR'}
              </h3>
              <p className="text-xs text-[#8C7355]">
                {language === 'hi'
                  ? '0% प्लेटफॉर्म शुल्क · सीधे कारीगर समूह को'
                  : 'Zero platform fee · Direct to artisan collective'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8C7355] hover:text-[#3E2723] p-1.5 rounded-lg hover:bg-black/5"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Amount Badge */}
          <div className="flex items-center justify-between p-3.5 bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl">
            <div>
              <span className="text-xs text-[#8C7355] block">
                {language === 'hi' ? 'कुल देय राशि' : 'Total Payable Amount'}
              </span>
              <span className="text-2xl font-bold font-serif text-[#8B5E34]">
                ₹{amount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#8B5E34] bg-white border border-[#E6D5C3] px-2 py-0.5 rounded-md">
                {language === 'hi' ? 'सत्यापित खाता' : 'Verified Merchant'}
              </span>
              <span className="text-xs text-[#8C7355] block mt-0.5">Ref: #{orderId}</span>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center p-5 bg-white border-2 border-dashed border-[#A68B6D]/50 rounded-2xl shadow-xs">
            {/* SVG Visual Scannable QR Representation with Brand Icon */}
            <div className="relative p-3 bg-white border border-[#E6D5C3] rounded-xl shadow-xs">
              <svg viewBox="0 0 160 160" className="w-44 h-44" fill="none">
                <rect width="160" height="160" fill="white" />
                {/* QR Positioning Corners */}
                <rect x="10" y="10" width="38" height="38" fill="#3E2723" rx="6" />
                <rect x="16" y="16" width="26" height="26" fill="white" rx="3" />
                <rect x="22" y="22" width="14" height="14" fill="#8B5E34" rx="2" />

                <rect x="112" y="10" width="38" height="38" fill="#3E2723" rx="6" />
                <rect x="118" y="16" width="26" height="26" fill="white" rx="3" />
                <rect x="124" y="22" width="14" height="14" fill="#8B5E34" rx="2" />

                <rect x="10" y="112" width="38" height="38" fill="#3E2723" rx="6" />
                <rect x="16" y="118" width="26" height="26" fill="white" rx="3" />
                <rect x="22" y="124" width="14" height="14" fill="#8B5E34" rx="2" />

                {/* Simulated High Density UPI Data Pattern */}
                <path
                  d="M56 12h6v6h-6zM68 12h12v6H68zM86 12h6v6h-6zM98 12h6v6h-6zM56 24h12v6H56zM74 24h6v6h-6zM86 24h18v6H86zM56 36h6v12h-6zM68 36h12v6H68zM86 42h6v6h-6zM98 36h6v12h-6zM12 56h18v6H12zM36 56h6v6h-6zM48 56h6v6h-6zM60 56h12v6H60zM78 56h6v12h-6zM90 56h18v6H90zM114 56h6v6h-6zM126 56h18v6h-18zM12 68h6v6h-6zM24 68h18v6H24zM48 68h6v12h-6zM60 68h6v6h-6zM72 68h18v6H72zM96 68h6v6h-6zM108 68h12v6h-12zM126 68h6v18h-6zM138 68h12v6h-12zM12 80h12v6H12zM30 80h6v6h-6zM60 80h12v6H60zM84 80h18v6H84zM108 80h6v6h-6zM120 80h6v6h-6zM138 80h12v6h-12zM12 92h6v6h-6zM24 92h18v6H24zM48 92h6v6h-6zM60 92h6v12h-6zM72 92h18v6H72zM96 92h12v6H96zM114 92h6v6h-6zM126 92h18v6h-18zM56 104h12v6H56zM74 104h6v6h-6zM86 104h12v6H86zM104 104h6v6h-6zM114 104h18v6h-18zM138 104h12v6h-12zM56 116h6v6h-6zM68 116h18v6H68zM92 116h6v18h-6zM104 116h12v6h-12zM122 116h6v6h-6zM134 116h12v6h-12zM56 128h18v6H56zM80 128h6v6h-6zM104 128h6v6h-6zM116 128h18v6h-18zM56 140h6v6h-6zM68 140h12v6H68zM86 140h6v6h-6zM98 140h12v6H98zM116 140h6v6h-6zM128 140h18v6h-18z"
                  fill="#3E2723"
                />
                {/* Central Brand Emblem */}
                <circle cx="80" cy="80" r="16" fill="white" stroke="#8B5E34" strokeWidth="2" />
                <path d="M80 69 C76 74 77 78 80 80 C83 78 84 74 80 69 Z" fill="#8B5E34" />
                <circle cx="80" cy="83" r="3" fill="#3E2723" />
                <text
                  x="80"
                  y="93"
                  textAnchor="middle"
                  fontSize="6"
                  fontWeight="bold"
                  fill="#3E2723"
                >
                  UPI
                </text>
              </svg>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs font-mono font-bold text-[#3E2723] bg-[#FAF9F7] px-2.5 py-1 rounded-lg border border-[#E6D5C3]">
                {payeeUpiId}
              </span>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="p-1.5 text-[#8C7355] hover:text-[#8B5E34] bg-[#FAF9F7] hover:bg-[#F5F1EE] border border-[#E6D5C3] rounded-lg transition-colors"
                title="Copy UPI ID"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-[#8C7355] mt-1 text-center">
              {language === 'hi'
                ? 'Google Pay, PhonePe, Paytm, BHIM एवं सभी बैंक UPI ऐप से स्कैन करें'
                : 'Works with Google Pay, PhonePe, Paytm, BHIM & all Indian banking apps'}
            </p>
          </div>

          {/* Quick Pay / UTR Verification Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#3E2723] uppercase tracking-wider block">
                {language === 'hi'
                  ? '12-अंकीय UPI UTR / संदर्भ संख्या दर्ज करें'
                  : 'Enter 12-Digit UPI UTR / Reference ID'}
              </label>
              <span
                className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                  utr.length === 12
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-[#FAF9F7] text-[#8C7355] border-[#E6D5C3]'
                }`}
              >
                {utr.length}/12 {language === 'hi' ? 'अंक' : 'digits'}
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{12}"
                maxLength={12}
                value={utr}
                onChange={handleUtrChange}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                placeholder="482910382910"
                className="flex-1 px-3.5 py-2.5 text-sm bg-white border border-[#E6D5C3] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#8B5E34] font-mono tracking-wider font-bold text-[#3E2723]"
              />
              <button
                type="button"
                onClick={handleVerify}
                disabled={isVerifying || utr.length !== 12}
                className="px-4 py-2.5 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                {isVerifying
                  ? language === 'hi'
                    ? 'सत्यापित हो रहा है...'
                    : 'Verifying...'
                  : language === 'hi'
                  ? 'भुगतान की पुष्टि करें'
                  : 'Confirm Payment'}
              </button>
            </div>

            {error ? (
              <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
              </p>
            ) : (
              <p className="text-[10px] text-[#8C7355]">
                {language === 'hi'
                  ? 'UPI ऐप से भुगतान के बाद प्राप्त 12 अंकों का संदर्भ नंबर दर्ज करें (अधिकतम 12 अंक)।'
                  : 'Enter the 12-digit numeric reference ID from your UPI app receipt. Strictly 12 digits only.'}
              </p>
            )}
          </div>

          {/* Quick Simulated Direct Payment Helper */}
          <div className="p-3 bg-[#F5F1EE] border border-[#E6D5C3] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8B5E34]" />
              <span className="text-xs font-semibold text-[#3E2723]">
                {language === 'hi' ? 'त्वरित परीक्षण / प्रोटोटाइप' : 'Prototyping / Quick Test'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleSimulateInstantPay}
              disabled={isVerifying}
              className="text-xs font-bold text-[#8B5E34] hover:underline bg-white px-2.5 py-1 rounded-lg border border-[#E6D5C3] shadow-2xs"
            >
              {language === 'hi' ? '⚡ 1-क्लिक 12-अंक UPI भुगतान' : '⚡ 1-Click 12-Digit Pay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

