import React from 'react';
import { Product, Order, ArtisanProfile } from '../types';
import { ShieldCheck, Users, Package, Truck, IndianRupee, CheckCircle2, QrCode } from 'lucide-react';

interface AdminViewProps {
  products: Product[];
  orders: Order[];
  artisanProfile: ArtisanProfile;
}

export const AdminView: React.FC<AdminViewProps> = ({ products, orders, artisanProfile }) => {
  const totalVolume = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 sm:p-8 bg-[#3E2723] text-white rounded-3xl shadow-md space-y-4 border border-[#8B5E34]/30">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#E6D5C3]" />
          <span className="text-xs uppercase tracking-wider font-bold text-[#E6D5C3]">
            KalaKriti Marketplace Administration & Trust Center
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">
          Artisan Cluster Oversight & UPI Settlement Ledger
        </h1>
        <p className="text-xs text-[#E6D5C3] max-w-2xl">
          Real-time monitoring of artisan onboarding, non-negative experience compliance, direct UPI QR verification, and courier dispatch logs.
        </p>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10 text-xs">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
            <span className="text-[11px] text-[#E6D5C3] block">Platform Volume</span>
            <span className="text-lg font-bold font-serif text-white mt-0.5 block">
              ₹{totalVolume.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
            <span className="text-[11px] text-[#E6D5C3] block">Total Orders</span>
            <span className="text-lg font-bold font-serif text-white mt-0.5 block">
              {orders.length} orders
            </span>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
            <span className="text-[11px] text-[#E6D5C3] block">Catalog Items</span>
            <span className="text-lg font-bold font-serif text-white mt-0.5 block">
              {products.length} crafts
            </span>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
            <span className="text-[11px] text-[#E6D5C3] block">Zero Commission Direct Flow</span>
            <span className="text-lg font-bold font-serif text-[#E6D5C3] mt-0.5 block">
              100% to Artisans
            </span>
          </div>
        </div>
      </div>

      {/* Orders & Delivery Auditing Table */}
      <div className="p-6 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-4">
        <h3 className="text-base font-bold font-serif text-[#3E2723] flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#8B5E34]" /> Live Platform Order Fulfillment & Dispatch Status
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#E6D5C3] text-[#8C7355] uppercase text-[10px]">
                <th className="pb-3 font-bold">Order / Tracking</th>
                <th className="pb-3 font-bold">Customer & Shipping Address</th>
                <th className="pb-3 font-bold">Artisan</th>
                <th className="pb-3 font-bold">Amount</th>
                <th className="pb-3 font-bold">Payment</th>
                <th className="pb-3 font-bold">Courier & Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6D5C3]">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-[#FAF9F7]/70 transition-colors">
                  <td className="py-3 font-mono font-bold text-[#3E2723]">{o.trackingId}</td>
                  <td className="py-3">
                    <p className="font-bold text-[#3E2723]">{o.shippingDetails.fullName}</p>
                    <p className="text-[10px] text-[#8C7355]">
                      {o.shippingDetails.city}, {o.shippingDetails.state} ({o.shippingDetails.phone})
                    </p>
                  </td>
                  <td className="py-3 text-[#8B5E34] font-medium">
                    {o.items.map((i) => i.artisanName).join(', ')}
                  </td>
                  <td className="py-3 font-bold text-[#8B5E34]">₹{o.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="py-3">
                    <span className="text-[10px] font-bold bg-[#F5F1EE] text-[#8B5E34] border border-[#E6D5C3] px-2 py-0.5 rounded-md">
                      {o.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-[10px] font-bold bg-[#FAF9F7] text-[#8B5E34] border border-[#E6D5C3] px-2 py-0.5 rounded-md">
                      {o.status} ({o.courierPartner})
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
