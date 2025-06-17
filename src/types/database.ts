export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'customer' | 'vendor';
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          role?: 'customer' | 'vendor';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'customer' | 'vendor';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          dark_mode: boolean;
          current_mood: string | null;
          notifications: boolean;
          share_eco_impact: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          dark_mode?: boolean;
          current_mood?: string | null;
          notifications?: boolean;
          share_eco_impact?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          dark_mode?: boolean;
          current_mood?: string | null;
          notifications?: boolean;
          share_eco_impact?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      eco_stats: {
        Row: {
          id: string;
          user_id: string;
          trees_planted: number;
          carbon_reduced: number;
          water_saved: number;
          total_eco_credits: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          trees_planted?: number;
          carbon_reduced?: number;
          water_saved?: number;
          total_eco_credits?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          trees_planted?: number;
          carbon_reduced?: number;
          water_saved?: number;
          total_eco_credits?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          vendor_id: string;
          name: string;
          description: string | null;
          price: number;
          image_url: string | null;
          category: string;
          mood_tags: string[];
          styling_tips: string[];
          pairs_with: string[];
          ai_generated_tips: string[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vendor_id: string;
          name: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          category: string;
          mood_tags?: string[];
          styling_tips?: string[];
          pairs_with?: string[];
          ai_generated_tips?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          vendor_id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          image_url?: string | null;
          category?: string;
          mood_tags?: string[];
          styling_tips?: string[];
          pairs_with?: string[];
          ai_generated_tips?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_esg_metadata: {
        Row: {
          id: string;
          product_id: string;
          carbon_footprint: number;
          water_usage: number;
          region: string;
          sustainability_score: number;
          materials: string[];
          certifications: string[];
          ethics_rating: number;
          fair_trade: boolean;
          local_sourcing: boolean;
          transparency_level: string;
          audit_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          carbon_footprint: number;
          water_usage: number;
          region: string;
          sustainability_score: number;
          materials?: string[];
          certifications?: string[];
          ethics_rating?: number;
          fair_trade?: boolean;
          local_sourcing?: boolean;
          transparency_level?: string;
          audit_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          carbon_footprint?: number;
          water_usage?: number;
          region?: string;
          sustainability_score?: number;
          materials?: string[];
          certifications?: string[];
          ethics_rating?: number;
          fair_trade?: boolean;
          local_sourcing?: boolean;
          transparency_level?: string;
          audit_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_transparency_index: {
        Row: {
          id: string;
          product_id: string;
          overall_score: number;
          carbon_score: number;
          carbon_verified: boolean;
          carbon_methodology: string | null;
          water_score: number;
          water_verified: boolean;
          water_methodology: string | null;
          ethics_score: number;
          ethics_verified: boolean;
          ethics_audit_date: string | null;
          region_score: number;
          region_verified: boolean;
          region_traceability: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          overall_score: number;
          carbon_score: number;
          carbon_verified?: boolean;
          carbon_methodology?: string | null;
          water_score: number;
          water_verified?: boolean;
          water_methodology?: string | null;
          ethics_score: number;
          ethics_verified?: boolean;
          ethics_audit_date?: string | null;
          region_score: number;
          region_verified?: boolean;
          region_traceability?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          overall_score?: number;
          carbon_score?: number;
          carbon_verified?: boolean;
          carbon_methodology?: string | null;
          water_score?: number;
          water_verified?: boolean;
          water_methodology?: string | null;
          ethics_score?: number;
          ethics_verified?: boolean;
          ethics_audit_date?: string | null;
          region_score?: number;
          region_verified?: boolean;
          region_traceability?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      wishlist_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          mood: string;
          occasion: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          mood: string;
          occasion?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          mood?: string;
          occasion?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      wardrobe_items: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: string;
          color: string;
          brand: string;
          style: string;
          season: string;
          image_url: string | null;
          wear_count: number;
          last_worn: string | null;
          tags: string[];
          mood_tags: string[];
          price: number | null;
          purchase_date: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          category: string;
          color: string;
          brand: string;
          style: string;
          season: string;
          image_url?: string | null;
          wear_count?: number;
          last_worn?: string | null;
          tags?: string[];
          mood_tags?: string[];
          price?: number | null;
          purchase_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          category?: string;
          color?: string;
          brand?: string;
          style?: string;
          season?: string;
          image_url?: string | null;
          wear_count?: number;
          last_worn?: string | null;
          tags?: string[];
          mood_tags?: string[];
          price?: number | null;
          purchase_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          quantity: number;
          selected_size: string | null;
          selected_color: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          quantity?: number;
          selected_size?: string | null;
          selected_color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          quantity?: number;
          selected_size?: string | null;
          selected_color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          total_amount: number;
          status: string;
          emotion: string | null;
          occasion: string | null;
          shared_on_social: boolean;
          eco_impact: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total_amount: number;
          status?: string;
          emotion?: string | null;
          occasion?: string | null;
          shared_on_social?: boolean;
          eco_impact?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          total_amount?: number;
          status?: string;
          emotion?: string | null;
          occasion?: string | null;
          shared_on_social?: boolean;
          eco_impact?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      mood_history: {
        Row: {
          id: string;
          user_id: string;
          mood: string;
          confidence: number;
          context: string | null;
          detected_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          mood: string;
          confidence: number;
          context?: string | null;
          detected_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          mood?: string;
          confidence?: number;
          context?: string | null;
          detected_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: 'customer' | 'vendor';
      impact_zone_type: 'forest' | 'coral' | 'mangrove' | 'ocean';
    };
  };
}