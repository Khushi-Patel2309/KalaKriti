import React, { useState } from 'react';
import { Order, ShippingDetails } from '../types';
import { DeliveryTracking } from './DeliveryTracking';
import { Package, Truck, MapPin, Phone, User, Home, Clock, CheckCircle2, ChevronRight, Plus, Edit2, ShieldCheck, ArrowRight } from 'lucide-react';

interface CustomerOrdersViewProps {
  orders: Order[];
  onOpenProduct: (productId: string) => void;
  onNavigateToShop: () => void;
  savedShippingDetails?: ShippingDetails;
  onUpdateShippingDetails?: (details: ShippingDetails) => void;
}

export const CustomerOrdersView: React.FC<CustomerOrdersViewProps> = ({
  orders,
  onOpenProduct,
  onNavigateToShop,
  savedShippingDetails,
  onUpdateShippingDetails,
}) => {
  const [activeTab, setActiveTab] = useState<'tracking' | 'shipping-details'>('tracking');
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<Order | null>(null);

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
    if (!addressForm.fullName || !addressForm.phone || !addressForm.addressLine1 || !addressForm.city || !addressForm.pincode) {
      alert('Please fill in required fields: Name, Phone, Address, City and PIN Code.');
      return;
    }
    if (onUpdateShippingDetails) {
      onUpdateShippingDetails(addressForm);
    }
    setIsEditingAddress(false);
  };

  // If viewing single order tracking detail
  if (selectedTrackingOrder) {
    return (
      <DeliveryTracking
        order={selectedTrackingOrder}
        onBackToOrders={() => setSelectedTrackingOrder(null)}
        onOpenProduct={onOpenProduct}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Tabs */}
      <div className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-[#8B5E34]">
            Customer Account & Deliveries
          </span>
          <h1 className="text-2xl font-bold font-serif text-[#3E2723] mt-1">
            My Orders, Tracking & Shipping Details
          </h1>
          <p className="text-xs text-[#8C7355]">
            Live courier tracking for your handmade orders and saved shipping addresses.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 p-1 bg-[#F5F1EE] border border-[#E6D5C3] rounded-2xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('tracking')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'tracking'
                ? 'bg-[#8B5E34] text-white shadow-xs'
                : 'text-[#6D5843] hover:text-[#3E2723]'
            }`}
          >
            <Truck className="w-4 h-4" /> Live Tracking & Orders ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shipping-details')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'shipping-details'
                ? 'bg-[#8B5E34] text-white shadow-xs'
                : 'text-[#6D5843] hover:text-[#3E2723]'
            }`}
          >
            <Home className="w-4 h-4" /> My Shipping Address
          </button>
        </div>
      </div>

      {/* Tab 1: Live Tracking & Orders */}
      {activeTab === 'tracking' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="p-12 text-center bg-white border border-[#E6D5C3] rounded-3xl space-y-3">
              <Package className="w-12 h-12 text-[#A68B6D] mx-auto opacity-70" />
              <h3 className="text-lg font-bold font-serif text-[#3E2723]">No Orders Yet</h3>
              <p className="text-xs text-[#8C7355] max-w-sm mx-auto">
                Explore our catalog of handwoven textiles, pottery, and jewelry made by verified Indian artisans.
              </p>
              <button
                type="button"
                onClick={onNavigateToShop}
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs"
              >
                Browse Handmade Crafts →
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
                      <span className="font-bold text-sm text-[#3E2723]">Tracking: #{order.trackingId}</span>
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
                      Courier: <strong className="text-[#3E2723]">{order.courierPartner}</strong> · Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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
                      <Truck className="w-3.5 h-3.5" /> View Live Tracking & Delivery Details <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Items & Shipping Snippet */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Items */}
                  <div className="space-y-2">
                    <strong className="text-[11px] uppercase text-[#8C7355] block">Ordered Products:</strong>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-[#F5F1EE] border border-[#E6D5C3] flex items-center justify-center shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <span>{item.emoji}</span>
                          )}
                        </div>
                        <div className="truncate">
                          <p className="font-semibold text-[#3E2723] truncate">{item.name}</p>
                          <p className="text-[10px] text-[#8C7355]">By {item.artisanName} · Qty: {item.qty}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery destination snippet */}
                  <div className="p-3 bg-[#FAF9F7] rounded-2xl border border-[#E6D5C3] space-y-1">
                    <strong className="text-[10px] uppercase text-[#8B5E34] block">Delivering To:</strong>
                    <p className="font-bold text-[#3E2723]">{order.shippingDetails.fullName} ({order.shippingDetails.phone})</p>
                    <p className="text-[#6D5843] text-[11px] line-clamp-1">
                      {order.shippingDetails.addressLine1}, {order.shippingDetails.city}, {order.shippingDetails.state} - {order.shippingDetails.pincode}
                    </p>
                    <p className="text-[10px] text-[#8B5E34] font-semibold mt-1">
                      ETA: {order.estimatedDelivery}
                    </p>
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
                <Home className="w-5 h-5 text-[#8B5E34]" /> Customer Delivery & Shipping Address
              </h3>
              <p className="text-xs text-[#8C7355]">
                This address will be automatically used when checking out and shared directly with the artisan for delivery fulfillment.
              </p>
            </div>
            {!isEditingAddress && (
              <button
                type="button"
                onClick={() => setIsEditingAddress(true)}
                className="px-3.5 py-1.5 text-xs font-bold text-[#3E2723] bg-[#FAF9F7] border border-[#E6D5C3] hover:bg-[#F5F1EE] rounded-xl flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#8B5E34]" /> Edit Shipping Info
              </button>
            )}
          </div>

          {isEditingAddress ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-[#3E2723] block mb-1">Recipient Full Name *</label>
                  <input
                    type="text"
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    placeholder="e.g. Pooja Sharma"
                    className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#3E2723] block mb-1">Mobile Phone Number (for courier SMS) *</label>
                  <input
                    type="tel"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#3E2723] block mb-1">Flat / House No. / Building / Street *</label>
                  <input
                    type="text"
                    value={addressForm.addressLine1}
                    onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                    placeholder="e.g. Flat 402, Lotus Residency, 14th Main Road"
                    className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#3E2723] block mb-1">Area / Locality / Sector</label>
                  <input
                    type="text"
                    value={addressForm.addressLine2 || ''}
                    onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                    placeholder="e.g. Indiranagar 2nd Stage"
                    className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#3E2723] block mb-1">Landmark</label>
                  <input
                    type="text"
                    value={addressForm.landmark || ''}
                    onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                    placeholder="e.g. Near BDA Complex"
                    className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#3E2723] block mb-1">City / Town *</label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    placeholder="e.g. Bengaluru"
                    className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#3E2723] block mb-1">State *</label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    placeholder="e.g. Karnataka"
                    className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#3E2723] block mb-1">PIN Code *</label>
                  <input
                    type="text"
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    placeholder="e.g. 560038"
                    className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl font-mono text-[#3E2723]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#3E2723] block mb-1">Delivery Instructions for Courier / Artisan</label>
                  <textarea
                    value={addressForm.deliveryNotes || ''}
                    onChange={(e) => setAddressForm({ ...addressForm, deliveryNotes: e.target.value })}
                    placeholder="e.g. Please ring bell twice, fragile handmade package..."
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
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAddress}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs"
                >
                  Save Shipping Address
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#8B5E34]" />
                <span className="font-bold text-sm text-[#3E2723]">{addressForm.fullName}</span>
                <span className="text-[10px] font-semibold bg-[#8B5E34] text-white px-2 py-0.2 rounded-full">
                  Primary Delivery Address
                </span>
              </div>

              <div className="flex items-center gap-2 text-[#6D5843]">
                <Phone className="w-3.5 h-3.5 text-[#8C7355]" />
                <span>Contact: <strong className="text-[#3E2723]">{addressForm.phone}</strong> {addressForm.email ? `(${addressForm.email})` : ''}</span>
              </div>

              <div className="flex items-start gap-2 text-[#3E2723] pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#8C7355] mt-0.5 shrink-0" />
                <div className="leading-relaxed">
                  <p>{addressForm.addressLine1}</p>
                  {addressForm.addressLine2 && <p>{addressForm.addressLine2}</p>}
                  <p className="font-bold text-[#8B5E34]">
                    {addressForm.city}, {addressForm.state} — PIN: {addressForm.pincode}
                  </p>
                  {addressForm.landmark && <p className="text-[11px] text-[#8C7355]">Landmark: {addressForm.landmark}</p>}
                </div>
              </div>

              {addressForm.deliveryNotes && (
                <p className="p-2.5 bg-white rounded-xl border border-[#E6D5C3] text-[11px] text-[#6D5843]">
                  <strong className="text-[#3E2723]">Special Instructions:</strong> {addressForm.deliveryNotes}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
