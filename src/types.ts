export type Role = 'artisan' | 'customer' | 'b2b' | 'admin' | 'catalog';

export type ProductCategory = 
  | 'Textiles & Weaving'
  | 'Pottery & Ceramics'
  | 'Jewelry'
  | 'Woodwork'
  | 'Metalwork'
  | 'Home Decor'
  | 'Paintings & Art';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  materials: string;
  color: string;
  craftTechnique: string;
  descriptionEnglish: string;
  descriptionHindi: string;
  tags: string[];
  price: number;
  oldPrice?: number | null;
  suggestedPrice?: number;
  minPrice?: number;
  maxPrice?: number;
  quantity: number;
  status: 'published' | 'draft';
  emoji: string;
  views: number;
  sold: number;
  imageOriginal?: string | null;
  imageEnhanced?: string | null;
  enhanceMode?: 'removebg' | 'studio' | 'none';
  artisanId: string;
  artisanName: string;
  artisanLocation: string;
  createdAt: number;
}

export interface ArtisanProfile {
  id: string;
  name: string;
  craft: string;
  location: string;
  state?: string;
  district?: string;
  experienceYears: number; // strictly >= 0
  experience?: number;
  bio: string;
  story?: string;
  photo?: string;
  verified?: boolean;
  upiId: string;
  followers?: number;
  views?: number;
  rating?: number;
  phone?: string;
  email?: string;
}

export interface ShippingDetails {
  fullName: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  deliveryNotes?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  emoji: string;
  image?: string | null;
  category: string;
  artisanId: string;
  artisanName: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 
  | 'Order Placed'
  | 'Accepted by Artisan'
  | 'Packed & Dispatched'
  | 'In Transit'
  | 'Out for Delivery'
  | 'Delivered';

export interface TrackingCheckpoint {
  title: string;
  location: string;
  date: string;
  description: string;
  completed: boolean;
  current?: boolean;
}

export interface Order {
  id: string;
  trackingId: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  shippingDetails: ShippingDetails;
  paymentMethod: 'UPI' | 'Cash on Delivery' | 'Credit / Debit Card' | 'Net Banking' | string;
  paymentStatus: 'Paid' | 'Pending Verification' | 'COD' | string;
  transactionId?: string;
  upiTransactionId?: string;
  status: OrderStatus;
  courierPartner: string;
  estimatedDelivery: string;
  trackingTimeline: TrackingCheckpoint[];
  buyerId?: string;
  customerId?: string;
  createdAt: number;
  updatedAt?: number;
}

export interface AppNotification {
  id: string;
  recipientType?: 'buyer' | 'seller' | 'both' | string;
  recipientRole?: 'customer' | 'artisan' | 'admin' | string;
  recipientId?: string;
  title: string;
  message: string;
  type: 'order_placed' | 'order_received' | 'order_dispatched' | 'order_delivered' | 'inquiry' | string;
  orderId?: string;
  trackingId?: string;
  timestamp: number;
  read: boolean;
}

export interface B2BInquiry {
  id: string;
  artisanId: string;
  artisanName: string;
  buyerName: string;
  buyerCompany: string;
  phone: string;
  email: string;
  quantity: number;
  targetPrice?: number;
  message: string;
  status: 'Pending' | 'Responded' | 'Deal Closed';
  date: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: number;
  quickActions?: { label: string; action: string }[];
}

