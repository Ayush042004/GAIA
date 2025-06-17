export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'vendor';
  avatar?: string;
  ecoStats?: EcoStats;
  moodProfile?: MoodProfile;
  preferences?: UserPreferences;
  wishlist?: WishlistItem[];
  wardrobe?: WardrobeItem[];
}

export interface UserPreferences {
  darkMode: boolean;
  currentMood?: string;
  notifications: boolean;
  shareEcoImpact: boolean;
  esgFilters?: ESGFilters;
}

export interface ESGFilters {
  minSustainabilityScore: number;
  maxCarbonFootprint: number;
  maxWaterUsage: number;
  requiredCertifications: string[];
  preferredRegions: string[];
  ethicsRating: number;
}

export interface WishlistItem {
  id: string;
  product: Product;
  mood: string;
  occasion?: string;
  dateAdded: string;
  notes?: string;
}

export interface WardrobeItem {
  id: string;
  name: string;
  category: WardrobeCategory;
  color: string;
  brand: string;
  style: string;
  season: string;
  image: string;
  dateAdded: string;
  wearCount: number;
  lastWorn: string | null;
  tags: string[];
  mood: string[];
  price?: number;
  purchaseDate?: string;
  notes?: string;
}

export type WardrobeCategory = 'tops' | 'bottoms' | 'dresses' | 'outerwear' | 'shoes' | 'accessories';

export interface OutfitRecommendation {
  id: string;
  name: string;
  items: WardrobeItem[];
  occasion: string;
  mood: string;
  confidence: number;
  aiTips: string[];
  completeTheLook?: Product[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  mood: string[];
  esgMetadata: ESGMetadata;
  vendorId: string;
  stylingTips: string[];
  pairsWith: string[];
  aiGeneratedTips?: string[];
  emotionalTags?: string[];
  transparencyIndex: TransparencyIndex;
}

export interface ESGMetadata {
  carbonFootprint: number;
  waterUsage: number;
  region: string;
  sustainabilityScore: number;
  materials: string[];
  certifications: string[];
  supplyChain: SupplyChainInfo;
  impactZone?: {
    lat: number;
    lng: number;
    description: string;
  };
}

export interface SupplyChainInfo {
  ethicsRating: number; // 1-10 scale
  laborPractices: string;
  fairTrade: boolean;
  localSourcing: boolean;
  transparencyLevel: 'high' | 'medium' | 'low';
  auditDate: string;
  certifyingBody?: string;
}

export interface TransparencyIndex {
  overall: number; // 1-100 scale
  carbon: {
    score: number;
    verified: boolean;
    methodology: string;
    lastUpdated: string;
  };
  water: {
    score: number;
    verified: boolean;
    methodology: string;
    lastUpdated: string;
  };
  ethics: {
    score: number;
    verified: boolean;
    auditReport?: string;
    lastAudit: string;
  };
  region: {
    score: number;
    verified: boolean;
    traceability: string;
    documentation: string[];
  };
}

export interface EcoStats {
  treesPlanted: number;
  carbonReduced: number;
  waterSaved: number;
  impactZones: ImpactZone[];
  totalEcoCredits: number;
  monthlyImpact: MonthlyImpact[];
}

export interface MonthlyImpact {
  month: string;
  trees: number;
  carbon: number;
  water: number;
}

export interface ImpactZone {
  id: string;
  type: 'forest' | 'coral' | 'mangrove' | 'ocean';
  location: string;
  coordinates: [number, number];
  area: number;
  date: string;
  giftedBy?: string;
  message?: string;
}

export interface MoodProfile {
  dominant: string;
  distribution: Record<string, number>;
  personality: string[];
  preferences: string[];
  spendingByMood: Record<string, number>;
  moodHistory: MoodEntry[];
}

export interface MoodEntry {
  date: string;
  mood: string;
  confidence: number;
  context?: string;
}

export interface Order {
  id: string;
  userId: string;
  products: CartItem[];
  total: number;
  status: string;
  ecoImpact: EcoImpact;
  date: string;
  emotion?: string;
  occasion?: string;
  sharedOnSocial?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface EcoImpact {
  treesRestored: number;
  areaRestored: number;
  location: string;
  co2Reduced: number;
  waterSaved: number;
}

export interface StylistPick {
  id: string;
  name: string;
  stylist: string;
  rating: number;
  likes: number;
  price: number;
  category: string;
  mood: string[];
  climate: string;
  image: string;
  description: string;
  items: string[];
  model3D?: string;
}

export interface MoodLeaderboard {
  mood: string;
  totalOrders: number;
  totalSpent: number;
  growth: string;
  emoji: string;
}

export interface EcoGift {
  id: string;
  type: 'trees' | 'coral' | 'mangroves' | 'ocean' | 'renewable';
  name: string;
  description: string;
  impact: string;
  location: string;
  price: number;
  image: string;
  icon: string;
  color: string;
}

export type Mood = 'confident' | 'calm' | 'bold' | 'romantic' | 'adventurous' | 'elegant' | 'casual' | 'professional';