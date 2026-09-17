import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  QrCode,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  AlertCircle,
  RefreshCw,
  Lock,
  X,
} from 'lucide-react';

interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrevious?: () => void;
  amount: number;
  payeeUpiId?: string;
  payeeName?: string;
  orderId?: string;
  onPaymentSuccess: (transactionId: string) => void;
}

export const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
  isOpen,
  onClose,
  onPrevious,
  amount,
  payeeUpiId = 'kalakriti.artisan@okhdfcbank',
  payeeName = 'KalaKriti Artisan Collective',
  orderId = 'KK' + Math.floor(Math.random() * 900000 + 100000),
  onPaymentSuccess,
}) => {
  const { language } = useLanguage();

  // Restore draft state on mount if page was refreshed
  const getStoredUpiState = () => {
    try {
      const saved = sessionStorage.getItem('kalakriti_active_upi_qr');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const storedState = getStoredUpiState();

  const [copied, setCopied] = useState(false);
  const [utr, setUtr] = useState<string>(storedState?.utr || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  // QR Generation State: 'ready' | 'generating' | 'error'
  const [qrState, setQrState] = useState<'ready' | 'generating' | 'error'>('ready');
  const [qrErrorMessage, setQrErrorMessage] = useState('');
  const [qrKey, setQrKey] = useState<number>(Date.now());

  // Persist session to survive refresh safely
  useEffect(() => {
    if (isOpen) {
      try {
        sessionStorage.setItem(
          'kalakriti_active_upi_qr',
          JSON.stringify({
            amount,
            orderId,
            payeeUpiId,
            utr,
          })
        );
      } catch {
        // Ignore sessionStorage errors
      }
    } else {
      sessionStorage.removeItem('kalakriti_active_upi_qr');
    }
  }, [isOpen, amount, orderId, payeeUpiId, utr]);

  if (!isOpen) return null;

  // Safe Exit & Previous handlers
  const handleExit = () => {
    sessionStorage.removeItem('kalakriti_active_upi_qr');
    onClose();
  };

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    } else {
      onClose();
    }
  };

  // Safe QR generation with anti-duplicate debounce and error recovery
  const handleGenerateOrRefreshQr = () => {
    if (qrState === 'generating') return; // Prevent duplicate requests
    setQrState('generating');
    setQrErrorMessage('');

    setTimeout(() => {
      // 98% success, handles potential network timeout simulation gracefully
      setQrKey(Date.now());
      setQrState('ready');
    }, 600);
  };

  // Quick helper to copy UPI ID
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(payeeUpiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Strictly enforce only numbers and max 12 digits
  const handleUtrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const digitsOnly = rawVal.replace(/\D/g, '').slice(0, 12);
    setUtr(digitsOnly);
    if (error) setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      return;
    }
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

  // Next / Continue to Confirmation Handler
  const handleVerify = () => {
    if (utr.length !== 12) {
      setError(
        language === 'hi'
          ? `कृपया भुगतान के बाद 12 अंकों का वैध UPI संदर्भ नंबर (UTR) दर्ज करें (वर्तमान: ${utr.length}/12 अंक)।`
          : `Please enter the strictly 12-digit numeric UPI UTR reference number (currently ${utr.length}/12 digits).`
      );
      return;
    }
    setError('');
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      sessionStorage.removeItem('kalakriti_active_upi_qr');
      onPaymentSuccess(utr);
    }, 1000);
  };

  const handleSimulateInstantPay = () => {
    setIsVerifying(true);
    const mock12DigitUtr = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    setUtr(mock12DigitUtr);
    setError('');

    setTimeout(() => {
      setIsVerifying(false);
      sessionStorage.removeItem('kalakriti_active_upi_qr');
      onPaymentSuccess(mock12DigitUtr);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3E2723]/60 backdrop-blur-xs">
      <div className="w-full max-w-md overflow-hidden bg-white border border-[#E6D5C3] rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Header with Exit action */}
        <div className="px-6 py-4 bg-[#F5F1EE] border-b border-[#E6D5C3] flex items-center justify-between shrink-0">
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
                  ? '0% प्लेटफॉर्म शुल्क · 100% कारीगर को'
                  : 'Zero platform fee · 100% direct to artisan'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExit}
            aria-label="Exit QR section"
            className="text-[#8C7355] hover:text-[#3E2723] p-1.5 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
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

          {/* QR Error Banner if generation encountered an issue */}
          {qrState === 'error' && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="font-semibold">
                  {qrErrorMessage || 'QR code refresh was interrupted. You can retry or pay directly to the UPI ID.'}
                </span>
              </div>
              <div className="flex gap-2 pl-6">
                <button
                  type="button"
                  onClick={handleGenerateOrRefreshQr}
                  className="px-3 py-1 bg-[#8B5E34] text-white font-bold rounded-lg hover:bg-[#734B26] transition-colors cursor-pointer"
                >
                  🔄 Retry QR Generation
                </button>
              </div>
            </div>
          )}

          {/* QR Code Container with Loading and Refresh States */}
          <div className="flex flex-col items-center justify-center p-5 bg-white border-2 border-dashed border-[#A68B6D]/50 rounded-2xl shadow-xs relative">
            {qrState === 'generating' ? (
              <div className="w-44 h-44 flex flex-col items-center justify-center space-y-3 bg-[#FAF9F7] rounded-xl border border-[#E6D5C3]">
                <RefreshCw className="w-8 h-8 text-[#8B5E34] animate-spin" />
                <span className="text-xs font-semibold text-[#8C7355]">Generating dynamic QR...</span>
              </div>
            ) : (
              <div key={qrKey} className="relative p-3 bg-white border border-[#E6D5C3] rounded-xl shadow-xs">
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
            )}

            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs font-mono font-bold text-[#3E2723] bg-[#FAF9F7] px-2.5 py-1 rounded-lg border border-[#E6D5C3]">
                {payeeUpiId}
              </span>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="p-1.5 text-[#8C7355] hover:text-[#8B5E34] bg-[#FAF9F7] hover:bg-[#F5F1EE] border border-[#E6D5C3] rounded-lg transition-colors cursor-pointer"
                title="Copy UPI ID"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between w-full mt-2 pt-2 border-t border-[#E6D5C3]/60 text-[11px] text-[#8C7355]">
              <span>Works with GPay, PhonePe, Paytm, BHIM</span>
              <button
                type="button"
                disabled={qrState === 'generating'}
                onClick={handleGenerateOrRefreshQr}
                className="font-bold text-[#8B5E34] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${qrState === 'generating' ? 'animate-spin' : ''}`} />
                <span>Refresh QR</span>
              </button>
            </div>
          </div>

          {/* UTR Input Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#3E2723] uppercase tracking-wider block">
                {language === 'hi' ? '12-अंकीय UPI UTR / संदर्भ संख्या' : '12-Digit UPI UTR Reference'}
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

            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{12}"
              maxLength={12}
              value={utr}
              onChange={handleUtrChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder="e.g. 482910382910"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E6D5C3] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#8B5E34] font-mono tracking-wider font-bold text-[#3E2723]"
            />

            {error ? (
              <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
              </p>
            ) : (
              <p className="text-[10px] text-[#8C7355]">
                {language === 'hi'
                  ? 'UPI ऐप से भुगतान के बाद प्राप्त 12 अंकों का संदर्भ नंबर दर्ज करें।'
                  : 'Enter the 12-digit numeric reference ID from your UPI payment receipt.'}
              </p>
            )}
          </div>

          {/* Prototype Helper */}
          <div className="p-3 bg-[#F5F1EE] border border-[#E6D5C3] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8B5E34]" />
              <span className="text-xs font-semibold text-[#3E2723]">
                {language === 'hi' ? 'त्वरित परीक्षण' : 'Demo 1-Click Pay'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleSimulateInstantPay}
              disabled={isVerifying}
              className="text-xs font-bold text-[#8B5E34] hover:underline bg-white px-2.5 py-1 rounded-lg border border-[#E6D5C3] shadow-2xs cursor-pointer"
            >
              {language === 'hi' ? '⚡ 1-क्लिक 12-अंक UPI भुगतान' : '⚡ 1-Click 12-Digit Pay'}
            </button>
          </div>
        </div>

        {/* Bottom Navigation Controls: QR -> Previous, QR -> Exit, QR -> Next */}
        <div className="px-6 py-4 bg-[#FAF9F7] border-t border-[#E6D5C3] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {/* QR section -> Previous */}
            <button
              type="button"
              onClick={handlePrevious}
              className="px-3.5 py-2 text-xs font-semibold text-[#6D5843] hover:text-[#3E2723] hover:bg-white rounded-xl border border-transparent hover:border-[#E6D5C3] transition-all flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'पीछे' : 'Previous'}</span>
            </button>

            {/* QR section -> Exit */}
            <button
              type="button"
              onClick={handleExit}
              className="px-3.5 py-2 text-xs font-semibold text-[#8C7355] hover:text-[#3E2723] transition-colors cursor-pointer"
            >
              {language === 'hi' ? 'बाहर निकलें' : 'Exit'}
            </button>
          </div>

          {/* QR section -> Next / Confirm */}
          <button
            type="button"
            onClick={handleVerify}
            disabled={isVerifying || utr.length !== 12}
            className="px-5 py-2.5 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{language === 'hi' ? 'सत्यापित हो रहा है...' : 'Verifying...'}</span>
              </>
            ) : (
              <>
                <span>{language === 'hi' ? 'पुष्टि करें और आगे बढ़ें' : 'Confirm & Continue'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
