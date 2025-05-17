export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  address?: string;
  created_at: string;
}

export interface Listing {
  id: string;
  name: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    zip: string;
    coordinates: [number, number];
  };
  amenities: string[];
  rating: number;
  reviews_count: number;
  images: string[];
  owner_id: string;
  created_at: string;
  price?: number;
}

export interface MealPlan {
  id: string;
  listing_id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_quarterly: number;
  price_yearly: number;
  meals: {
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    breakfast?: Meal;
    lunch?: Meal;
    dinner?: Meal;
  }[];
  delivery_available: boolean;
  delivery_fee: number;
  created_at: string;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  image?: string;
  dietary_info: string[];
}

export interface Subscription {
  id: string;
  user_id: string;
  listing_id: string;
  meal_plan_id: string;
  start_date: string;
  end_date: string;
  billing_cycle: 'monthly' | 'quarterly' | 'yearly';
  is_delivery: boolean;
  delivery_address?: string;
  delivery_time?: string;
  status: 'active' | 'cancelled' | 'expired';
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  listing_id: string;
  rating: number;
  comment: string;
  created_at: string;
}