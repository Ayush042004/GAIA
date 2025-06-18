import { create } from 'zustand';
import { User } from '../types';
import { auth, db } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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
  isLoading: true,
  
  login: async (email: string, password: string) => {
    try {
      const { data, error } = await auth.signIn(email, password);
      
      if (error) throw error;
      
      if (data.user) {
        // Wait a moment for any triggers to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Fetch full profile data
        const { data: profile, error: profileError } = await db.getProfile(data.user.id);
        
        if (profileError) {
          console.error('Profile fetch error:', profileError);
          // If profile doesn't exist, create a basic user object
          const basicUser: User = {
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
            role: 'customer',
            preferences: {
              darkMode: false,
              notifications: true,
              shareEcoImpact: true
            }
          };
          
          set({ 
            user: basicUser, 
            isAuthenticated: true,
            isLoading: false
          });
          return;
        }
        
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
              } : {
                treesPlanted: 0,
                carbonReduced: 0,
                waterSaved: 0,
                totalEcoCredits: 0,
                monthlyImpact: [],
                impactZones: []
              },
              moodProfile: profile.mood_profiles?.[0] ? {
                dominant: profile.mood_profiles[0].dominant_mood || 'casual',
                distribution: profile.mood_profiles[0].mood_distribution || {},
                personality: profile.mood_profiles[0].personality || [],
                preferences: profile.mood_profiles[0].preferences || [],
                spendingByMood: profile.mood_profiles[0].spending_by_mood || {},
                moodHistory: []
              } : {
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
            isAuthenticated: true,
            isLoading: false
          });
        }
      }
    } catch (error: any) {
      set({ isLoading: false });
      throw new Error(error.message || 'Login failed');
    }
  },
  
  logout: async () => {
    try {
      set({ isLoading: true });
      
      // Sign out from Supabase
      const { error } = await auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      
      // Clear the auth state immediately
      set({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false
      });
      
      // Clear any local storage or session data
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
      // Show success message
      toast.success('Logged out successfully');
      
      // Force a page reload to ensure clean state
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
      
    } catch (error: any) {
      console.error('Logout failed:', error);
      set({ isLoading: false });
      
      // Even if logout fails, clear local state
      set({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false
      });
      
      toast.error('Logout failed, but you have been signed out locally');
      
      // Force redirect anyway
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    }
  },
  
  signup: async (email: string, password: string, name: string, role: 'customer' | 'vendor') => {
    try {
      const { data, error } = await auth.signUp(email, password, { name, role });
      
      if (error) throw error;
      
      if (data.user) {
        // Wait longer for the trigger to complete
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Try to fetch the created profile
        const { data: profile, error: profileError } = await db.getProfile(data.user.id);
        
        let user: User;
        
        if (profileError || !profile) {
          // If profile creation failed, create a basic user object
          user = {
            id: data.user.id,
            email: data.user.email || '',
            name: name,
            role: role,
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
        } else {
          user = {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role,
            preferences: {
              darkMode: profile.user_preferences?.[0]?.dark_mode || false,
              currentMood: profile.user_preferences?.[0]?.current_mood || undefined,
              notifications: profile.user_preferences?.[0]?.notifications || true,
              shareEcoImpact: profile.user_preferences?.[0]?.share_eco_impact || true
            },
            ...(role === 'customer' && {
              ecoStats: profile.eco_stats?.[0] ? {
                treesPlanted: profile.eco_stats[0].trees_planted,
                carbonReduced: profile.eco_stats[0].carbon_reduced,
                waterSaved: profile.eco_stats[0].water_saved,
                totalEcoCredits: profile.eco_stats[0].total_eco_credits,
                monthlyImpact: [],
                impactZones: []
              } : {
                treesPlanted: 0,
                carbonReduced: 0,
                waterSaved: 0,
                totalEcoCredits: 0,
                monthlyImpact: [],
                impactZones: []
              },
              moodProfile: profile.mood_profiles?.[0] ? {
                dominant: profile.mood_profiles[0].dominant_mood || 'casual',
                distribution: profile.mood_profiles[0].mood_distribution || {},
                personality: profile.mood_profiles[0].personality || [],
                preferences: profile.mood_profiles[0].preferences || [],
                spendingByMood: profile.mood_profiles[0].spending_by_mood || {},
                moodHistory: []
              } : {
                dominant: 'casual',
                distribution: { casual: 100 },
                personality: [],
                preferences: [],
                spendingByMood: {},
                moodHistory: []
              }
            })
          };
        }
        
        set({ 
          user, 
          isAuthenticated: true,
          isLoading: false
        });
      }
    } catch (error: any) {
      set({ isLoading: false });
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
              } : {
                treesPlanted: 0,
                carbonReduced: 0,
                waterSaved: 0,
                totalEcoCredits: 0,
                monthlyImpact: [],
                impactZones: []
              },
              moodProfile: profile.mood_profiles?.[0] ? {
                dominant: profile.mood_profiles[0].dominant_mood || 'casual',
                distribution: profile.mood_profiles[0].mood_distribution || {},
                personality: profile.mood_profiles[0].personality || [],
                preferences: profile.mood_profiles[0].preferences || [],
                spendingByMood: profile.mood_profiles[0].spending_by_mood || {},
                moodHistory: []
              } : {
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
            user: userData, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } else {
          // If profile doesn't exist but user is authenticated, create basic user
          const basicUser: User = {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            role: 'customer',
            preferences: {
              darkMode: false,
              notifications: true,
              shareEcoImpact: true
            }
          };
          
          set({ 
            user: basicUser, 
            isAuthenticated: true, 
            isLoading: false 
          });
        }
      } else {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
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
            } : {
              treesPlanted: 0,
              carbonReduced: 0,
              waterSaved: 0,
              totalEcoCredits: 0,
              monthlyImpact: [],
              impactZones: []
            },
            moodProfile: profile.mood_profiles?.[0] ? {
              dominant: profile.mood_profiles[0].dominant_mood || 'casual',
              distribution: profile.mood_profiles[0].mood_distribution || {},
              personality: profile.mood_profiles[0].personality || [],
              preferences: profile.mood_profiles[0].preferences || [],
              spendingByMood: profile.mood_profiles[0].spending_by_mood || {},
              moodHistory: []
            } : {
              dominant: 'casual',
              distribution: { casual: 100 },
              personality: [],
              preferences: [],
              spendingByMood: {},
              moodHistory: []
            }
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
  const { initializeAuth, logout } = useAuthStore.getState();
  
  if (event === 'SIGNED_OUT') {
    // Clear state immediately when signed out
    useAuthStore.setState({ 
      user: null, 
      isAuthenticated: false, 
      isLoading: false 
    });
  } else if (event === 'SIGNED_IN' && session) {
    // Re-initialize auth when user signs in
    initializeAuth();
  }
});