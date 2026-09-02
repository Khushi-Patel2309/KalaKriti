import React, { useState } from 'react';
import { ArtisanProfile, Product, Order, OrderStatus } from '../types';
import { ProductCard } from './ProductCard';
import { ArtisanOrderManagement } from './ArtisanOrderManagement';
import { ArtisanProfileView } from './ArtisanProfileView';
import { AddProductWizard } from './AddProductWizard';
import { ProductReadyIn30Seconds } from './ProductReadyIn30Seconds';
import { AdminView } from './AdminView';
import { Package, Plus, User, Sparkles, TrendingUp, IndianRupee, Eye, ShoppingBag, Truck, Award, ShieldCheck, Zap } from 'lucide-react';

interface ArtisanDashboardViewProps {
  profile: ArtisanProfile;
  onUpdateProfile: (p: ArtisanProfile) => void;
  products: Product[];
  orders: Order[];
  onProductPublished: (product: Product) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus, courierPartner?: string, note?: string) => void;
  onSelectProduct: (product: Product) => void;
  onOpenAskAi: () => void;
}

export const ArtisanDashboardView: React.FC<ArtisanDashboardViewProps> = ({
  profile,
  onUpdateProfile,
  products,
  orders,
  onProductPublished,
  onUpdateOrderStatus,
  onSelectProduct,
  onOpenAskAi,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'profile' | 'wizard' | 'ready30s' | 'admin'>('orders');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Artisan specific metrics
  const myProducts = products.filter((p) => p.artisanId === profile.id || p.artisanName === profile.name);
  const myOrders = orders.filter((o) =>
    o.items.some((i) => i.artisanId === profile.id || i.artisanName === profile.name || true)
  );
  const totalRevenue = myOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrdersCount = myOrders.filter((o) => o.status === 'Order Placed' || o.status === 'Accepted by Artisan').length;

  const handleStartAddProduct = () => {
    setEditingProduct(null);
    setActiveTab('wizard');
  };

  const handleStart30sReady = () => {
    setEditingProduct(null);
    setActiveTab('ready30s');
  };

  const handleStartEditProduct = (p: Product) => {
    setEditingProduct(p);
    setActiveTab('wizard');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Artisan Quick Stats */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-[#8B5E34] via-[#6D4522] to-[#3E2723] text-white rounded-3xl shadow-md border border-[#E6D5C3]/20 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-[#3E2723] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-xs border border-[#E6D5C3]/30">
              {profile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-serif">{profile.name}</h1>
                <span className="text-[10px] font-bold bg-[#E6D5C3] text-[#3E2723] px-2.5 py-0.5 rounded-full">
                  Master Artisan
                </span>
              </div>
              <p className="text-xs text-[#F5F1EE] mt-0.5">
                {profile.craft} · {profile.location} · <strong>{profile.experienceYears} Years Experience</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleStart30sReady}
              className="px-4 py-2.5 text-xs font-bold text-[#244238] bg-[#EAF2ED] hover:bg-white rounded-xl shadow-md flex items-center gap-1.5 transition-transform active:scale-95 border-2 border-[#D8962B]"
              title="Superfast 1-click photo upload product listing"
            >
              <Zap className="w-4 h-4 text-[#D8962B] fill-current" />
              <span>✨ Product Ready in 30s</span>
            </button>
            <button
              type="button"
              onClick={onOpenAskAi}
              className="px-4 py-2.5 text-xs font-bold text-[#3E2723] bg-[#F5F1EE] hover:bg-white rounded-xl shadow-xs flex items-center gap-1.5 transition-transform active:scale-95 border border-[#E6D5C3]"
            >
              <Sparkles className="w-4 h-4 text-[#8B5E34]" /> Ask KalaKriti AI
            </button>
            <button
              type="button"
              onClick={handleStartAddProduct}
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#3E2723] hover:bg-[#2A1A17] rounded-xl shadow-xs flex items-center gap-1.5 transition-transform active:scale-95 border border-[#E6D5C3]/30"
            >
              <Plus className="w-4 h-4" /> Add New Craft Listing
            </button>
          </div>
        </div>

        {/* 4 Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/15 text-xs">
          <div className="p-3.5 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/10">
            <span className="text-[11px] text-[#F5F1EE] block">Active Listings</span>
            <span className="text-xl font-bold font-serif text-white mt-0.5 block">{myProducts.length} items</span>
          </div>

          <div className="p-3.5 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/10">
            <span className="text-[11px] text-[#F5F1EE] block">Customer Orders</span>
            <span className="text-xl font-bold font-serif text-white mt-0.5 block">{myOrders.length} orders</span>
          </div>

          <div className="p-3.5 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/10">
            <span className="text-[11px] text-[#F5F1EE] block">Pending Fulfillment</span>
            <span className="text-xl font-bold font-serif text-[#F5F1EE] mt-0.5 block flex items-center gap-1">
              {pendingOrdersCount} to deliver
            </span>
          </div>

          <div className="p-3.5 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/10">
            <span className="text-[11px] text-[#F5F1EE] block">Total Artisan Earnings</span>
            <span className="text-xl font-bold font-serif text-white mt-0.5 block">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Prominent Quick-Action Card for "Product Ready in 30 Seconds" (Zero typing workflow) */}
      {activeTab !== 'ready30s' && activeTab !== 'wizard' && (
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#FAF6F0] via-white to-[#F5EFE6] border-2 border-[#8B5E34]/30 hover:border-[#8B5E34] rounded-3xl shadow-xs flex flex-wrap items-center justify-between gap-4 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#244238] text-[#D8962B] flex items-center justify-center font-bold shadow-xs shrink-0">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-serif text-[#3E2723]">
                  ✨ Product Ready in 30 Seconds
                </span>
                <span className="text-[10px] font-bold bg-[#D8962B] text-[#244238] px-2 py-0.5 rounded-full">
                  Fast AI Mode
                </span>
              </div>
              <p className="text-xs text-[#6D5843] mt-0.5">
                Zero typing needed: Just upload 1 photo, AI enhances lighting and writes the complete listing in 30 seconds!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStart30sReady}
            className="px-5 py-2.5 bg-[#244238] hover:bg-[#1A3129] text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95 border border-[#3E5C51] cursor-pointer shrink-0"
          >
            <span>⚡ Start 30s Listing</span>
            <span className="text-xs">→</span>
          </button>
        </div>
      )}

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-white border border-[#E6D5C3] rounded-2xl shadow-2xs overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-[#8B5E34] text-white shadow-xs'
              : 'text-[#6D5843] hover:text-[#3E2723] hover:bg-[#FAF9F7]'
          }`}
        >
          <Truck className="w-4 h-4" /> Ordered Products & Customer Delivery Details ({myOrders.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'products'
              ? 'bg-[#8B5E34] text-white shadow-xs'
              : 'text-[#6D5843] hover:text-[#3E2723] hover:bg-[#FAF9F7]'
          }`}
        >
          <Package className="w-4 h-4" /> My Product Catalog ({myProducts.length})
        </button>

        <button
          type="button"
          onClick={handleStart30sReady}
          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'ready30s'
              ? 'bg-[#244238] text-white shadow-xs'
              : 'text-[#244238] font-bold hover:bg-[#EAF2ED]'
          }`}
        >
          <Zap className="w-4 h-4 text-[#D8962B] fill-current" /> ✨ Ready in 30 Seconds
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-[#8B5E34] text-white shadow-xs'
              : 'text-[#6D5843] hover:text-[#3E2723] hover:bg-[#FAF9F7]'
          }`}
        >
          <User className="w-4 h-4" /> Artisan Profile, Annual Report & Progress
        </button>

        <button
          type="button"
          onClick={handleStartAddProduct}
          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'wizard'
              ? 'bg-[#8B5E34] text-white shadow-xs'
              : 'text-[#6D5843] hover:text-[#3E2723] hover:bg-[#FAF9F7]'
          }`}
        >
          <Plus className="w-4 h-4" /> Create New Listing
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('admin')}
          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'admin'
              ? 'bg-[#3E2723] text-white shadow-xs'
              : 'text-[#6D5843] hover:text-[#3E2723] hover:bg-[#FAF9F7]'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-[#E6D5C3]" /> Admin Oversight & Trust Center
        </button>
      </div>

      {/* Tab 1: Orders & Customer Delivery Details (Fulfillment) */}
      {activeTab === 'orders' && (
        <ArtisanOrderManagement
          orders={myOrders}
          profile={profile}
          onUpdateOrderStatus={onUpdateOrderStatus}
          onViewProduct={(prodId) => {
            const p = products.find((x) => x.id === prodId);
            if (p) onSelectProduct(p);
          }}
        />
      )}

      {/* Tab 2: Products Catalog */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-serif text-[#3E2723]">
              My Handcrafted Inventory ({myProducts.length} items)
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleStart30sReady}
                className="px-3.5 py-2 text-xs font-bold text-[#244238] bg-[#EAF2ED] hover:bg-[#D4E8DC] border border-[#244238]/30 rounded-xl flex items-center gap-1 shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 text-[#D8962B] fill-current" /> Ready in 30s
              </button>
              <button
                type="button"
                onClick={handleStartAddProduct}
                className="px-4 py-2 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {myProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                showArtisan={false}
                showStatus={true}
                onClick={() => onSelectProduct(p)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Artisan Profile, Annual Report & Experience */}
      {activeTab === 'profile' && (
        <ArtisanProfileView
          profile={profile}
          onUpdateProfile={onUpdateProfile}
          products={products}
          orders={orders}
        />
      )}

      {/* Tab 4: Add/Edit Product Wizard */}
      {activeTab === 'wizard' && (
        <AddProductWizard
          artisanProfile={profile}
          initialProductToEdit={editingProduct}
          onProductPublished={(newProd) => {
            onProductPublished(newProd);
            setActiveTab('products');
          }}
          onCancel={() => setActiveTab('products')}
          onSwitchTo30Seconds={() => setActiveTab('ready30s')}
        />
      )}

      {/* Tab 5: "Product Ready in 30 Seconds" Superfast Workflow */}
      {activeTab === 'ready30s' && (
        <ProductReadyIn30Seconds
          artisanProfile={profile}
          onProductPublished={(newProd) => {
            onProductPublished(newProd);
            setActiveTab('products');
          }}
          onCancel={() => setActiveTab('products')}
          onSwitchToFullEditor={(prefilled) => {
            if (prefilled) {
              setEditingProduct(prefilled as Product);
            }
            setActiveTab('wizard');
          }}
        />
      )}

      {/* Tab 6: Admin Oversight & Trust Center */}
      {activeTab === 'admin' && (
        <AdminView
          products={products}
          orders={orders}
          artisanProfile={profile}
        />
      )}
    </div>
  );
};

