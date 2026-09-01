import React, { useState } from 'react';
import { CartItem, ShippingDetails, Order } from '../types';
import { UpiPaymentModal } from './UpiPaymentModal';
import { useLanguage } from '../context/LanguageContext';
import {
  QrCode,
  ShieldCheck,
  MapPin,
  ArrowLeft,
  CheckCircle2,
  Lock,
  AlertCircle,
} from 'lucide-react';

interface CheckoutViewProps {
  items: CartItem[];
  defaultShipping: ShippingDetails;
  onOrderPlaced: (newOrder: Order) => void;
  onBackToCart: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  items,
  defaultShipping,
  onOrderPlaced,
  onBackToCart,
}) => {
  const { language, t } = useLanguage();
  const [shipping, setShipping] = useState<ShippingDetails>(defaultShipping);
  const [paymentMethod, setPaymentMethod] = useState<'UPI_QR' | 'UPI_ID' | 'COD'>('UPI_QR');
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = subtotal > 1999 ? 0 : 99; // Free shipping over 1999
  const totalAmount = subtotal + shippingFee;

  // Generate an immediate simulated order ID
  const tempOrderId = 'KK' + Math.floor(Math.random() * 900000 + 100000);

  const handleInitiatePayment = () => {
    if (
      !shipping.fullName ||
      !shipping.phone ||
      !shipping.addressLine1 ||
      !shipping.city ||
      !shipping.pincode
    ) {
      setErrorMsg(
        language === 'hi'
          ? 'कृपया डिलीवरी और शिपिंग के सभी आवश्यक विवरण भरें।'
          : 'Please complete all required customer shipping and delivery fields.'
      );
      return;
    }
    setErrorMsg('');

    if (paymentMethod === 'UPI_QR' || paymentMethod === 'UPI_ID') {
      setIsUpiModalOpen(true);
    } else {
      // Cash on Delivery
      finalizeOrder('COD_PENDING');
    }
  };

  const finalizeOrder = (transactionRef: string) => {
    const trackingId = 'KKTRK' + Math.floor(Math.random() * 900000 + 100000);
    const estDeliveryDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString(
      language === 'hi' ? 'hi-IN' : 'en-IN',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    );

    const newOrder: Order = {
      id: 'order_' + Date.now(),
      customerId: 'cust_current',
      items: items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        price: i.product.price,
        qty: i.quantity,
        artisanId: i.product.artisanId,
        artisanName: i.product.artisanName,
        category: i.product.category,
        image: i.product.imageEnhanced || i.product.imageOriginal || undefined,
        emoji: i.product.emoji,
      })),
      shippingDetails: shipping,
      subtotal,
      shippingFee,
      totalAmount,
      paymentMethod: paymentMethod === 'COD' ? 'Cash on Delivery' : 'UPI QR Payment',
      paymentStatus: paymentMethod === 'COD' ? 'Pending (On Delivery)' : 'Paid via UPI QR',
      transactionId: transactionRef,
      status: 'Order Placed',
      courierPartner: 'BlueDart Express',
      trackingId,
      estimatedDelivery: estDeliveryDate,
      trackingTimeline: [
        {
          date: new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          }),
          location: `${shipping.city} Hub`,
          title: language === 'hi' ? 'ऑर्डर दर्ज और स्वीकृत हुआ' : 'Order Confirmed & Placed',
          description:
            language === 'hi'
              ? 'कारीगर को सूचना भेज दी गई है और उत्पाद पैकिंग के लिए तैयार किया जा रहा है।'
              : 'Verified with artisan collective and sent for preparation.',
          completed: true,
          current: true,
        },
      ],
      createdAt: Date.now(),
    };

    setIsUpiModalOpen(false);
    onOrderPlaced(newOrder);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        type="button"
        onClick={onBackToCart}
        className="flex items-center gap-1.5 text-xs font-bold text-[#8B5E34] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />{' '}
        {language === 'hi' ? 'झोला और उत्पाद सूची पर वापस जाएं' : 'Back to Bag & Products'}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Shipping Details & Payment Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Details Section */}
          <div className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6D5C3]">
              <h2 className="text-lg font-bold font-serif text-[#3E2723] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#8B5E34]" /> {t.deliveryAddress}
              </h2>
              <span className="text-xs text-[#8C7355]">
                {language === 'hi' ? 'चरण 1 का 2' : 'Step 1 of 2'}
              </span>
            </div>

            {errorMsg && (
              <div className="p-3 bg-[#F5F1EE] text-[#8B5E34] border border-[#E6D5C3] rounded-xl text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4" /> {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-[#3E2723] block mb-1">{t.fullName} *</label>
                <input
                  type="text"
                  value={shipping.fullName}
                  onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                  placeholder={language === 'hi' ? 'उदा. पूजा शर्मा' : 'e.g. Pooja Sharma'}
                  className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl focus:ring-1 focus:ring-[#8B5E34] text-[#3E2723]"
                />
              </div>

              <div>
                <label className="font-bold text-[#3E2723] block mb-1">{t.phoneNumber} *</label>
                <input
                  type="tel"
                  value={shipping.phone}
                  onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                  placeholder="e.g. +91 98234 56789"
                  className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl focus:ring-1 focus:ring-[#8B5E34] text-[#3E2723]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-[#3E2723] block mb-1">{t.addressLine1} *</label>
                <input
                  type="text"
                  value={shipping.addressLine1}
                  onChange={(e) => setShipping({ ...shipping, addressLine1: e.target.value })}
                  placeholder={
                    language === 'hi'
                      ? 'उदा. फ्लैट 402, लोटस रेजीडेंसी, 14वां मुख्य मार्ग'
                      : 'e.g. Flat 402, Lotus Residency, 14th Main Road'
                  }
                  className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl focus:ring-1 focus:ring-[#8B5E34] text-[#3E2723]"
                />
              </div>

              <div>
                <label className="font-bold text-[#3E2723] block mb-1">{t.addressLine2}</label>
                <input
                  type="text"
                  value={shipping.addressLine2 || ''}
                  onChange={(e) => setShipping({ ...shipping, addressLine2: e.target.value })}
                  placeholder={language === 'hi' ? 'उदा. इंदिरा नगर' : 'e.g. Indiranagar'}
                  className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                />
              </div>

              <div>
                <label className="font-bold text-[#3E2723] block mb-1">{t.landmark}</label>
                <input
                  type="text"
                  value={shipping.landmark || ''}
                  onChange={(e) => setShipping({ ...shipping, landmark: e.target.value })}
                  placeholder={language === 'hi' ? 'उदा. बीडीए कॉम्प्लेक्स के पास' : 'e.g. Near BDA Complex'}
                  className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                />
              </div>

              <div>
                <label className="font-bold text-[#3E2723] block mb-1">{t.city} *</label>
                <input
                  type="text"
                  value={shipping.city}
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                  placeholder={language === 'hi' ? 'उदा. बेंगलुरु' : 'e.g. Bengaluru'}
                  className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                />
              </div>

              <div>
                <label className="font-bold text-[#3E2723] block mb-1">{t.state} *</label>
                <input
                  type="text"
                  value={shipping.state}
                  onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                  placeholder={language === 'hi' ? 'उदा. कर्नाटक' : 'e.g. Karnataka'}
                  className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                />
              </div>

              <div>
                <label className="font-bold text-[#3E2723] block mb-1">{t.pincode} *</label>
                <input
                  type="text"
                  value={shipping.pincode}
                  onChange={(e) => setShipping({ ...shipping, pincode: e.target.value })}
                  placeholder="e.g. 560038"
                  className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl font-mono text-[#3E2723]"
                />
              </div>

              <div>
                <label className="font-bold text-[#3E2723] block mb-1">{t.deliveryNotes}</label>
                <input
                  type="text"
                  value={shipping.deliveryNotes || ''}
                  onChange={(e) => setShipping({ ...shipping, deliveryNotes: e.target.value })}
                  placeholder={
                    language === 'hi'
                      ? 'उदा. घंटी बजाएं या सुरक्षा गार्ड के पास छोड़ दें'
                      : 'e.g. Ring bell or leave at reception'
                  }
                  className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6D5C3]">
              <h2 className="text-lg font-bold font-serif text-[#3E2723] flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#8B5E34]" /> {t.paymentMethod}
              </h2>
              <span className="text-xs text-[#8B5E34] font-semibold bg-[#F5F1EE] border border-[#E6D5C3] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3" /> {language === 'hi' ? '100% सुरक्षित' : '100% Secure'}
              </span>
            </div>

            <div className="space-y-3">
              {/* Option 1: UPI QR (Recommended) */}
              <label
                onClick={() => setPaymentMethod('UPI_QR')}
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'UPI_QR'
                    ? 'border-[#8B5E34] bg-[#FAF9F7] shadow-xs'
                    : 'border-[#E6D5C3] bg-white hover:bg-[#FAF9F7]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'UPI_QR'}
                  onChange={() => setPaymentMethod('UPI_QR')}
                  className="mt-1 accent-[#8B5E34]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-[#3E2723] flex items-center gap-1.5">
                      {t.payViaUpi}{' '}
                      <span className="text-[10px] bg-[#8B5E34] text-white px-2 py-0.2 rounded-md">
                        {language === 'hi' ? '0% शुल्क' : 'Zero Fee'}
                      </span>
                    </strong>
                    <span className="text-[11px] font-bold text-[#8B5E34]">
                      GPay / PhonePe / Paytm
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8C7355] mt-0.5">{t.scanUpiQrDesc}</p>
                </div>
              </label>

              {/* Option 2: Cash on Delivery */}
              <label
                onClick={() => setPaymentMethod('COD')}
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-[#8B5E34] bg-[#FAF9F7] shadow-xs'
                    : 'border-[#E6D5C3] bg-white hover:bg-[#FAF9F7]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-1 accent-[#8B5E34]"
                />
                <div className="flex-1">
                  <strong className="text-xs font-bold text-[#3E2723]">{t.payViaCod}</strong>
                  <p className="text-[11px] text-[#8C7355] mt-0.5">
                    {language === 'hi'
                      ? 'जब कूरियर आपके दरवाजे पर पार्सल पहुंचाए तब नकद भुगतान करें।'
                      : 'Pay in cash when courier delivers the package to your doorstep.'}
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Order Summary & Place Button */}
        <div className="space-y-6">
          <div className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-5 sticky top-24">
            <h3 className="text-base font-bold font-serif text-[#3E2723] pb-3 border-b border-[#E6D5C3]">
              {language === 'hi'
                ? `ऑर्डर सारांश (${items.length} वस्तुएं)`
                : `Order Summary (${items.length} items)`}
            </h3>

            <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-[#E6D5C3] pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 pt-3 first:pt-0">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F1EE] border border-[#E6D5C3] flex items-center justify-center shrink-0">
                    {item.product.imageEnhanced ? (
                      <img
                        src={item.product.imageEnhanced}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <span>{item.product.emoji}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#3E2723] truncate">{item.product.name}</p>
                    <p className="text-[10px] text-[#8C7355]">
                      {language === 'hi' ? 'कारीगर' : 'By'} {item.product.artisanName}
                    </p>
                    <p className="text-xs font-semibold font-serif text-[#8B5E34]">
                      ₹{item.product.price.toLocaleString('en-IN')} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-3 border-t border-[#E6D5C3] text-xs text-[#8C7355]">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.shippingCharge}</span>
                <span className="text-[#8B5E34] font-semibold">
                  {shippingFee === 0 ? t.freeShipping : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#3E2723] pt-2 border-t border-[#E6D5C3]">
                <span>{t.totalPayable}</span>
                <span className="font-serif text-lg text-[#8B5E34]">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleInitiatePayment}
              className="w-full py-3.5 px-4 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-2xl shadow-md hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              {paymentMethod === 'UPI_QR' ? (
                <>
                  <QrCode className="w-4 h-4" />{' '}
                  {language === 'hi'
                    ? `स्कैन करें और UPI से ₹${totalAmount.toLocaleString('en-IN')} भुगतान करें`
                    : `Scan & Pay ₹${totalAmount.toLocaleString('en-IN')} via UPI`}
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> {t.confirmAndPlaceOrder}
                </>
              )}
            </button>

            <div className="p-3 bg-[#FAF9F7] rounded-2xl border border-[#E6D5C3] text-[11px] text-[#8C7355] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8B5E34] shrink-0" />
              <span>
                {language === 'hi'
                  ? 'आपको और संबंधित कारीगर दोनों को तुरंत ऑर्डर अलर्ट और लाइव ट्रैकिंग विवरण प्राप्त होगा।'
                  : 'Both you and the artisans will receive instant order confirmation and live dispatch updates.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* UPI Payment Modal with QR Code */}
      <UpiPaymentModal
        isOpen={isUpiModalOpen}
        onClose={() => setIsUpiModalOpen(false)}
        amount={totalAmount}
        orderId={tempOrderId}
        onPaymentSuccess={(utr) => finalizeOrder(utr)}
      />
    </div>
  );
};
