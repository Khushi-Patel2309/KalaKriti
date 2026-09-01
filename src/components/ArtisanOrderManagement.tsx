import React, { useState } from 'react';
import { Order, OrderStatus, ArtisanProfile } from '../types';
import {
  Package,
  Truck,
  CheckCircle2,
  Phone,
  MapPin,
  Printer,
  User,
  MessageCircle,
  ExternalLink,
  AlertCircle,
  Clock,
  RotateCcw,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';

interface ArtisanOrderManagementProps {
  orders: Order[];
  profile: ArtisanProfile;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus, courierPartner?: string, note?: string) => void;
  onViewProduct?: (productId: string) => void;
}

export const ArtisanOrderManagement: React.FC<ArtisanOrderManagementProps> = ({
  orders,
  profile,
  onUpdateOrderStatus,
  onViewProduct,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [dispatchModalOrder, setDispatchModalOrder] = useState<Order | null>(null);
  const [courierName, setCourierName] = useState('India Post Speed Post');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [dispatchNote, setDispatchNote] = useState('');

  // Filter orders relevant to this artisan or all orders if master demo
  const relevantOrders = orders.filter((o) =>
    o.items.some((item) => item.artisanId === profile.id || item.artisanName === profile.name || true)
  );

  const filteredOrders = relevantOrders.filter((o) => {
    if (filterStatus === 'All') return true;
    if (filterStatus === 'Pending') return o.status === 'Order Placed' || o.status === 'Accepted by Artisan';
    if (filterStatus === 'Dispatched') return o.status === 'Packed & Dispatched' || o.status === 'In Transit';
    if (filterStatus === 'Delivered') return o.status === 'Delivered';
    if (filterStatus === 'Returns/Exchanges') {
      return (
        o.status === 'Return Requested' ||
        o.status === 'Return In Transit' ||
        o.status === 'Returned & Refunded' ||
        o.status === 'Exchange Requested' ||
        o.status === 'Exchange In Progress' ||
        o.status === 'Exchanged'
      );
    }
    if (filterStatus === 'Cancelled') return o.status === 'Cancelled';
    return true;
  });

  const handleOpenDispatch = (order: Order) => {
    setDispatchModalOrder(order);
    setTrackingNumber('TRK' + Math.floor(Math.random() * 900000 + 100000));
    setCourierName('BlueDart Express');
    setDispatchNote('Dispatched in secure tamper-proof packaging.');
  };

  const handleConfirmDispatch = () => {
    if (!dispatchModalOrder) return;
    onUpdateOrderStatus(
      dispatchModalOrder.id,
      'Packed & Dispatched',
      courierName,
      `Courier: ${courierName} (Waybill: ${trackingNumber}). ${dispatchNote}`
    );
    setDispatchModalOrder(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-[#8B5E34]">
            Artisan Order Fulfillment, Returns & Dispatch
          </span>
          <h2 className="text-2xl font-bold font-serif text-[#3E2723] mt-1">
            Customer Orders & Delivery Details
          </h2>
          <p className="text-xs text-[#8C7355]">
            View customer delivery addresses, accept orders, manage return/exchange requests, and print packing slips.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl text-xs font-semibold">
          {['All', 'Pending', 'Dispatched', 'Delivered', 'Returns/Exchanges', 'Cancelled'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                filterStatus === status
                  ? 'bg-[#8B5E34] text-white shadow-xs'
                  : 'text-[#8C7355] hover:text-[#3E2723] hover:bg-[#F5F1EE]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-white border border-[#E6D5C3] rounded-3xl space-y-3">
          <Package className="w-12 h-12 text-[#A68B6D] mx-auto opacity-70" />
          <h3 className="text-lg font-bold font-serif text-[#3E2723]">No Customer Orders Found</h3>
          <p className="text-xs text-[#8C7355] max-w-md mx-auto">
            When a customer purchases one of your handmade products or requests a return/exchange, it will appear here immediately.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs hover:border-[#8B5E34]/50 transition-all space-y-5"
            >
              {/* Order Card Top Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E6D5C3]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#F5F1EE] border border-[#E6D5C3] text-[#8B5E34] flex items-center justify-center font-bold">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#3E2723]">Order #{order.trackingId}</span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        order.status === 'Cancelled'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : order.status === 'Return Requested' || order.status === 'Return In Transit' || order.status === 'Returned & Refunded'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : order.status === 'Exchange Requested' || order.status === 'Exchange In Progress' || order.status === 'Exchanged'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : order.status === 'Delivered'
                          ? 'bg-[#F5F1EE] text-[#8B5E34] border border-[#E6D5C3]'
                          : 'bg-[#FAF9F7] text-[#8B5E34] border border-[#E6D5C3]'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#8C7355]">
                      Received: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#8B5E34] bg-[#F5F1EE] border border-[#E6D5C3] px-2.5 py-1 rounded-lg">
                    Payment: {order.paymentMethod} ({order.paymentStatus})
                  </span>
                  <span className="text-base font-bold font-serif text-[#8B5E34]">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Cancellation Banner for Artisan */}
              {order.status === 'Cancelled' && order.cancellationDetails && (
                <div className="p-4 bg-red-50/80 border border-red-200 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-red-900">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-700" />
                      Customer Cancelled Order Before Delivery
                    </span>
                    <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded">Do Not Dispatch</span>
                  </div>
                  <p className="text-xs text-red-800">
                    <strong>Reason:</strong> {order.cancellationDetails.reason}
                    {order.cancellationDetails.comments && ` — "${order.cancellationDetails.comments}"`}
                  </p>
                </div>
              )}

              {/* Return Banner for Artisan */}
              {(order.status === 'Return Requested' || order.status === 'Return In Transit' || order.status === 'Returned & Refunded') && order.returnDetails && (
                <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                    <span className="flex items-center gap-1.5">
                      <RotateCcw className="w-4 h-4 text-amber-700" />
                      Return Request from Customer
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded">{order.status}</span>
                  </div>
                  <p className="text-xs text-amber-800">
                    <strong>Reason:</strong> {order.returnDetails.reason}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {order.status === 'Return Requested' && (
                      <button
                        type="button"
                        onClick={() => onUpdateOrderStatus(order.id, 'Return In Transit', 'BlueDart Express', 'Reverse pickup scheduled from customer address.')}
                        className="px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Truck className="w-3.5 h-3.5" /> Approve & Schedule Reverse Pickup
                      </button>
                    )}
                    {order.status === 'Return In Transit' && (
                      <button
                        type="button"
                        onClick={() => onUpdateOrderStatus(order.id, 'Returned & Refunded', order.courierPartner, 'Item received back in artisan workshop and refund settled.')}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-green-700 hover:bg-green-800 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" /> Confirm Item Received & Settle Refund
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Exchange Banner for Artisan */}
              {(order.status === 'Exchange Requested' || order.status === 'Exchange In Progress' || order.status === 'Exchanged') && order.exchangeDetails && (
                <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-4 h-4 text-blue-700" />
                      Exchange Replacement Request
                    </span>
                    <span className="text-[10px] bg-blue-100 text-blue-900 px-2 py-0.5 rounded">{order.status}</span>
                  </div>
                  <p className="text-xs text-blue-800">
                    <strong>Reason:</strong> {order.exchangeDetails.reason}
                  </p>
                  <p className="text-xs text-blue-900 bg-white/80 p-2 rounded-lg border border-blue-200">
                    <strong>Customer wants:</strong> {order.exchangeDetails.exchangeItemDetails}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {order.status === 'Exchange Requested' && (
                      <button
                        type="button"
                        onClick={() => onUpdateOrderStatus(order.id, 'Exchange In Progress', 'BlueDart Express', 'Replacement craft item prepared and reverse pickup arranged.')}
                        className="px-3 py-1.5 text-xs font-bold text-blue-900 bg-blue-200/80 hover:bg-blue-300 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Package className="w-3.5 h-3.5" /> Accept Exchange & Prepare Replacement
                      </button>
                    )}
                    {order.status === 'Exchange In Progress' && (
                      <button
                        type="button"
                        onClick={() => onUpdateOrderStatus(order.id, 'Exchanged', order.courierPartner, 'Replacement handed over and delivered successfully.')}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-green-700 hover:bg-green-800 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mark Exchange Complete
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Order Content: Two Columns (Ordered Product & Customer Delivery Address) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Ordered Items */}
                <div className="space-y-3 p-4 bg-[#FAF9F7] border border-[#E6D5C3] rounded-2xl">
                  <h4 className="text-xs font-bold text-[#8B5E34] uppercase tracking-wider">
                    Ordered Products To Prepare
                  </h4>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white border border-[#E6D5C3] overflow-hidden flex items-center justify-center shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl">{item.emoji}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#3E2723] truncate">{item.name}</p>
                          <p className="text-[11px] text-[#8C7355]">Category: {item.category}</p>
                          <p className="text-xs font-bold font-serif text-[#8B5E34]">
                            ₹{item.price.toLocaleString('en-IN')} × {item.qty} pcs
                          </p>
                        </div>
                        {onViewProduct && (
                          <button
                            type="button"
                            onClick={() => onViewProduct(item.productId)}
                            className="text-xs text-[#8B5E34] hover:underline"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: EXACT Customer Delivery Details */}
                <div className="space-y-2.5 p-4 bg-white border border-[#E6D5C3] rounded-2xl shadow-xs">
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#E6D5C3]">
                    <h4 className="text-xs font-bold text-[#8B5E34] uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" /> Where to Deliver (Customer Shipping Details)
                    </h4>
                  </div>

                  <div className="text-xs space-y-1.5 text-[#3E2723]">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-[#8C7355]" />
                      <span>Customer: <strong className="text-sm">{order.shippingDetails.fullName}</strong></span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#8C7355]" />
                        <span>Contact: <strong>{order.shippingDetails.phone}</strong></span>
                      </div>
                      <a
                        href={`https://wa.me/${order.shippingDetails.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Namaste ${order.shippingDetails.fullName}, this is ${profile.name} from KalaKriti regarding your order #${order.trackingId}.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-[#8B5E34] bg-[#F5F1EE] px-2 py-0.5 rounded-md border border-[#E6D5C3] flex items-center gap-1 hover:bg-[#E6D5C3]"
                      >
                        <MessageCircle className="w-3 h-3" /> WhatsApp
                      </a>
                    </div>

                    <div className="p-2.5 bg-[#FAF9F7] rounded-xl border border-[#E6D5C3] text-xs leading-relaxed">
                      <p className="font-semibold text-[#8B5E34]">{order.shippingDetails.addressLine1}</p>
                      {order.shippingDetails.addressLine2 && <p>{order.shippingDetails.addressLine2}</p>}
                      <p className="font-bold text-[#3E2723] mt-0.5">
                        {order.shippingDetails.city}, {order.shippingDetails.state} — PIN: {order.shippingDetails.pincode}
                      </p>
                      {order.shippingDetails.landmark && (
                        <p className="text-[11px] text-[#8C7355] mt-0.5">Landmark: {order.shippingDetails.landmark}</p>
                      )}
                    </div>

                    {order.shippingDetails.deliveryNotes && (
                      <p className="text-[11px] text-[#6D5843] bg-[#FAF9F7] p-2 rounded-lg border border-[#E6D5C3]">
                        <strong className="text-[#3E2723]">Delivery Note:</strong> {order.shippingDetails.deliveryNotes}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons for Artisan */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E6D5C3]">
                <div className="flex items-center gap-2 text-xs text-[#8C7355]">
                  <Clock className="w-3.5 h-3.5 text-[#8B5E34]" />
                  <span>Courier: <strong className="text-[#3E2723]">{order.courierPartner}</strong> ({order.estimatedDelivery})</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Step 1: Accept */}
                  {order.status === 'Order Placed' && (
                    <button
                      type="button"
                      onClick={() => onUpdateOrderStatus(order.id, 'Accepted by Artisan', order.courierPartner, 'Artisan accepted order and started packing.')}
                      className="px-4 py-2 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Accept Order & Prepare
                    </button>
                  )}

                  {/* Step 2: Dispatch / Add Courier */}
                  {(order.status === 'Order Placed' || order.status === 'Accepted by Artisan') && (
                    <button
                      type="button"
                      onClick={() => handleOpenDispatch(order)}
                      className="px-4 py-2 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Truck className="w-4 h-4" /> Dispatch & Add Courier Details
                    </button>
                  )}

                  {/* Step 3: In Transit to Delivered */}
                  {(order.status === 'Packed & Dispatched' || order.status === 'In Transit') && (
                    <button
                      type="button"
                      onClick={() => onUpdateOrderStatus(order.id, 'Delivered', order.courierPartner, 'Delivered safely to customer.')}
                      className="px-4 py-2 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Mark Order as Delivered
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="px-3 py-2 text-xs font-semibold text-[#3E2723] bg-[#FAF9F7] border border-[#E6D5C3] hover:bg-[#F5F1EE] rounded-xl flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#8B5E34]" /> View Packing Slip
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dispatch Modal */}
      {dispatchModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3E2723]/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-[#E6D5C3] rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6D5C3]">
              <h3 className="text-base font-bold font-serif text-[#3E2723] flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#8B5E34]" /> Dispatch Order #{dispatchModalOrder.trackingId}
              </h3>
              <button
                type="button"
                onClick={() => setDispatchModalOrder(null)}
                className="text-[#8C7355] hover:text-[#3E2723]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#3E2723] block mb-1">Courier Partner / Logistics Provider</label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723] focus:ring-1 focus:ring-[#8B5E34]"
                >
                  <option>BlueDart Express</option>
                  <option>India Post Speed Post</option>
                  <option>Delhivery Logistics</option>
                  <option>DTDC Courier</option>
                  <option>Ekart Logistics</option>
                  <option>Local Artisan Direct Delivery</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#3E2723] block mb-1">Waybill / Courier Tracking ID</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. BD948201 or IP392019IN"
                  className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl font-mono text-[#3E2723]"
                />
              </div>

              <div>
                <label className="font-bold text-[#3E2723] block mb-1">Dispatch Note (Shown to Customer)</label>
                <textarea
                  value={dispatchNote}
                  onChange={(e) => setDispatchNote(e.target.value)}
                  placeholder="e.g. Packed with handmade authenticity tag and bubble wrap..."
                  rows={2}
                  className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                />
              </div>

              <div className="p-3 bg-[#FAF9F7] rounded-xl text-[11px] text-[#8C7355] border border-[#E6D5C3]">
                <strong className="text-[#3E2723]">Recipient:</strong> {dispatchModalOrder.shippingDetails.fullName} — {dispatchModalOrder.shippingDetails.city}, {dispatchModalOrder.shippingDetails.state} (PIN: {dispatchModalOrder.shippingDetails.pincode})
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E6D5C3]">
              <button
                type="button"
                onClick={() => setDispatchModalOrder(null)}
                className="px-4 py-2 text-xs font-semibold text-[#8C7355] hover:bg-[#F5F1EE] rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDispatch}
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs"
              >
                Confirm Dispatch & Notify Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Shipping Packing Slip Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3E2723]/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white border border-[#E6D5C3] rounded-3xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6D5C3]">
              <div>
                <h3 className="text-base font-bold font-serif text-[#3E2723]">KalaKriti Shipping Label & Packing Slip</h3>
                <p className="text-xs text-[#8C7355]">Order #{selectedOrder.trackingId}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-[#8C7355] hover:text-[#3E2723]"
              >
                ✕
              </button>
            </div>

            {/* Printable Label View */}
            <div className="p-5 border-2 border-dashed border-[#E6D5C3] rounded-2xl bg-[#FAF9F7] space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-[#E6D5C3] pb-2">
                <span className="font-serif font-bold text-lg text-[#3E2723]">KALAKRITI ARTISAN SHIPMENT</span>
                <span className="font-mono font-bold text-[#8B5E34]">{selectedOrder.courierPartner}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong className="text-[10px] uppercase text-[#8C7355] block">SHIP FROM (Artisan):</strong>
                  <p className="font-bold text-sm text-[#8B5E34]">{profile.name}</p>
                  <p>{profile.craft}</p>
                  <p>{profile.location}</p>
                  <p>Ph: {profile.phone || '+91 98765 43210'}</p>
                </div>

                <div>
                  <strong className="text-[10px] uppercase text-[#8C7355] block">SHIP TO (Customer):</strong>
                  <p className="font-bold text-sm text-[#3E2723]">{selectedOrder.shippingDetails.fullName}</p>
                  <p>{selectedOrder.shippingDetails.addressLine1}</p>
                  {selectedOrder.shippingDetails.addressLine2 && <p>{selectedOrder.shippingDetails.addressLine2}</p>}
                  <p className="font-bold">{selectedOrder.shippingDetails.city}, {selectedOrder.shippingDetails.state} - {selectedOrder.shippingDetails.pincode}</p>
                  <p>Ph: {selectedOrder.shippingDetails.phone}</p>
                </div>
              </div>

              <div className="border-t border-[#E6D5C3] pt-2 space-y-1">
                <strong>Package Contents:</strong>
                {selectedOrder.items.map((i, idx) => (
                  <p key={idx}>• {i.name} (Qty: {i.qty}) — ₹{i.price * i.qty}</p>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-bold text-white bg-[#8B5E34] rounded-xl flex items-center gap-1"
              >
                <Printer className="w-4 h-4" /> Print Shipping Label
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
