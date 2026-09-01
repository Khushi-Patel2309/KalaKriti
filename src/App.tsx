import React, { useState, useEffect } from 'react';
import {
  Role,
  Product,
  ArtisanProfile,
  Order,
  OrderStatus,
  AppNotification,
  CartItem,
  ShippingDetails,
} from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ARTISAN_PROFILE,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS,
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { CustomerShop } from './components/CustomerShop';
import { CustomerOrdersView } from './components/CustomerOrdersView';
import { ArtisanDashboardView } from './components/ArtisanDashboardView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { B2BView } from './components/B2BView';
import { WebCatalogView } from './components/WebCatalogView';
import { AdminView } from './components/AdminView';
import { NotificationCenter } from './components/NotificationCenter';
import { AskKalaKritiAiModal } from './components/AskKalaKritiAiModal';
import { KalaKritiLogo } from './components/KalaKritiLogo';
import { Sparkles, Bot, ShoppingBag, Truck, Heart, ArrowUp } from 'lucide-react';

export default function App() {
  // Persistence State
  const [currentRole, setCurrentRole] = useState<Role>('customer');
  const [activeView, setActiveView] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Domain State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('kalakriti_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [artisanProfile, setArtisanProfile] = useState<ArtisanProfile>(() => {
    const saved = localStorage.getItem('kalakriti_artisan_profile');
    return saved ? JSON.parse(saved) : INITIAL_ARTISAN_PROFILE;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('kalakriti_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('kalakriti_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('kalakriti_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [savedShippingDetails, setSavedShippingDetails] = useState<ShippingDetails>(() => {
    const saved = localStorage.getItem('kalakriti_shipping_details');
    return saved
      ? JSON.parse(saved)
      : {
          fullName: 'Pooja Sharma',
          phone: '+91 98234 56789',
          email: 'pooja.sharma@example.com',
          addressLine1: 'Flat 402, Lotus Residency, 14th Main Road',
          addressLine2: 'Indiranagar 2nd Stage',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038',
          landmark: 'Near BDA Complex & Starbucks',
          deliveryNotes: 'Please ring bell twice or leave at security.',
        };
  });

  // UI Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAskAiOpen, setIsAskAiOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('kalakriti_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('kalakriti_artisan_profile', JSON.stringify(artisanProfile));
  }, [artisanProfile]);

  useEffect(() => {
    localStorage.setItem('kalakriti_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('kalakriti_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('kalakriti_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('kalakriti_shipping_details', JSON.stringify(savedShippingDetails));
  }, [savedShippingDetails]);

  // Trigger temporary toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle Role Switch
  const handleRoleChange = (newRole: Role) => {
    setCurrentRole(newRole);
    if (newRole === 'customer') setActiveView('home');
    else if (newRole === 'artisan') setActiveView('artisan-dashboard');
    else if (newRole === 'b2b') setActiveView('b2b');
    else if (newRole === 'catalog') setActiveView('catalog');
    else if (newRole === 'admin') setActiveView('admin');
  };

  // Cart Operations
  const handleAddToCart = (e: React.MouseEvent | null, product: Product) => {
    if (e) e.stopPropagation();

    // Prevent artisan buying own product
    if (
      currentRole === 'artisan' &&
      (product.artisanId === artisanProfile.id || product.artisanName === artisanProfile.name)
    ) {
      showToast('⚠️ You cannot purchase your own product listing.');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`🛍️ Added "${product.name.slice(0, 25)}..." to bag`);
  };

  const handleUpdateCartQty = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleDirectBuyNow = (product: Product) => {
    // Prevent artisan buying own product
    if (
      currentRole === 'artisan' &&
      (product.artisanId === artisanProfile.id || product.artisanName === artisanProfile.name)
    ) {
      showToast('⚠️ You cannot purchase your own product listing.');
      return;
    }

    setSelectedProduct(null);
    setCart([{ product, quantity: 1 }]);
    setActiveView('checkout');
  };

  // Dual Notification Dispatch upon Order Placement
  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setActiveView('my-orders');

    // 1. Notification to the Buyer (Customer)
    const buyerNotification: AppNotification = {
      id: 'notif_buyer_' + Date.now(),
      recipientRole: 'customer',
      recipientId: newOrder.customerId,
      title: 'Order Confirmed & Placed!',
      message: `Your order #${newOrder.trackingId} for ₹${newOrder.totalAmount.toLocaleString('en-IN')} has been sent to the artisan collective. Live courier tracking is now active!`,
      type: 'order_placed',
      orderId: newOrder.id,
      timestamp: Date.now(),
      read: false,
    };

    // 2. Notification to the Seller (Artisan)
    const uniqueArtisans = Array.from(new Set(newOrder.items.map((i) => i.artisanName)));
    const sellerNotifications: AppNotification[] = uniqueArtisans.map((artisanName, idx) => ({
      id: `notif_seller_${Date.now()}_${idx}`,
      recipientRole: 'artisan',
      recipientId: artisanProfile.id,
      title: '🎉 New Customer Order Received!',
      message: `Customer ${newOrder.shippingDetails.fullName} from ${newOrder.shippingDetails.city}, ${newOrder.shippingDetails.state} ordered from your collection. Open 'Ordered Products' to view full customer delivery details & dispatch.`,
      type: 'order_received',
      orderId: newOrder.id,
      timestamp: Date.now() + 10,
      read: false,
    }));

    setNotifications((prev) => [buyerNotification, ...sellerNotifications, ...prev]);
    showToast('✨ Order placed successfully! Notifications sent to buyer and artisan seller.');
  };

  // Artisan Order Status Update & Notification to Buyer
  const handleUpdateOrderStatus = (
    orderId: string,
    newStatus: OrderStatus,
    courierPartner: string = 'BlueDart Express',
    note?: string
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;

        const updatedTimeline = [
          ...(o.trackingTimeline || []),
          {
            date: new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            }),
            location: `${o.shippingDetails.city} Regional Hub`,
            title: `Status: ${newStatus}`,
            description: note || `Order updated by artisan to ${newStatus}.`,
            completed: true,
            current: true,
          },
        ];

        return {
          ...o,
          status: newStatus,
          courierPartner: courierPartner || o.courierPartner,
          trackingTimeline: updatedTimeline,
        };
      })
    );

    // Send Notification to Customer Buyer
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      const customerNotif: AppNotification = {
        id: 'notif_cust_status_' + Date.now(),
        recipientRole: 'customer',
        recipientId: targetOrder.customerId,
        title: `🚚 Order #${targetOrder.trackingId} ${newStatus}`,
        message: `Your handmade order has been updated to "${newStatus}" by ${artisanProfile.name}. Tracking partner: ${courierPartner}.`,
        type: newStatus === 'Delivered' ? 'order_delivered' : 'order_dispatched',
        orderId: targetOrder.id,
        timestamp: Date.now(),
        read: false,
      };

      setNotifications((prev) => [customerNotif, ...prev]);
      showToast(`Order #${targetOrder.trackingId} updated to "${newStatus}". Customer notified!`);
    }
  };

  // Publish / Edit Product
  const handleProductPublished = (newProd: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === newProd.id);
      if (exists) {
        return prev.map((p) => (p.id === newProd.id ? newProd : p));
      }
      return [newProd, ...prev];
    });
    showToast(`✨ Product "${newProd.name.slice(0, 25)}..." published successfully!`);
  };

  const handleNotificationClick = (notif: AppNotification) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    setIsNotificationsOpen(false);

    if (notif.orderId) {
      if (currentRole === 'artisan') {
        setActiveView('artisan-dashboard');
      } else {
        setActiveView('my-orders');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5F2] text-[#3E2723] selection:bg-[#8B5E34]/20 selection:text-[#8B5E34]">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#3E2723] text-white px-5 py-2.5 rounded-full shadow-2xl text-xs font-semibold flex items-center gap-2 border border-[#E6D5C3]/30 animate-in fade-in slide-in-from-top-3">
          <Sparkles className="w-4 h-4 text-[#A68B6D]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Navigation */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        activeView={activeView}
        onNavigate={(v) => setActiveView(v)}
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'home' && (
          <CustomerShop
            products={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={(e, p) => handleAddToCart(e, p)}
            searchQuery={searchQuery}
            onNavigateToArtisan={() => handleRoleChange('artisan')}
          />
        )}

        {activeView === 'my-orders' && (
          <CustomerOrdersView
            orders={orders}
            onOpenProduct={(productId) => {
              const p = products.find((x) => x.id === productId);
              if (p) setSelectedProduct(p);
            }}
            onNavigateToShop={() => setActiveView('home')}
            savedShippingDetails={savedShippingDetails}
            onUpdateShippingDetails={(d) => {
              setSavedShippingDetails(d);
              showToast('✓ Customer delivery details updated.');
            }}
          />
        )}

        {activeView === 'checkout' && (
          <CheckoutView
            items={cart}
            defaultShipping={savedShippingDetails}
            onOrderPlaced={handleOrderPlaced}
            onBackToCart={() => {
              setActiveView('home');
              setIsCartOpen(true);
            }}
          />
        )}

        {activeView === 'artisan-dashboard' && (
          <ArtisanDashboardView
            profile={artisanProfile}
            onUpdateProfile={(p) => {
              setArtisanProfile(p);
              showToast('✓ Artisan profile saved with non-negative experience validation.');
            }}
            products={products}
            orders={orders}
            onProductPublished={handleProductPublished}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onOpenAskAi={() => setIsAskAiOpen(true)}
          />
        )}

        {activeView === 'b2b' && (
          <B2BView
            products={products}
            onOpenProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {activeView === 'catalog' && (
          <WebCatalogView
            products={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {activeView === 'admin' && (
          <AdminView
            products={products}
            orders={orders}
            artisanProfile={artisanProfile}
          />
        )}
      </main>

      {/* Persistent Floating "Ask KalaKriti AI" Button */}
      <button
        type="button"
        onClick={() => setIsAskAiOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3.5 bg-[#8B5E34] hover:bg-[#734B26] text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all border border-[#E6D5C3]"
        title="Ask KalaKriti AI Assistant"
      >
        <Bot className="w-5 h-5" />
        <span className="text-xs font-bold font-serif tracking-wide">
          Ask KalaKriti AI
        </span>
        <Sparkles className="w-3.5 h-3.5 text-[#E6D5C3]" />
      </button>

      {/* AI Assistant Chat Modal */}
      <AskKalaKritiAiModal
        isOpen={isAskAiOpen}
        onClose={() => setIsAskAiOpen(false)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setActiveView('checkout');
        }}
      />

      {/* Notification Drawer */}
      <NotificationCenter
        notifications={notifications}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onMarkAllRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          showToast('All notifications marked as read.');
        }}
        onNotificationClick={handleNotificationClick}
        currentRole={currentRole}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p) => handleAddToCart(null, p)}
        onBuyNow={handleDirectBuyNow}
        currentArtisanProfile={artisanProfile}
        currentRole={currentRole}
        onEditProduct={(p) => {
          setSelectedProduct(null);
          setActiveView('artisan-dashboard');
        }}
      />

      {/* Footer */}
      <footer className="bg-[#3E2723] text-[#F8F5F2] border-t border-[#8B5E34]/30 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-[#E6D5C3]/20">
            <KalaKritiLogo size="md" showSubtitle={true} textColor="text-white" />
            <div className="flex items-center gap-6 text-xs text-[#E6D5C3]">
              <button
                type="button"
                onClick={() => handleRoleChange('customer')}
                className="hover:text-white"
              >
                Customer Shop
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('artisan')}
                className="hover:text-white"
              >
                Artisan Portal
              </button>
              <button
                type="button"
                onClick={() => setActiveView('my-orders')}
                className="hover:text-white"
              >
                Live Delivery Tracking
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('b2b')}
                className="hover:text-white"
              >
                B2B Bulk Sourcing
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className="hover:text-white"
              >
                Platform Trust & Admin
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#A68B6D]">
            <p>
              © {new Date().getFullYear()} KalaKriti Artisan Marketplace. Empowering Indian master craftspeople with direct UPI QR commerce and AI-powered storytelling.
            </p>
            <p className="flex items-center gap-1 text-[#E6D5C3]">
              Crafted with <Heart className="w-3.5 h-3.5 text-[#8B5E34] fill-[#8B5E34]" /> for Indian Heritage
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
