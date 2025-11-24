export enum RetailerName {
  COLES = 'Coles',
  WOOLWORTHS = 'Woolworths',
  ALDI = 'Aldi',
  IGA = 'IGA',
  FOODLAND = 'Foodland',
  DRAKES = 'Drakes',
  FOODWORKS = 'FoodWorks'
}

export enum ProductCategory {
  SOFT_DRINKS = 'Soft Drinks',
  JUICES = 'Juices',
  CEREAL = 'Breakfast Cereals',
  SNACKS = 'Snacks & Chips',
  DAIRY = 'Dairy & Yoghurt',
  READY_MEALS = 'Ready Meals',
  PANTRY = 'Pantry & Canned'
}

export interface NutritionPer100 {
  energykJ: number;
  sugarg: number;
  saturatedFatg: number;
  sodiummg: number;
  proteing: number;
  fiberg: number;
}

export interface PricePoint {
  retailer: RetailerName;
  price: number;
  unitPriceStr: string; // e.g., "$0.50 / 100ml"
  inStock: boolean;
  storeDistanceKm: number;
  lastUpdated: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  size: string;
  category: ProductCategory;
  image: string;
  nutrition: NutritionPer100;
  prices: PricePoint[];
  healthStarRating?: number; // Calculated at runtime
  description?: string;
  ingredients?: string[];
}

export interface FilterState {
  category?: ProductCategory;
  minStars: number;
  maxPrice?: number;
  searchQuery: string;
}

export interface ListItem {
  id: string; // Composite key: productId_retailer
  productId: string;
  productName: string;
  image: string;
  size: string;
  retailer: RetailerName;
  price: number;
  isChecked: boolean; // For checking off while shopping
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  isGuest: boolean;
  joinedDate: string;
  memberTier: 'Free' | 'Premium';
}