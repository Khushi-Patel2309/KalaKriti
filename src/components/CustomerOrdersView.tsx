import React, { useState } from 'react';
import { Order, ShippingDetails, CustomizationRequest } from '../types';
import { DeliveryTracking } from './DeliveryTracking';
import { CancelOrderModal } from './CancelOrderModal';
import { ReturnExchangeModal } from './ReturnExchangeModal';
import { useLanguage } from '../context/LanguageContext';
import {
  Package,
  Truck,
  MapPin,
  Phone,
  User,
  Home,
  ChevronRight,
  Edit2,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  ShieldCheck,
  Palette,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';

interface CustomerOrdersViewProps {
  orders: Order[];
  onOpenProduct: (productId: string) => void;
  onNavigateToShop: () => void;
  savedShippingDetails?: ShippingDetails;
  onUpdateShippingDetails?: (details: ShippingDetails) => void;
  onCancelOrder?: (orderId: string, reason: string, comments?: string) => void;
  onRequestReturn?: (orderId: string, reason: string, refundMethod: string, comments?: string) => void;
  onRequestExchange?: (orderId: string, reason: string, exchangeDetails: string, comments?: string) => void;
  customizations?: CustomizationRequest[];
}

export const CustomerOrdersView: React.FC<CustomerOrdersViewProps> = ({
  orders,
  onOpenProduct,
  onNavigateToShop,
  savedShippingDetails,
  onUpdateShippingDetails,
  onCancelOrder,
  onRequestReturn,
  onRequestExchange,
  customizations = [],
}) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'tracking' | 'shipping-details' | 'customizations'>('tracking');
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<Order | null>(null);

  // Modals state
  const [cancellingOrder, setCancellingOrder] = useState<Order | null>(null);
  const [returnExchangeOrder, setReturnExchangeOrder] = useState<Order | null>(null);
  const [returnExchangeMode, setReturnExchangeMode] = useState<'return' | 'exchange'>('return');

  // Address edit state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState<ShippingDetails>(
    savedShippingDetails || {
      fullName: 'Pooja Sharma',
      phone: '+91 98234 56789',
      email: 'pooja.sharma@example.com',
      addressLine1: 'Flat 402, Lotus Residency, 14th Main',
      addressLine2: 'Indiranagar 2nd Stage',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      landmark: 'Near BDA Complex & Starbucks',
      deliveryNotes: 'Ring bell twice or leave with security.',
    }
  );

  const handleSaveAddress = () => {
    if (
      !addressForm.fullName ||
      !addressForm.phone ||
      !addressForm.addressLine1 ||
      !addressForm.city ||
      !addressForm.pincode
    ) {
      alert(
        language === 'hi'
          ? 'कृपया सभी आवश्यक फ़ील्ड भरें: नाम, फ़ोन, पता, शहर और पिन कोड।'
          : 'Please fill in required fields: Name, Phone, Address, City and PIN Code.'
      );
      return;
    }
    if (onUpdateShippingDetails) {
      onUpdateShippingDetails(addressForm);
    }
    setIsEditingAddress(false);
  };

  // If viewing single order tracking detail
  if (selectedTrackingOrder) {
    const updatedSelected = orders.find(o => o.id === selectedTrackingOrder.id) || selectedTrackingOrder;
    return (
      <DeliveryTracking
        order={updatedSelected}
        onBackToOrders={() => setSelectedTrackingOrder(null)}
        onOpenProduct={onOpenProduct}
        onCancelOrder={onCancelOrder}
        onRequestReturn={onRequestReturn}
        onRequestExchange={onRequestExchange}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Tabs */}
      <div className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-[#8B5E34]">
            {language === 'hi' ? 'ग्राहक खाता एवं डिलीवरी' : 'Customer Account & Deliveries'}
          </span>
          <h1 className="text-2xl font-bold font-serif text-[#3E2723] mt-1">
            {t.myOrdersTitle}
          </h1>
          <p className="text-xs text-[#8C7355]">{t.myOrdersSubtitle}</p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 p-1 bg-[#F5F1EE] border border-[#E6D5C3] rounded-2xl text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('tracking')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'tracking'
                ? 'bg-[#8B5E34] text-white shadow-xs'
                : 'text-[#6D5843] hover:text-[#3E2723]'
            }`}
          >
            <Truck className="w-4 h-4" /> {t.myOrdersTitle} ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('customizations')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'customizations'
                ? 'bg-[#8B5E34] text-white shadow-xs'
                : 'text-[#6D5843] hover:text-[#3E2723]'
            }`}
          >
            <Palette className="w-4 h-4" /> {t.myCustomizationsTitle} ({customizations.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shipping-details')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'shipping-details'
                ? 'bg-[#8B5E34] text-white shadow-xs'
                : 'text-[#6D5843] hover:text-[#3E2723]'
            }`}
          >
            <Home className="w-4 h-4" /> {t.deliveryAddress}
          </button>
        </div>
      </div>

      {/* Tab 1: Live Tracking & Orders */}
      {activeTab === 'tracking' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="p-12 text-center bg-white border border-[#E6D5C3] rounded-3xl space-y-3">
              <Package className="w-12 h-12 text-[#A68B6D] mx-auto opacity-70" />
              <h3 className="text-lg font-bold font-serif text-[#3E2723]">{t.noOrdersYet}</h3>
              <p className="text-xs text-[#8C7355] max-w-sm mx-auto">
                {language === 'hi'
                  ? 'सत्यापित भारतीय कारीगरों द्वारा बनाए गए वस्त्रों, मिट्टी के बर्तनों और आभूषणों को देखें।'
                  : 'Explore our catalog of handwoven textiles, pottery, and jewelry made by verified Indian artisans.'}
              </p>
              <button
                type="button"
                onClick={onNavigateToShop}
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs"
              >
                {language === 'hi' ? 'हस्तशिल्प उत्पाद देखें →' : 'Browse Handmade Crafts →'}
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs hover:border-[#8B5E34]/50 transition-all space-y-4"
              >
                {/* Order Row Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E6D5C3]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#3E2723]">
                        {t.orderId}: #{order.trackingId}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          order.status === 'Delivered'
                            ? 'bg-[#F5F1EE] text-[#8B5E34] border border-[#E6D5C3]'
                            : 'bg-[#FAF9F7] text-[#8B5E34] border border-[#E6D5C3]'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8C7355] mt-0.5">
                      {t.courierPartner}:{' '}
                      <strong className="text-[#3E2723]">{order.courierPartner}</strong> ·{' '}
                      {new Date(order.createdAt).toLocaleDateString(
                        language === 'hi' ? 'hi-IN' : 'en-IN',
                        { day: 'numeric', month: 'short', year: 'numeric' }
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold font-serif text-[#8B5E34]">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedTrackingOrder(order)}
                      className="px-4 py-2 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs flex items-center gap-1"
                    >
                      <Truck className="w-3.5 h-3.5" /> {t.trackOrderBtn}{' '}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Items & Shipping Snippet */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Items */}
                  <div className="space-y-2">
                    <strong className="text-[11px] uppercase text-[#8C7355] block">
                      {language === 'hi' ? 'ऑर्डर किए गए उत्पाद:' : 'Ordered Products:'}
                    </strong>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-[#F5F1EE] border border-[#E6D5C3] flex items-center justify-center shrink-0">
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
                        <div className="truncate">
                          <p className="font-semibold text-[#3E2723] truncate">{item.name}</p>
                          <p className="text-[10px] text-[#8C7355]">
                            {language === 'hi' ? 'कारीगर' : 'By'} {item.artisanName} · {t.quantity}
                            : {item.qty}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery destination snippet */}
                  <div className="p-3 bg-[#FAF9F7] rounded-2xl border border-[#E6D5C3] space-y-1">
                    <strong className="text-[10px] uppercase text-[#8B5E34] block">
                      {language === 'hi' ? 'डिलीवरी का पता:' : 'Delivering To:'}
                    </strong>
                    <p className="font-bold text-[#3E2723]">
                      {order.shippingDetails.fullName} ({order.shippingDetails.phone})
                    </p>
                    <p className="text-[#6D5843] text-[11px] line-clamp-1">
                      {order.shippingDetails.addressLine1}, {order.shippingDetails.city},{' '}
                      {order.shippingDetails.state} - {order.shippingDetails.pincode}
                    </p>
                    <p className="text-[10px] text-[#8B5E34] font-semibold mt-1">
                      {t.estimatedArrival}: {order.estimatedDelivery}
                    </p>
                  </div>
                </div>

                {/* Cancellation / Return / Exchange Info Strip */}
                {order.status === 'Cancelled' && order.cancellationDetails && (
                  <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl text-xs text-red-900 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-700 shrink-0" />
                      <span className="truncate">
                        <strong>{language === 'hi' ? 'रद्द:' : 'Cancelled:'}</strong> {order.cancellationDetails.reason}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded shrink-0">
                      {language === 'hi' ? 'रिफंड सक्रिय' : '100% Refunded'}
                    </span>
                  </div>
                )}

                {(order.status === 'Return Requested' || order.status === 'Return In Transit' || order.status === 'Returned & Refunded') && order.returnDetails && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <RotateCcw className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span className="truncate">
                        <strong>{language === 'hi' ? 'वापसी अनुरोध:' : 'Return:'}</strong> {order.returnDetails.reason}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded shrink-0">
                      {order.status}
                    </span>
                  </div>
                )}

                {(order.status === 'Exchange Requested' || order.status === 'Exchange In Progress' || order.status === 'Exchanged') && order.exchangeDetails && (
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <RefreshCw className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      <span className="truncate">
                        <strong>{language === 'hi' ? 'एक्सचेंज अनुरोध:' : 'Exchange:'}</strong> {order.exchangeDetails.reason}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded shrink-0">
                      {order.status}
                    </span>
                  </div>
                )}

                {/* Action Buttons Row */}
                <div className="pt-2 border-t border-[#E6D5C3] flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-[#8C7355]">
                    {order.status === 'Delivered'
                      ? language === 'hi'
                        ? 'डिलीवरी सत्यापित · 7-दिवसीय आसान वापसी व एक्सचेंज'
                        : 'Verified Delivery · 7-Day Easy Return & Exchange'
                      : order.status === 'Cancelled'
                      ? language === 'hi'
                        ? 'यह ऑर्डर रद्द किया जा चुका है'
                        : 'This order was cancelled'
                      : language === 'hi'
                      ? 'डिलीवरी से पहले रद्द करने की सुविधा उपलब्ध'
                      : 'Cancellable prior to delivery'}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Cancellation Button */}
                    {(order.status === 'Order Placed' || order.status === 'Accepted by Artisan' || order.status === 'Packed & Dispatched') && onCancelOrder && (
                      <button
                        type="button"
                        onClick={() => setCancellingOrder(order)}
                        className="px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <AlertTriangle className="w-3 h-3" />
                        {t.cancelOrderBtn}
                      </button>
                    )}

                    {/* Return Button */}
                    {order.status === 'Delivered' && onRequestReturn && (
                      <button
                        type="button"
                        onClick={() => {
                          setReturnExchangeOrder(order);
                          setReturnExchangeMode('return');
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-[#8B5E34] bg-white hover:bg-[#F5F1EE] border border-[#E6D5C3] rounded-lg transition-colors flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        {t.returnProductBtn}
                      </button>
                    )}

                    {/* Exchange Button */}
                    {order.status === 'Delivered' && onRequestExchange && (
                      <button
                        type="button"
                        onClick={() => {
                          setReturnExchangeOrder(order);
                          setReturnExchangeMode('exchange');
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-lg transition-colors flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        {t.exchangeProductBtn}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Shipping Details Address Book */}
      {activeTab === 'shipping-details' && (
        <div className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6D5C3]">
            <div>
              <h3 className="text-base font-bold font-serif text-[#3E2723] flex items-center gap-2">
                <Home className="w-5 h-5 text-[#8B5E34]" /> {t.deliveryAddress}
              </h3>
              <p className="text-xs text-[#8C7355]">
                {language === 'hi'
                  ? 'यह पता चेकआउट करते समय स्वचालित रूप से उपयोग किया जाएगा और कारीगर को भेजा जाएगा।'
                  : 'This address will be automatically used when checking out and shared directly with the artisan for delivery fulfillment.'}
              </p>
            </div>
            {!isEditingAddress && (
              <button
                type="button"
                onClick={() => setIsEditingAddress(true)}
                className="px-3.5 py-1.5 text-xs font-bold text-[#3E2723] bg-[#FAF9F7] border border-[#E6D5C3] hover:bg-[#F5F1EE] rounded-xl flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#8B5E34]" />{' '}
                {language === 'hi' ? 'पता संपादित करें' : 'Edit Shipping Info'}
              </button>
            )}
          </div>

          {isEditingAddress ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-[#3E2723] block mb-1">{t.fullName} *</label>
                  <input
                    type="text"
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    placeholder={language === 'hi' ? 'उदा. पूजा शर्मा' : 'e.g. Pooja Sharma'}
                    className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#3E2723] block mb-1">
                    {t.phoneNumber} *
                  </label>
                  <input
                    type="tel"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#3E2723] block mb-1">
                    {t.addressLine1} *
                  </label>
                  <input
                    type="text"
                    value={addressForm.addressLine1}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, addressLine1: e.target.value })
                    }
                    placeholder={
                      language === 'hi'
                        ? 'मकान / फ्लैट नंबर और मार्ग'
                        : 'e.g. Flat 402, Lotus Residency, 14th Main Road'
                    }
                    className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#3E2723] block mb-1">
                    {t.addressLine2}
                  </label>
                  <input
                    type="text"
                    value={addressForm.addressLine2 || ''}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, addressLine2: e.target.value })
                    }
                    placeholder={language === 'hi' ? 'इलाका / क्षेत्र' : 'e.g. Indiranagar 2nd Stage'}
                    className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#3E2723] block mb-1">{t.landmark}</label>
                  <input
                    type="text"
                    value={addressForm.landmark || ''}
                    onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                    placeholder={language === 'hi' ? 'नजदीकी स्थान' : 'e.g. Near BDA Complex'}
                    className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#3E2723] block mb-1">{t.city} *</label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    placeholder={language === 'hi' ? 'शहर' : 'e.g. Bengaluru'}
                    className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#3E2723] block mb-1">{t.state} *</label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    placeholder={language === 'hi' ? 'राज्य' : 'e.g. Karnataka'}
                    className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#3E2723] block mb-1">{t.pincode} *</label>
                  <input
                    type="text"
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    placeholder="e.g. 560038"
                    className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl font-mono text-[#3E2723]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#3E2723] block mb-1">
                    {t.deliveryNotes}
                  </label>
                  <textarea
                    value={addressForm.deliveryNotes || ''}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, deliveryNotes: e.target.value })
                    }
                    placeholder={
                      language === 'hi'
                        ? 'कूरियर के लिए विशेष निर्देश...'
                        : 'e.g. Please ring bell twice, fragile handmade package...'
                    }
                    rows={2}
                    className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E6D5C3]">
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#8C7355]"
                >
                  {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleSaveAddress}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs"
                >
                  {language === 'hi' ? 'डिलीवरी पता सहेजें' : 'Save Shipping Address'}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#8B5E34]" />
                <span className="font-bold text-sm text-[#3E2723]">{addressForm.fullName}</span>
                <span className="text-[10px] font-semibold bg-[#8B5E34] text-white px-2 py-0.2 rounded-full">
                  {language === 'hi' ? 'प्राथमिक डिलीवरी पता' : 'Primary Delivery Address'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[#6D5843]">
                <Phone className="w-3.5 h-3.5 text-[#8C7355]" />
                <span>
                  {t.phoneNumber}:{' '}
                  <strong className="text-[#3E2723]">{addressForm.phone}</strong>{' '}
                  {addressForm.email ? `(${addressForm.email})` : ''}
                </span>
              </div>

              <div className="flex items-start gap-2 text-[#3E2723] pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#8C7355] mt-0.5 shrink-0" />
                <div className="leading-relaxed">
                  <p>{addressForm.addressLine1}</p>
                  {addressForm.addressLine2 && <p>{addressForm.addressLine2}</p>}
                  <p className="font-bold text-[#8B5E34]">
                    {addressForm.city}, {addressForm.state} — PIN: {addressForm.pincode}
                  </p>
                  {addressForm.landmark && (
                    <p className="text-[11px] text-[#8C7355]">
                      {t.landmark}: {addressForm.landmark}
                    </p>
                  )}
                </div>
              </div>

              {addressForm.deliveryNotes && (
                <p className="p-2.5 bg-white rounded-xl border border-[#E6D5C3] text-[11px] text-[#6D5843]">
                  <strong className="text-[#3E2723]">{t.deliveryNotes}:</strong>{' '}
                  {addressForm.deliveryNotes}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Customer Customization Requests */}
      {activeTab === 'customizations' && (
        <div className="space-y-4">
          {customizations.length === 0 ? (
            <div className="p-12 text-center bg-white border border-[#E6D5C3] rounded-3xl space-y-3">
              <Palette className="w-12 h-12 text-[#A68B6D] mx-auto opacity-70" />
              <h3 className="text-lg font-bold font-serif text-[#3E2723]">
                {language === 'hi' ? 'कोई कस्टमाइज़ेशन अनुरोध नहीं मिला' : 'No Customization Requests Yet'}
              </h3>
              <p className="text-xs text-[#8C7355] max-w-sm mx-auto">
                {language === 'hi'
                  ? 'किसी भी उत्पाद विवरण पृष्ठ पर "कस्टमाइज़ेशन अनुरोध करें" बटन पर क्लिक करके कारीगर को अपने मनपसंद रंग, आकार या डिज़ाइन के लिए सीधा संदेश भेजें।'
                  : 'Click "Request Customization" on any product detail page to request bespoke colors, sizes, or custom artisan motifs.'}
              </p>
              <button
                type="button"
                onClick={onNavigateToShop}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#8B5E34] text-white rounded-xl text-xs font-bold hover:bg-[#704824] transition-colors cursor-pointer"
              >
                {language === 'hi' ? 'बाज़ार का अन्वेषण करें' : 'Explore Marketplace'} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {customizations.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border border-[#E6D5C3] rounded-2xl p-5 shadow-xs space-y-4 transition-all hover:border-[#8B5E34]/40"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#F5F1EE] pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#8B5E34] font-serif">
                          {req.productName}
                        </span>
                        <span className="text-[11px] text-[#A68B6D]">
                          • {req.artisanName}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8C7355] mt-0.5">
                        {new Date(req.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          req.status === 'Accepted'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : req.status === 'Declined'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {req.status === 'Accepted' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {req.status === 'Declined' && <XCircle className="w-3.5 h-3.5" />}
                        {req.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                        <span>{req.status}</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#FBF9F7] p-3.5 rounded-xl border border-[#E6D5C3]/60">
                    <div>
                      <span className="text-[#8C7355] block text-[11px]">Requested Customization:</span>
                      <p className="font-semibold text-[#3E2723]">
                        {req.color} • {req.pattern} • {req.size}
                      </p>
                    </div>
                    {req.message && (
                      <div>
                        <span className="text-[#8C7355] block text-[11px]">Your Instructions:</span>
                        <p className="text-[#3E2723] italic">"{req.message}"</p>
                      </div>
                    )}
                  </div>

                  {req.status === 'Accepted' && (
                    <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-xl space-y-1.5 text-xs">
                      <div className="flex items-center justify-between font-bold text-emerald-900">
                        <span>✓ Artisan Agreed to Craft!</span>
                        {req.estimatedPrice && <span>Estimated: ₹{req.estimatedPrice.toLocaleString('en-IN')}</span>}
                      </div>
                      {req.estimatedDays && (
                        <p className="text-emerald-800 text-[11px]">
                          Crafting & Dispatch time: ~{req.estimatedDays} business days
                        </p>
                      )}
                      {req.artisanResponse && (
                        <p className="text-emerald-900 text-xs italic">
                          Artisan Note: "{req.artisanResponse}"
                        </p>
                      )}
                    </div>
                  )}

                  {req.status === 'Declined' && (
                    <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl space-y-1 text-xs">
                      <span className="font-bold text-amber-900">Request Status Note</span>
                      {req.artisanResponse && (
                        <p className="text-amber-800 text-xs italic">
                          Artisan Note: "{req.artisanResponse}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cancellation Modal */}
      {cancellingOrder && onCancelOrder && (
        <CancelOrderModal
          order={cancellingOrder}
          isOpen={Boolean(cancellingOrder)}
          onClose={() => setCancellingOrder(null)}
          onConfirmCancel={(orderId, reason, comments) => {
            onCancelOrder(orderId, reason, comments);
            setCancellingOrder(null);
          }}
        />
      )}

      {/* Return / Exchange Modal */}
      {returnExchangeOrder && (
        <ReturnExchangeModal
          order={returnExchangeOrder}
          isOpen={Boolean(returnExchangeOrder)}
          initialMode={returnExchangeMode}
          onClose={() => setReturnExchangeOrder(null)}
          onSubmitReturn={(orderId, reason, refundMethod, comments) => {
            if (onRequestReturn) {
              onRequestReturn(orderId, reason, refundMethod, comments);
            }
            setReturnExchangeOrder(null);
          }}
          onSubmitExchange={(orderId, reason, exchangeDetails, comments) => {
            if (onRequestExchange) {
              onRequestExchange(orderId, reason, exchangeDetails, comments);
            }
            setReturnExchangeOrder(null);
          }}
        />
      )}
    </div>
  );
};
