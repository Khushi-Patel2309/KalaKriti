import React, { useState } from 'react';
import { QrCode, Copy, Check, ShieldCheck, ArrowRight, Smartphone, AlertCircle, Download } from 'lucide-react';

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
  const [copied, setCopied] = useState(false);
  const [utr, setUtr] = useState('');
  const [selectedApp, setSelectedApp] = useState<'any' | 'gpay' | 'phonepe' | 'paytm'>('any');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const upiUri = `upi://pay?pa=${encodeURIComponent(payeeUpiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`KalaKriti Order ${orderId}`)}`;

  // Quick helper to copy UPI ID
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(payeeUpiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = () => {
    if (!utr.trim() || utr.trim().length < 6) {
      setError('Please enter the 12-digit UPI Reference Number / UTR from your payment app.');
      return;
    }
    setError('');
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      onPaymentSuccess(utr.trim());
    }, 1200);
  };

  const handleSimulateInstantPay = () => {
    setIsVerifying(true);
    const mockUtr = 'UPI/' + Math.floor(Math.random() * 900000000000 + 100000000000) + '/HDFC';
    setUtr(mockUtr);

    setTimeout(() => {
      setIsVerifying(false);
      onPaymentSuccess(mockUtr);
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
              <h3 className="text-base font-bold font-serif text-[#3E2723]">Scan & Pay with UPI QR</h3>
              <p className="text-xs text-[#8C7355]">Zero platform fee · Direct to artisan collective</p>
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
              <span className="text-xs text-[#8C7355] block">Total Payable Amount</span>
              <span className="text-2xl font-bold font-serif text-[#8B5E34]">
                ₹{amount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#8B5E34] bg-white border border-[#E6D5C3] px-2 py-0.5 rounded-md">
                Verified Merchant
              </span>
              <span className="text-xs text-[#8C7355] block mt-0.5">Order Ref: #{orderId}</span>
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
                <text x="80" y="93" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#3E2723">UPI</text>
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
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-[#8C7355] mt-1">
              Works with Google Pay, PhonePe, Paytm, BHIM & all Indian banking apps
            </p>
          </div>

          {/* Quick Pay / UTR Verification Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#3E2723] uppercase tracking-wider block">
              Enter 12-Digit UTR / Transaction ID
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={utr}
                onChange={(e) => {
                  setUtr(e.target.value);
                  setError('');
                }}
                placeholder="e.g. 482910382910 or UPI/3829..."
                className="flex-1 px-3.5 py-2.5 text-sm bg-white border border-[#E6D5C3] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#8B5E34] font-mono text-[#3E2723]"
              />
              <button
                type="button"
                onClick={handleVerify}
                disabled={isVerifying}
                className="px-4 py-2.5 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs disabled:opacity-60 transition-colors whitespace-nowrap"
              >
                {isVerifying ? 'Verifying...' : 'Confirm Payment'}
              </button>
            </div>
            {error && (
              <p className="text-xs text-[#8B5E34] flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {error}
              </p>
            )}
          </div>

          {/* Quick Simulated Direct Payment Helper */}
          <div className="p-3 bg-[#F5F1EE] border border-[#E6D5C3] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8B5E34]" />
              <span className="text-xs font-semibold text-[#3E2723]">Prototyping / Quick Test</span>
            </div>
            <button
              type="button"
              onClick={handleSimulateInstantPay}
              disabled={isVerifying}
              className="text-xs font-bold text-[#8B5E34] hover:underline bg-white px-2.5 py-1 rounded-lg border border-[#E6D5C3] shadow-2xs"
            >
              ⚡ Instant 1-Click Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
