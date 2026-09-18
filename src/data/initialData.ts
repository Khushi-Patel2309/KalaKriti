import { Product, ArtisanProfile, Order, AppNotification, B2BInquiry, CustomizationRequest } from '../types';

export const INITIAL_ARTISAN_PROFILE: ArtisanProfile = {
  id: '24453845-be88-44fc-b500-44c50344d2bb',
  name: 'Radhaben Vankar',
  craft: 'Traditional Kutch Handloom Weaving & Natural Dyes',
  location: 'Bhuj, Kutch, Gujarat',
  state: 'Gujarat',
  district: 'Kutch',
  experienceYears: 22, // Strictly positive
  experience: 22,
  bio: 'I have been weaving for over 22 years in the desert villages of Kutch, continuing the master craftsmanship taught by my grandparents. Every piece is spun with pure organic cotton and dyed with extracted pomegranate peels, indigo, and madder root. KalaKriti connects our loom directly to lovers of handcraft worldwide.',
  story: 'I have been weaving for over 22 years in the desert villages of Kutch, continuing the master craftsmanship taught by my grandparents. Every piece is spun with pure organic cotton and dyed with extracted pomegranate peels, indigo, and madder root. KalaKriti connects our loom directly to lovers of handcraft worldwide.',
  photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
  verified: true,
  upiId: 'radhaben.vankar@okhdfcbank',
  followers: 342,
  views: 5240,
  rating: 4.9,
  phone: '+91 98765 43210',
  email: 'radhaben.crafts@kalakriti.in',
};

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [];

export const INITIAL_CUSTOMIZATIONS: CustomizationRequest[] = [];

