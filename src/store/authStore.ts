import { create } from 'zustand';
import { User } from '../types';
import { auth, db } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string, role: 'customer' | 'vendor') => Promise<void>;
  updateUserPreferences: (preferences: Partial<User['preferences']>) => void;
  toggleDarkMode: () => void;
  setCurrentMood: (mood: string) => void;
  initializeAuth: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false, // Changed from true to false initially
  
  login: async (email: string, password: string) => {
    try {
      const { data, error } = await auth.signIn(email, password);
      
      if (error) throw error;
      
      if (data.user) {
        // Fetch full profile data
        const { data: profile, error: profileError } = await db.getProfile(data.user.id);
        
        if (profileError) throw profileError;
        
        if (profile) {
          const user: User = {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role,
            avatar: profile.avatar_url || undefined,
            preferences: {
              darkMode: profile.user_preferences?.[0]?.dark_mode || false,
              currentMood: profile.user_preferences?.[0]?.current_mood || undefined,
              notifications: profile.user_preferences?.[0]?.notifications || true,
              shareEcoImpact: profile.user_preferences?.[0]?.share_eco_impact || true
            },
            ...(profile.role === 'customer' && {
              ecoStats: profile.eco_stats?.[0] ? {
                treesPlanted: profile.eco_stats[0].trees_planted,
                carbonReduced: profile.eco_stats[0].carbon_reduced,
                waterSaved: profile.eco_stats[0].water_saved,
                totalEcoCredits: profile.eco_stats[0].total_eco_credits,
                monthlyImpact: [],
                impactZones: []
              } : undefined,
              moodProfile: profile.mood_profiles?.[0] ? {
                dominant: profile.mood_profiles[0].dominant_mood || 'casual',
                distribution: profile.mood_profiles[0].mood_distribution || {},
                personality: profile.mood_profiles[0].personality || [],
                preferences: profile.mood_profiles[0].preferences || [],
                spendingByMood: profile.mood_profiles[0].spending_by_mood || {},
                moodHistory: []
              } : undefined
            })
          };
          
          set({ 
            user, 
            isAuthenticated: true
          });
        }
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  },
  
  logout: async () => {
    try {
      await auth.signOut();
      set({ 
        user: null, 
        isAuthenticated: false 
      });
    } catch (error: any) {
      toast.error('Logout failed');
    }
  },
  
  signup: async (email: string, password: string, name: string, role: 'customer' | 'vendor') => {
    try {
      const { data, error } = await auth.signUp(email, password, { name, role });
      
      if (error) throw error;
      
      if (data.user) {
        // The trigger will create the profile automatically
        // Wait a moment for the trigger to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Fetch the created profile
        const { data: profile, error: profileError } = await db.getProfile(data.user.id);
        
        if (profileError) throw profileError;
        
        if (profile) {
          const user: User = {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role,
            preferences: {
              darkMode: false,
              notifications: true,
              shareEcoImpact: true
            },
            ...(role === 'customer' && {
              ecoStats: {
                treesPlanted: 0,
                carbonReduced: 0,
                waterSaved: 0,
                totalEcoCredits: 0,
                monthlyImpact: [],
                impactZones: []
              },
              moodProfile: {
                dominant: 'casual',
                distribution: { casual: 100 },
                personality: [],
                preferences: [],
                spendingByMood: {},
                moodHistory: []
              }
            })
          };
          
          set({ 
            user, 
            isAuthenticated: true
          });
        }
      }
    } catch (error: any) {
      throw new Error(error.message || 'Signup failed');
    }
  },

  updateUserPreferences: async (preferences) => {
    const user = get().user;
    if (!user) return;

    try {
      await db.updatePreferences(user.id, preferences);
      
      set({
        user: {
          ...user,
          preferences: {
            ...user.preferences,
            ...preferences
          }
        }
      });
    } catch (error: any) {
      toast.error('Failed to update preferences');
    }
  },

  toggleDarkMode: () => {
    const user = get().user;
    if (user?.preferences) {
      get().updateUserPreferences({ dark_mode: !user.preferences.darkMode });
    }
  },

  setCurrentMood: (mood: string) => {
    get().updateUserPreferences({ current_mood: mood });
  },

  initializeAuth: async () => {
    set({ isLoading: true });
    
    try {
      const { user } = await auth.getCurrentUser();
      
      if (user) {
        const { data: profile, error } = await db.getProfile(user.id);
        
        if (!error && profile) {
          const userData: User = {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role,
            avatar: profile.avatar_url || undefined,
            preferences: {
              darkMode: profile.user_preferences?.[0]?.dark_mode || false,
              currentMood: profile.user_preferences?.[0]?.current_mood || undefined,
              notifications: profile.user_preferences?.[0]?.notifications || true,
              shareEcoImpact: profile.user_preferences?.[0]?.share_eco_impact || true
            },
            ...(profile.role === 'customer' && {
              ecoStats: profile.eco_stats?.[0] ? {
                treesPlanted: profile.eco_stats[0].trees_planted,
                carbonReduced: profile.eco_stats[0].carbon_reduced,
                waterSaved: profile.eco_stats[0].water_saved,
                totalEcoCredits: profile.eco_stats[0].total_eco_credits,
                monthlyImpact: [],
                impactZones: []
              } : undefined,
              moodProfile: profile.mood_profiles?.[0] ? {
                dominant: profile.mood_profiles[0].dominant_mood || 'casual',
                distribution: profile.mood_profiles[0].mood_distribution || {},
                personality: profile.mood_profiles[0].personality || [],
                preferences: profile.mood_profiles[0].preferences || [],
                spendingByMood: profile.mood_profiles[0].spending_by_mood || {},
                moodHistory: []
              } : undefined
            })
          };
          
          set({ 
            user: userData, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } else {
          set({ isLoading: false });
        }
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },

  refreshUser: async () => {
    const currentUser = get().user;
    if (!currentUser) return;

    try {
      const { data: profile, error } = await db.getProfile(currentUser.id);
      
      if (!error && profile) {
        const userData: User = {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: profile.role,
          avatar: profile.avatar_url || undefined,
          preferences: {
            darkMode: profile.user_preferences?.[0]?.dark_mode || false,
            currentMood: profile.user_preferences?.[0]?.current_mood || undefined,
            notifications: profile.user_preferences?.[0]?.notifications || true,
            shareEcoImpact: profile.user_preferences?.[0]?.share_eco_impact || true
          },
          ...(profile.role === 'customer' && {
            ecoStats: profile.eco_stats?.[0] ? {
              treesPlanted: profile.eco_stats[0].trees_planted,
              carbonReduced: profile.eco_stats[0].carbon_reduced,
              waterSaved: profile.eco_stats[0].water_saved,
              totalEcoCredits: profile.eco_stats[0].total_eco_credits,
              monthlyImpact: [],
              impactZones: []
            } : undefined,
            moodProfile: profile.mood_profiles?.[0] ? {
              dominant: profile.mood_profiles[0].dominant_mood || 'casual',
              distribution: profile.mood_profiles[0].mood_distribution || {},
              personality: profile.mood_profiles[0].personality || [],
              preferences: profile.mood_profiles[0].preferences || [],
              spendingByMood: profile.mood_profiles[0].spending_by_mood || {},
              moodHistory: []
            } : undefined
          })
        };
        
        set({ user: userData });
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }
}));

// Set up auth state listener
auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    useAuthStore.getState().logout();
  }
});