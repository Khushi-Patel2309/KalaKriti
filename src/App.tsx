import { supabase } from './lib/supabase'
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
  CustomizationRequest,
  AuthSession,
  CustomerType,
} from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ARTISAN_PROFILE,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CUSTOMIZATIONS,
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
import { KalaKritiLoginView } from './components/KalaKritiLoginView';
import { Sparkles, Bot, ShoppingBag, Truck, Heart, ArrowUp, ShieldAlert } from 'lucide-react';

export default function App() {
  useEffect(() => {
  const testSupabase = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*');

    console.log('SUPABASE TEST:', { data, error });
  };

  testSupabase();
}, []);
  // Authentication & Session Persistence
  const [authSession, setAuthSession] = useState<AuthSession | null>(() => {
    try {
      const saved = localStorage.getItem('kalakriti_auth_session');
      if (saved) {
        const parsed: AuthSession = JSON.parse(saved);
        if (parsed && parsed.isAuthenticated) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return null;
  });

  // Calculate default view based on authenticated session
  const getInitialView = (session: AuthSession | null): string => {
    if (!session || !session.isAuthenticated) return 'login';
    if (session.role === 'artisan') return 'artisan-dashboard';
    if (session.role === 'customer') {
      if (!session.customerType) return 'customer-type-select';
      if (session.customerType === 'b2b') return 'b2b';
      return 'home';
    }
    return 'login';
  };

  const [activeView, setActiveView] = useState<string>(() => {
    // Check saved session on boot
    try {
      const saved = localStorage.getItem('kalakriti_auth_session');
      if (saved) {
        const parsed: AuthSession = JSON.parse(saved);
        return getInitialView(parsed);
      }
    } catch {
      // ignore
    }
    return 'login';
  });

  const [currentRole, setCurrentRole] = useState<Role>(() => {
    try {
      const saved = localStorage.getItem('kalakriti_auth_session');
      if (saved) {
        const parsed: AuthSession = JSON.parse(saved);
        if (parsed?.role === 'artisan') return 'artisan';
        if (parsed?.role === 'customer') {
          return parsed.customerType === 'b2b' ? 'b2b' : 'customer';
        }
      }
    } catch {
      // ignore
    }
    return 'customer';
  });

  const [searchQuery, setSearchQuery] = useState<string>('');

  // Domain State with Clean Reset for Artisan Profile & Orders & Requests (per user request)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const isReset = localStorage.getItem('kalakriti_artisan_clean_reset_v5');
      if (!isReset) {
        localStorage.setItem('kalakriti_artisan_clean_reset_v5', 'true');
        localStorage.setItem('kalakriti_products', JSON.stringify([]));
        localStorage.setItem('kalakriti_orders', JSON.stringify([]));
        localStorage.setItem('kalakriti_customizations', JSON.stringify([]));
        localStorage.setItem('kalakriti_notifications', JSON.stringify([]));
        return [];
      }
      const saved = localStorage.getItem('kalakriti_products');
      const parsed: Product[] = saved ? JSON.parse(saved) : [];
      const deletedRaw = localStorage.getItem('kalakriti_deleted_product_ids');
      const deletedIds: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];
      return parsed.filter((p) => !deletedIds.includes(p.id));
    } catch {
      return [];
    }
  });

  const [artisanProfile, setArtisanProfile] = useState<ArtisanProfile>(() => {
    const saved = localStorage.getItem('kalakriti_artisan_profile');
    return saved ? JSON.parse(saved) : INITIAL_ARTISAN_PROFILE;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const isReset = localStorage.getItem('kalakriti_artisan_clean_reset_v5');
    if (!isReset) {
      return [];
    }
    const saved = localStorage.getItem('kalakriti_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const isReset = localStorage.getItem('kalakriti_artisan_clean_reset_v5');
    if (!isReset) {
      return [];
    }
    const saved = localStorage.getItem('kalakriti_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('kalakriti_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [customizations, setCustomizations] = useState<CustomizationRequest[]>(() => {
    const isReset = localStorage.getItem('kalakriti_artisan_clean_reset_v5');
    if (!isReset) {
      return [];
    }
    const saved = localStorage.getItem('kalakriti_customizations');
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
    localStorage.setItem('kalakriti_customizations', JSON.stringify(customizations));
  }, [customizations]);

  useEffect(() => {
    localStorage.setItem('kalakriti_shipping_details', JSON.stringify(savedShippingDetails));
  }, [savedShippingDetails]);

  // Trigger temporary toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Login Handler
  const handleLoginSuccess = (session: AuthSession) => {
    setAuthSession(session);
    localStorage.setItem('kalakriti_auth_session', JSON.stringify(session));

    if (session.role === 'artisan') {
      setCurrentRole('artisan');
      setActiveView('artisan-dashboard');
      showToast('✓ Welcome back, Radhaben! Signed in to Artisan Workshop.');
    } else if (session.role === 'customer') {
      if (!session.customerType) {
        setCurrentRole('customer');
        setActiveView('customer-type-select');
      } else if (session.customerType === 'b2b') {
        setCurrentRole('b2b');
        setActiveView('b2b');
        showToast(`✓ Welcome back, ${session.userName}! Signed in to B2B Wholesale.`);
      } else {
        setCurrentRole('customer');
        setActiveView('home');
        showToast(`✓ Welcome back, ${session.userName}! Enjoy handcrafted shopping.`);
      }
    }
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('kalakriti_auth_session');
    setAuthSession(null);
    setCurrentRole('customer');
    setActiveView('login');
    showToast('✓ Logged out successfully.');
  };

  // Customer Type Switcher (Only for customers)
  const handleSwitchCustomerType = (newType: CustomerType) => {
    if (!authSession || authSession.role !== 'customer') return;
    const updated: AuthSession = {
      ...authSession,
      customerType: newType,
    };
    setAuthSession(updated);
    localStorage.setItem('kalakriti_auth_session', JSON.stringify(updated));

    if (newType === 'b2b') {
      setCurrentRole('b2b');
      setActiveView('b2b');
      showToast('✓ Switched to B2B Wholesale Portal.');
    } else {
      setCurrentRole('customer');
      setActiveView('home');
      showToast('✓ Switched to Personal Shopping Marketplace.');
    }
  };

  // STRICT Central Route Guard
  const handleGuardedNavigate = (requestedView: string, params?: any) => {
    // 1. Not Authenticated
    if (!authSession || !authSession.isAuthenticated) {
      if (requestedView !== 'login' && requestedView !== 'customer-type-select') {
        showToast('⚠️ Please sign in to access KalaKriti.');
        setActiveView('login');
        return;
      }
      setActiveView(requestedView);
      return;
    }

    // 2. Logged in as Artisan
    if (authSession.role === 'artisan') {
      if (requestedView === 'artisan-dashboard') {
        setActiveView('artisan-dashboard');
        return;
      }
      // Strictly prevent artisan from accessing customer shop, b2b, or admin
      showToast('⚠️ Access restricted: Artisans can only access the Artisan Workshop.');
      setActiveView('artisan-dashboard');
      return;
    }

    // 3. Logged in as Customer
    if (authSession.role === 'customer') {
      // Strictly prevent customer from accessing artisan dashboard or admin
      if (requestedView === 'artisan-dashboard' || requestedView === 'admin') {
        showToast('⚠️ Access restricted: Customer accounts cannot access the Artisan portal.');
        setActiveView(authSession.customerType === 'b2b' ? 'b2b' : 'home');
        return;
      }

      if (requestedView === 'customer-type-select') {
        setActiveView('customer-type-select');
        return;
      }

      if (authSession.customerType === 'b2b') {
        if (requestedView === 'b2b' || requestedView === 'catalog') {
          setActiveView(requestedView);
        } else {
          showToast('Notice: Active as B2B Buyer. Switch customer profile for retail shopping.');
          setActiveView('b2b');
        }
        return;
      }

      // Individual Customer
      if (['home', 'my-orders', 'checkout', 'catalog'].includes(requestedView)) {
        setActiveView(requestedView);
      } else {
        setActiveView('home');
      }
    }
  };

  const handleLandingSearch = (query: string) => {
    setSearchQuery(query);
    if (authSession?.role === 'customer' && authSession.customerType === 'individual') {
      setActiveView('home');
    }
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

  // Customer Cancel Order Handler
  const handleCancelOrder = (orderId: string, reason: string, comments?: string) => {
    const cancelledAt = new Date().toISOString();
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status: 'Cancelled' as OrderStatus,
          cancellationDetails: {
            reason,
            comments,
            cancelledAt,
            refundStatus: 'Initiated',
          },
          trackingTimeline: [
            ...(o.trackingTimeline || []),
            {
              date: new Date().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              }),
              location: `${o.shippingDetails.city} Hub`,
              title: 'Order Cancelled',
              description: `Cancelled by customer. Reason: ${reason}`,
              completed: true,
              current: true,
            },
          ],
        };
      })
    );

    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      // Notify Artisan
      const artisanNotif: AppNotification = {
        id: 'notif_artisan_cancel_' + Date.now(),
        recipientRole: 'artisan',
        recipientId: artisanProfile.id,
        title: '⚠️ Order Cancelled by Customer',
        message: `Order #${targetOrder.trackingId} was cancelled by ${targetOrder.shippingDetails.fullName}. Reason: ${reason}. Do not dispatch.`,
        type: 'order_received',
        orderId: targetOrder.id,
        timestamp: Date.now(),
        read: false,
      };

      // Notify Buyer
      const buyerNotif: AppNotification = {
        id: 'notif_buyer_cancel_' + Date.now(),
        recipientRole: 'customer',
        recipientId: targetOrder.customerId,
        title: '✓ Order Cancelled & Refund Initiated',
        message: `Your order #${targetOrder.trackingId} has been cancelled. 100% refund of ₹${targetOrder.totalAmount.toLocaleString('en-IN')} will be credited within 1-2 business days.`,
        type: 'order_received',
        orderId: targetOrder.id,
        timestamp: Date.now() + 5,
        read: false,
      };

      setNotifications((prev) => [buyerNotif, artisanNotif, ...prev]);
    }
    showToast('✓ Order cancelled successfully. 100% refund initiated.');
  };

  // Customer Return Request Handler
  const handleRequestReturn = (
    orderId: string,
    reason: string,
    refundMethod: string,
    comments?: string
  ) => {
    const requestedAt = new Date().toISOString();
    const pickupTrackingId = 'REV-BD' + Math.floor(Math.random() * 900000 + 100000);

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status: 'Return Requested' as OrderStatus,
          returnDetails: {
            reason,
            comments,
            refundMethod,
            requestedAt,
            pickupTrackingId,
          },
          trackingTimeline: [
            ...(o.trackingTimeline || []),
            {
              date: new Date().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              }),
              location: `${o.shippingDetails.city} Doorstep`,
              title: 'Return Request Registered',
              description: `Doorstep reverse pickup initiated via ${pickupTrackingId}. Reason: ${reason}`,
              completed: true,
              current: true,
            },
          ],
        };
      })
    );

    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      // Notify Artisan
      const artisanNotif: AppNotification = {
        id: 'notif_artisan_ret_' + Date.now(),
        recipientRole: 'artisan',
        recipientId: artisanProfile.id,
        title: '🔄 Return Request Received',
        message: `Customer ${targetOrder.shippingDetails.fullName} requested return for Order #${targetOrder.trackingId}. Reason: ${reason}.`,
        type: 'order_received',
        orderId: targetOrder.id,
        timestamp: Date.now(),
        read: false,
      };

      // Notify Buyer
      const buyerNotif: AppNotification = {
        id: 'notif_buyer_ret_' + Date.now(),
        recipientRole: 'customer',
        recipientId: targetOrder.customerId,
        title: '✓ Return Request Registered',
        message: `Doorstep return pickup assigned (${pickupTrackingId}). Refund of ₹${targetOrder.totalAmount.toLocaleString('en-IN')} via ${refundMethod}.`,
        type: 'order_received',
        orderId: targetOrder.id,
        timestamp: Date.now() + 5,
        read: false,
      };

      setNotifications((prev) => [buyerNotif, artisanNotif, ...prev]);
    }
    showToast('✓ Return request registered! Doorstep reverse pickup scheduled.');
  };

  // Customer Exchange Request Handler
  const handleRequestExchange = (
    orderId: string,
    reason: string,
    exchangeDetails: string,
    comments?: string
  ) => {
    const requestedAt = new Date().toISOString();
    const exchangeTrackingId = 'EXCH-BD' + Math.floor(Math.random() * 900000 + 100000);

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status: 'Exchange Requested' as OrderStatus,
          exchangeDetails: {
            reason,
            exchangeItemDetails: exchangeDetails,
            comments,
            requestedAt,
            exchangeTrackingId,
          },
          trackingTimeline: [
            ...(o.trackingTimeline || []),
            {
              date: new Date().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              }),
              location: `${o.shippingDetails.city} Artisan Workshop`,
              title: 'Exchange Request Registered',
              description: `Replacement requested: ${exchangeDetails}. Reason: ${reason}`,
              completed: true,
              current: true,
            },
          ],
        };
      })
    );

    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      // Notify Artisan
      const artisanNotif: AppNotification = {
        id: 'notif_artisan_exch_' + Date.now(),
        recipientRole: 'artisan',
        recipientId: artisanProfile.id,
        title: '🔁 Product Exchange Requested',
        message: `Customer ${targetOrder.shippingDetails.fullName} requested exchange for Order #${targetOrder.trackingId}. Preferred replacement: ${exchangeDetails}.`,
        type: 'order_received',
        orderId: targetOrder.id,
        timestamp: Date.now(),
        read: false,
      };

      // Notify Buyer
      const buyerNotif: AppNotification = {
        id: 'notif_buyer_exch_' + Date.now(),
        recipientRole: 'customer',
        recipientId: targetOrder.customerId,
        title: '✓ Exchange Request Registered',
        message: `Your exchange request for Order #${targetOrder.trackingId} has been sent to the artisan. Replacement tracking: ${exchangeTrackingId}.`,
        type: 'order_received',
        orderId: targetOrder.id,
        timestamp: Date.now() + 5,
        read: false,
      };

      setNotifications((prev) => [buyerNotif, artisanNotif, ...prev]);
    }
    showToast('✓ Exchange request registered! Artisan has been notified.');
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
    // Unmark from deleted list if ID was reused
    try {
      const deletedRaw = localStorage.getItem('kalakriti_deleted_product_ids');
      const deletedIds: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];
      const updated = deletedIds.filter((id) => id !== newProd.id);
      localStorage.setItem('kalakriti_deleted_product_ids', JSON.stringify(updated));
    } catch {
      // Ignore
    }

    setProducts((prev) => {
      const exists = prev.some((p) => p.id === newProd.id);
      if (exists) {
        return prev.map((p) => (p.id === newProd.id ? newProd : p));
      }
      return [newProd, ...prev];
    });

    // Real-time Notification for Product Publication
    const pubNotif: AppNotification = {
      id: 'notif_pub_' + Date.now(),
      recipientRole: 'artisan',
      recipientId: artisanProfile.id,
      title: '🎉 Product Published to Catalog!',
      message: `"${newProd.name}" is now live in the Master Catalog & Customer Marketplace.`,
      type: 'order_placed',
      timestamp: Date.now(),
      read: false,
    };
    setNotifications((prev) => [pubNotif, ...prev]);
    showToast(`✨ Product "${newProd.name.slice(0, 25)}..." published successfully!`);
  };

  // Persistent Delete Product & Associated Delivery/Order Requests
  const handleDeleteProduct = (productId: string) => {
    const targetProduct = products.find((p) => p.id === productId);
    const prodName = targetProduct?.name;

    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((item) => item.product.id !== productId));

    // Cascade delete: Remove orders and delivery requests containing this product
    setOrders((prev) =>
      prev.filter((order) => !order.items.some((item) => item.product.id === productId))
    );

    // Cascade delete: Remove customization requests for this product
    setCustomizations((prev) =>
      prev.filter((cust) => cust.productId !== productId)
    );

    // Cascade delete: Clean up notifications referencing this product
    setNotifications((prev) =>
      prev.filter((notif) => {
        if (prodName && notif.message.includes(prodName)) return false;
        return true;
      })
    );

    // Persist to deleted IDs set so it NEVER reappears
    try {
      const deletedRaw = localStorage.getItem('kalakriti_deleted_product_ids');
      const deletedIds: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];
      if (!deletedIds.includes(productId)) {
        deletedIds.push(productId);
        localStorage.setItem('kalakriti_deleted_product_ids', JSON.stringify(deletedIds));
      }
    } catch {
      // Ignore
    }

    setSelectedProduct(null);
    showToast('🗑️ Product and associated delivery & order requests deleted.');
  };

  // Customization Request Handlers
  const handleRequestCustomization = (
    reqData: Omit<CustomizationRequest, 'id' | 'createdAt' | 'status'>
  ) => {
    const newReq: CustomizationRequest = {
      ...reqData,
      id: 'cust_' + Date.now(),
      createdAt: Date.now(),
      status: 'Pending',
    };

    setCustomizations((prev) => [newReq, ...prev]);

    // Notify Artisan
    const artisanNotif: AppNotification = {
      id: 'notif_artisan_cust_' + Date.now(),
      recipientRole: 'artisan',
      recipientId: reqData.artisanId,
      title: '✨ New Custom Craft Request',
      message: `${reqData.customerName} requested a custom variant for "${reqData.productName}" (Color: ${reqData.color}, Size: ${reqData.size}).`,
      type: 'order_received',
      timestamp: Date.now(),
      read: false,
    };

    // Notify Buyer
    const buyerNotif: AppNotification = {
      id: 'notif_buyer_cust_' + Date.now(),
      recipientRole: 'customer',
      title: '✓ Customization Request Sent',
      message: `Your custom craft request for "${reqData.productName}" was delivered directly to ${reqData.artisanName}.`,
      type: 'order_received',
      timestamp: Date.now() + 2,
      read: false,
    };

    setNotifications((prev) => [buyerNotif, artisanNotif, ...prev]);
    showToast('✓ Custom craft request sent directly to artisan!');
  };

  const handleUpdateCustomizationStatus = (
    id: string,
    status: 'Accepted' | 'Declined',
    details?: { agreedPrice?: number; estimatedDays?: number; artisanResponse?: string }
  ) => {
    setCustomizations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status, ...details } : c))
    );

    const targetReq = customizations.find((c) => c.id === id);
    if (targetReq) {
      const buyerNotif: AppNotification = {
        id: 'notif_cust_update_' + Date.now(),
        recipientRole: 'customer',
        title: status === 'Accepted' ? '✨ Customization Request Accepted!' : 'Customization Request Update',
        message:
          status === 'Accepted'
            ? `${targetReq.artisanName} accepted your custom craft request for "${targetReq.productName}"! Estimated time: ~${details?.estimatedDays || 7} days.`
            : `${targetReq.artisanName} was unable to accept your request: "${details?.artisanResponse || 'Capacity reached'}".`,
        type: 'order_received',
        timestamp: Date.now(),
        read: false,
      };

      setNotifications((prev) => [buyerNotif, ...prev]);
    }

    showToast(status === 'Accepted' ? '✓ Custom craft request accepted!' : 'Custom request declined.');
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

  // 1. Unauthenticated or Explicit Login View
  if (!authSession || !authSession.isAuthenticated || activeView === 'login') {
    return (
      <>
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-[#3E2723] text-white px-5 py-2.5 rounded-full shadow-2xl text-xs font-semibold flex items-center gap-2 border border-[#E6D5C3]/30 animate-in fade-in slide-in-from-top-3">
            <Sparkles className="w-4 h-4 text-[#A68B6D]" />
            <span>{toastMessage}</span>
          </div>
        )}

        <KalaKritiLoginView
          onLoginSuccess={handleLoginSuccess}
          onOpenAskAi={() => setIsAskAiOpen(true)}
          initialStep="choose-role"
        />

        {/* AI Assistant Chat Modal */}
        <AskKalaKritiAiModal
          isOpen={isAskAiOpen}
          onClose={() => setIsAskAiOpen(false)}
        />
      </>
    );
  }

  // 2. Customer Type Selection step (if customer logged in but needs to pick/switch type)
  if (activeView === 'customer-type-select') {
    return (
      <>
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-[#3E2723] text-white px-5 py-2.5 rounded-full shadow-2xl text-xs font-semibold flex items-center gap-2 border border-[#E6D5C3]/30 animate-in fade-in slide-in-from-top-3">
            <Sparkles className="w-4 h-4 text-[#A68B6D]" />
            <span>{toastMessage}</span>
          </div>
        )}

        <KalaKritiLoginView
          onLoginSuccess={handleLoginSuccess}
          onOpenAskAi={() => setIsAskAiOpen(true)}
          initialStep="customer-type-select"
          pendingCustomerSession={authSession}
        />

        {/* AI Assistant Chat Modal */}
        <AskKalaKritiAiModal
          isOpen={isAskAiOpen}
          onClose={() => setIsAskAiOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5F2] text-[#3E2723] selection:bg-[#8B5E34]/20 selection:text-[#8B5E34]">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#3E2723] text-white px-5 py-2.5 rounded-full shadow-2xl text-xs font-semibold flex items-center gap-2 border border-[#E6D5C3]/30 animate-in fade-in slide-in-from-top-3">
          <Sparkles className="w-4 h-4 text-[#A68B6D]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Navigation with Portal Selector Switcher & Role Badging */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={() => {}}
        activeView={activeView}
        onNavigate={handleGuardedNavigate}
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenPortalSelect={() => {
          if (authSession?.role === 'customer') {
            setActiveView('customer-type-select');
          } else {
            showToast('Artisans operate exclusively in the Artisan Workshop.');
          }
        }}
        authSession={authSession}
        onLogout={handleLogout}
        onSwitchCustomerType={handleSwitchCustomerType}
        onOpenCustomerTypeSelect={() => setActiveView('customer-type-select')}
      />


      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'home' && (
          <CustomerShop
            products={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={(e, p) => handleAddToCart(e, p)}
            searchQuery={searchQuery}
            onNavigateToArtisan={() => handleGuardedNavigate('artisan-dashboard')}
          />
        )}

        {activeView === 'my-orders' && (
          <CustomerOrdersView
            orders={orders}
            customizations={customizations}
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
            onCancelOrder={handleCancelOrder}
            onRequestReturn={handleRequestReturn}
            onRequestExchange={handleRequestExchange}
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
            customizations={customizations}
            onUpdateCustomizationStatus={handleUpdateCustomizationStatus}
            onProductPublished={handleProductPublished}
            onDeleteProduct={handleDeleteProduct}
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
            onExitAdmin={() => handleGuardedNavigate('home')}
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
        onDeleteProduct={handleDeleteProduct}
        onEditProduct={(p) => {
          setSelectedProduct(null);
          setActiveView('artisan-dashboard');
        }}
        onRequestCustomization={handleRequestCustomization}
      />

      {/* Footer */}
      <footer className="bg-[#3E2723] text-[#F8F5F2] border-t border-[#8B5E34]/30 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-[#E6D5C3]/20">
            <KalaKritiLogo size="md" showSubtitle={true} textColor="text-white" />
            <div className="flex items-center gap-6 text-xs text-[#E6D5C3]">
              {authSession?.role === 'customer' ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleGuardedNavigate('home')}
                    className="hover:text-white transition-colors"
                  >
                    Customer Shop
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGuardedNavigate('my-orders')}
                    className="hover:text-white transition-colors"
                  >
                    Live Delivery Tracking
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSwitchCustomerType(authSession.customerType === 'b2b' ? 'individual' : 'b2b')}
                    className="hover:text-white transition-colors underline decoration-dotted"
                  >
                    {authSession.customerType === 'b2b' ? 'Switch to Retail Shop' : 'Switch to B2B Wholesale'}
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="hover:text-[#E8927C] transition-colors"
                  >
                    Sign Out ({authSession.userName})
                  </button>
                </>
              ) : authSession?.role === 'artisan' ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleGuardedNavigate('artisan-dashboard')}
                    className="hover:text-white font-medium transition-colors"
                  >
                    Artisan Workshop
                  </button>
                  <span className="text-[#A68B6D]">|</span>
                  <span className="text-[#E6D5C3]/70 text-xs">
                    Signed in as Radhaben
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="hover:text-[#E8927C] transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveView('login')}
                  className="hover:text-white transition-colors"
                >
                  Sign In
                </button>
              )}
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
