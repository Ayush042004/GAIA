import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, userData: { name: string; role: 'customer' | 'vendor' }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helpers
export const db = {
  // Profile operations
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        user_preferences(*),
        eco_stats(*),
        mood_profiles(*)
      `)
      .eq('id', userId)
      .maybeSingle();
    return { data, error };
  },

  updateProfile: async (userId: string, updates: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  // Product operations - Updated to handle products without vendor_id
  getProducts: async (filters?: any) => {
    let query = supabase
      .from('products')
      .select(`
        *,
        product_esg_metadata(*),
        product_transparency_index(*),
        profiles!products_vendor_id_fkey(name)
      `)
      .eq('is_active', true);

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.mood) {
      query = query.contains('mood_tags', [filters.mood]);
    }

    const { data, error } = await query;
    
    // Transform the data to match our frontend types
    if (data) {
      const transformedData = data.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url || '',
        description: product.description || '',
        category: product.category,
        mood: Array.isArray(product.mood_tags) ? product.mood_tags : [],
        vendorId: product.vendor_id || '',
        stylingTips: Array.isArray(product.styling_tips) ? product.styling_tips : [],
        pairsWith: Array.isArray(product.pairs_with) ? product.pairs_with : [],
        aiGeneratedTips: Array.isArray(product.ai_generated_tips) ? product.ai_generated_tips : [],
        esgMetadata: product.product_esg_metadata?.[0] ? {
          carbonFootprint: product.product_esg_metadata[0].carbon_footprint,
          waterUsage: product.product_esg_metadata[0].water_usage,
          region: product.product_esg_metadata[0].region,
          sustainabilityScore: product.product_esg_metadata[0].sustainability_score,
          materials: Array.isArray(product.product_esg_metadata[0].materials) ? product.product_esg_metadata[0].materials : [],
          certifications: Array.isArray(product.product_esg_metadata[0].certifications) ? product.product_esg_metadata[0].certifications : [],
          supplyChain: {
            ethicsRating: product.product_esg_metadata[0].ethics_rating,
            laborPractices: 'Fair wages, safe working conditions',
            fairTrade: product.product_esg_metadata[0].fair_trade,
            localSourcing: product.product_esg_metadata[0].local_sourcing,
            transparencyLevel: product.product_esg_metadata[0].transparency_level as 'high' | 'medium' | 'low',
            auditDate: product.product_esg_metadata[0].audit_date || '',
            certifyingBody: 'Third-party auditor'
          }
        } : {
          carbonFootprint: 0,
          waterUsage: 0,
          region: '',
          sustainabilityScore: 0,
          materials: [],
          certifications: [],
          supplyChain: {
            ethicsRating: 0,
            laborPractices: '',
            fairTrade: false,
            localSourcing: false,
            transparencyLevel: 'low' as const,
            auditDate: '',
            certifyingBody: ''
          }
        },
        transparencyIndex: product.product_transparency_index?.[0] ? {
          overall: product.product_transparency_index[0].overall_score,
          carbon: {
            score: product.product_transparency_index[0].carbon_score,
            verified: product.product_transparency_index[0].carbon_verified,
            methodology: product.product_transparency_index[0].carbon_methodology || '',
            lastUpdated: product.created_at
          },
          water: {
            score: product.product_transparency_index[0].water_score,
            verified: product.product_transparency_index[0].water_verified,
            methodology: product.product_transparency_index[0].water_methodology || '',
            lastUpdated: product.created_at
          },
          ethics: {
            score: product.product_transparency_index[0].ethics_score,
            verified: product.product_transparency_index[0].ethics_verified,
            lastAudit: product.product_transparency_index[0].ethics_audit_date || product.created_at
          },
          region: {
            score: product.product_transparency_index[0].region_score,
            verified: product.product_transparency_index[0].region_verified,
            traceability: product.product_transparency_index[0].region_traceability || '',
            documentation: ['Origin certificate', 'Transport logs']
          }
        } : {
          overall: 0,
          carbon: { score: 0, verified: false, methodology: '', lastUpdated: '' },
          water: { score: 0, verified: false, methodology: '', lastUpdated: '' },
          ethics: { score: 0, verified: false, lastAudit: '' },
          region: { score: 0, verified: false, traceability: '', documentation: [] }
        }
      }));
      
      return { data: transformedData, error };
    }
    
    return { data, error };
  },

  getProduct: async (productId: string) => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_esg_metadata(*),
        product_transparency_index(*),
        profiles!products_vendor_id_fkey(name)
      `)
      .eq('id', productId)
      .single();
    return { data, error };
  },

  // Vendor operations
  createProduct: async (productData: any) => {
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();
    return { data, error };
  },

  updateProduct: async (productId: string, updates: any) => {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select()
      .single();
    return { data, error };
  },

  getVendorProducts: async (vendorId: string) => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_esg_metadata(*),
        product_transparency_index(*)
      `)
      .eq('vendor_id', vendorId);
    return { data, error };
  },

  // Wishlist operations
  getWishlist: async (userId: string) => {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select(`
        *,
        products(
          *,
          product_esg_metadata(*),
          product_transparency_index(*)
        )
      `)
      .eq('user_id', userId);
    return { data, error };
  },

  addToWishlist: async (userId: string, productId: string, mood: string, occasion?: string, notes?: string) => {
    const { data, error } = await supabase
      .from('wishlist_items')
      .insert({
        user_id: userId,
        product_id: productId,
        mood,
        occasion,
        notes
      })
      .select()
      .single();
    return { data, error };
  },

  removeFromWishlist: async (userId: string, productId: string) => {
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    return { error };
  },

  // Wardrobe operations
  getWardrobe: async (userId: string) => {
    const { data, error } = await supabase
      .from('wardrobe_items')
      .select('*')
      .eq('user_id', userId);
    return { data, error };
  },

  addWardrobeItem: async (userId: string, itemData: any) => {
    const { data, error } = await supabase
      .from('wardrobe_items')
      .insert({
        user_id: userId,
        ...itemData
      })
      .select()
      .single();
    return { data, error };
  },

  updateWardrobeItem: async (itemId: string, updates: any) => {
    const { data, error } = await supabase
      .from('wardrobe_items')
      .update(updates)
      .eq('id', itemId)
      .select()
      .single();
    return { data, error };
  },

  deleteWardrobeItem: async (itemId: string) => {
    const { error } = await supabase
      .from('wardrobe_items')
      .delete()
      .eq('id', itemId);
    return { error };
  },

  // Cart operations
  getCart: async (userId: string) => {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products(
          *,
          product_esg_metadata(*),
          product_transparency_index(*)
        )
      `)
      .eq('user_id', userId);
    return { data, error };
  },

  addToCart: async (userId: string, productId: string, quantity: number = 1) => {
    const { data, error } = await supabase
      .from('cart_items')
      .upsert({
        user_id: userId,
        product_id: productId,
        quantity
      })
      .select()
      .single();
    return { data, error };
  },

  updateCartItem: async (userId: string, productId: string, quantity: number) => {
    if (quantity <= 0) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);
      return { error };
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('user_id', userId)
      .eq('product_id', productId)
      .select()
      .single();
    return { data, error };
  },

  removeFromCart: async (userId: string, productId: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    return { error };
  },

  clearCart: async (userId: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);
    return { error };
  },

  // Order operations
  createOrder: async (orderData: any) => {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();
    return { data, error };
  },

  getUserOrders: async (userId: string) => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          products(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Mood operations
  addMoodEntry: async (userId: string, mood: string, confidence: number, context?: string) => {
    const { data, error } = await supabase
      .from('mood_history')
      .insert({
        user_id: userId,
        mood,
        confidence,
        context
      })
      .select()
      .single();
    return { data, error };
  },

  getMoodHistory: async (userId: string, limit: number = 50) => {
    const { data, error } = await supabase
      .from('mood_history')
      .select('*')
      .eq('user_id', userId)
      .order('detected_at', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  // Preferences operations
  updatePreferences: async (userId: string, preferences: any) => {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        ...preferences
      })
      .select()
      .single();
    return { data, error };
  },

  // Eco stats operations
  updateEcoStats: async (userId: string, stats: any) => {
    const { data, error } = await supabase
      .from('eco_stats')
      .upsert({
        user_id: userId,
        ...stats
      })
      .select()
      .single();
    return { data, error };
  }
};