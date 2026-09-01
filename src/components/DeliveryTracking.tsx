import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { Truck, Package, CheckCircle2, Clock, MapPin, Phone, User, Home, ArrowLeft, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';

interface DeliveryTrackingProps {
  order: Order;
  onBackToOrders?: () => void;
  onOpenProduct?: (productId: string) => void;
}

const STEPS: { status: OrderStatus; label: string; icon: any; desc: string }[] = [
  { status: 'Order Placed', label: 'Order Confirmed', icon: CheckCircle2, desc: 'Verified & sent to artisan' },
  { status: 'Accepted by Artisan', label: 'Accepted & Packing', icon: Package, desc: 'Artisan crafting & packing' },
  { status: 'Packed & Dispatched', label: 'Dispatched', icon: Truck, desc: 'Handed over to courier partner' },
  { status: 'In Transit', label: 'In Transit', icon: Clock, desc: 'En route between regional sorting hubs' },
  { status: 'Out for Delivery', label: 'Out for Delivery', icon: MapPin, desc: 'Reaching your address today' },
  { status: 'Delivered', label: 'Delivered', icon: CheckCircle2, desc: 'Handed over safely' },
];

export const DeliveryTracking: React.FC<DeliveryTrackingProps> = ({
  order,
  onBackToOrders,
  onOpenProduct,
}) => {
  const [copiedId, setCopiedId] = useState(false);

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Order Placed': return 0;
      case 'Accepted by Artisan': return 1;
      case 'Packed & Dispatched': return 2;
      case 'In Transit': return 3;
      case 'Out for Delivery': return 4;
      case 'Delivered': return 5;
      default: return 0;
    }
  };

  const currentStep = getStepIndex(order.status);

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(order.trackingId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Navigation Bar */}
      {onBackToOrders && (
        <button
          type="button"
          onClick={onBackToOrders}
          className="flex items-center gap-1.5 text-xs font-bold text-[#8B5E34] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Orders & Shipping History
        </button>
      )}

      {/* Main Tracking Summary Card */}
      <div className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-sm space-y-6">
        {/* Top Tracking Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#E6D5C3]">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-[#8B5E34] bg-[#F5F1EE] border border-[#E6D5C3] px-2.5 py-1 rounded-md">
              {order.status}
            </span>
            <h2 className="text-2xl font-bold font-serif text-[#3E2723] mt-2">
              Order #{order.trackingId}
            </h2>
            <p className="text-xs text-[#8C7355] mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-[#FAF9F7] px-3 py-1.5 rounded-xl border border-[#E6D5C3] text-[#3E2723]">
                Tracking: {order.trackingId}
              </span>
              <button
                type="button"
                onClick={handleCopyTracking}
                className="p-1.5 bg-[#FAF9F7] hover:bg-[#F5F1EE] border border-[#E6D5C3] rounded-xl text-[#8C7355] hover:text-[#8B5E34] transition-colors"
                title="Copy tracking number"
              >
                {copiedId ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <span className="text-xs text-[#3E2723] font-medium flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-[#8B5E34]" /> Courier: <strong className="text-[#3E2723]">{order.courierPartner}</strong>
            </span>
            <span className="text-xs text-[#8B5E34] font-semibold">
              Estimated Delivery: {order.estimatedDelivery}
            </span>
          </div>
        </div>

        {/* Visual Progress Stepper */}
        <div className="py-3">
          <h3 className="text-xs font-bold text-[#3E2723] uppercase tracking-wider mb-6">
            Live Delivery Journey
          </h3>

          <div className="relative">
            {/* Desktop Horizontal Stepper */}
            <div className="hidden sm:grid grid-cols-6 gap-2 relative z-10">
              {STEPS.map((step, idx) => {
                const isCompleted = idx <= currentStep;
                const isCurrent = idx === currentStep;
                const IconComponent = step.icon;

                return (
                  <div key={step.status} className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-xs ${
                        isCompleted
                          ? 'bg-[#8B5E34] text-white ring-4 ring-[#F5F1EE]'
                          : 'bg-[#FAF9F7] text-[#8C7355] border border-[#E6D5C3]'
                      } ${isCurrent ? 'bg-[#8B5E34] text-white ring-4 ring-[#E6D5C3] scale-110' : ''}`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${isCurrent ? 'text-[#8B5E34]' : isCompleted ? 'text-[#3E2723]' : 'text-[#8C7355]'}`}>
                        {step.label}
                      </p>
                      <p className="text-[10px] text-[#8C7355] leading-tight mt-0.5 line-clamp-2">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Connecting Bar */}
            <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-[#E6D5C3] -z-0">
              <div
                className="h-full bg-gradient-to-r from-[#8B5E34] to-[#3E2723] transition-all duration-500"
                style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
              />
            </div>

            {/* Mobile Vertical Stepper */}
            <div className="sm:hidden space-y-4">
              {STEPS.map((step, idx) => {
                const isCompleted = idx <= currentStep;
                const isCurrent = idx === currentStep;
                const IconComponent = step.icon;

                return (
                  <div key={step.status} className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isCompleted ? 'bg-[#8B5E34] text-white' : 'bg-[#FAF9F7] text-[#8C7355] border border-[#E6D5C3]'
                      } ${isCurrent ? 'bg-[#8B5E34] text-white ring-2 ring-[#E6D5C3]' : ''}`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${isCurrent ? 'text-[#8B5E34]' : isCompleted ? 'text-[#3E2723]' : 'text-[#8C7355]'}`}>
                        {step.label}
                      </p>
                      <p className="text-[11px] text-[#8C7355]">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Checkpoint Timeline List */}
        {order.trackingTimeline && order.trackingTimeline.length > 0 && (
          <div className="p-4 bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-[#3E2723] uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#8B5E34]" /> Tracking Timeline & Hub Scans
            </h4>
            <div className="space-y-3">
              {order.trackingTimeline.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${item.completed ? 'bg-[#8B5E34]' : 'bg-[#A68B6D]/40'} ${item.current ? 'ring-4 ring-[#8B5E34]/20 bg-[#8B5E34]' : ''}`} />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-1">
                      <strong className="text-[#3E2723]">{item.title}</strong>
                      <span className="text-[11px] text-[#8C7355] font-mono">{item.date}</span>
                    </div>
                    <p className="text-[#8C7355] text-[11px] mt-0.5">{item.description} ({item.location})</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Two-Column Grid: Customer Shipping Details & Ordered Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Shipping Details Card */}
        <div className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E6D5C3]">
            <Home className="w-5 h-5 text-[#8B5E34]" />
            <h3 className="text-base font-bold font-serif text-[#3E2723]">Customer Shipping Details</h3>
          </div>

          <div className="space-y-2.5 text-xs text-[#3E2723]">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#8C7355] shrink-0" />
              <span>Recipient: <strong className="text-sm">{order.shippingDetails.fullName}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#8C7355] shrink-0" />
              <span>Contact: <strong>{order.shippingDetails.phone}</strong></span>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <MapPin className="w-4 h-4 text-[#8C7355] shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <p>{order.shippingDetails.addressLine1}</p>
                {order.shippingDetails.addressLine2 && <p>{order.shippingDetails.addressLine2}</p>}
                <p className="font-semibold text-[#8B5E34]">
                  {order.shippingDetails.city}, {order.shippingDetails.state} - {order.shippingDetails.pincode}
                </p>
                {order.shippingDetails.landmark && (
                  <p className="text-[11px] text-[#8C7355] mt-1">Landmark: {order.shippingDetails.landmark}</p>
                )}
              </div>
            </div>

            {order.shippingDetails.deliveryNotes && (
              <div className="p-3 bg-[#FAF9F7] rounded-xl text-[11px] text-[#6D5843] border border-[#E6D5C3]">
                <strong className="text-[#3E2723]">Delivery Instructions:</strong> {order.shippingDetails.deliveryNotes}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#E6D5C3] flex items-center justify-between text-xs text-[#8C7355]">
            <span>Payment Method: <strong className="text-[#3E2723]">{order.paymentMethod}</strong></span>
            <span className="font-bold text-[#8B5E34] bg-[#F5F1EE] border border-[#E6D5C3] px-2 py-0.5 rounded-md">
              {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Ordered Product Breakdown */}
        <div className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6D5C3]">
            <h3 className="text-base font-bold font-serif text-[#3E2723]">Ordered Items ({order.items.length})</h3>
            <span className="text-xs text-[#8C7355]">{order.items.reduce((a, x) => a + x.qty, 0)} units</span>
          </div>

          <div className="divide-y divide-[#E6D5C3] space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 pt-3 first:pt-0">
                <div className="w-12 h-12 rounded-xl bg-[#F5F1EE] border border-[#E6D5C3] overflow-hidden flex items-center justify-center shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">{item.emoji}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#3E2723] truncate">{item.name}</h4>
                  <p className="text-[11px] text-[#8C7355]">Crafted by {item.artisanName}</p>
                  <p className="text-xs font-semibold font-serif text-[#8B5E34] mt-0.5">
                    ₹{item.price.toLocaleString('en-IN')} × {item.qty}
                  </p>
                </div>

                {onOpenProduct && (
                  <button
                    type="button"
                    onClick={() => onOpenProduct(item.productId)}
                    className="p-1.5 text-xs text-[#8B5E34] hover:bg-[#F5F1EE] rounded-lg"
                    title="View product"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Pricing summary */}
          <div className="pt-3 border-t border-[#E6D5C3] space-y-1.5 text-xs">
            <div className="flex justify-between text-[#8C7355]">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[#8C7355]">
              <span>Handcrafted Shipping</span>
              <span className="text-[#8B5E34] font-semibold">{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-[#3E2723] pt-2 border-t border-[#E6D5C3]">
              <span>Total Paid</span>
              <span className="font-serif text-base text-[#8B5E34]">₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
