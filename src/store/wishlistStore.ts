import { create } from 'zustand';
import { WishlistItem, Product } from '../types';

interface WishlistState {
  items: WishlistItem[];
  addToWishlist: (product: Product, mood: string, occasion?: string, notes?: string) => void;
  removeFromWishlist: (itemId: string) => void;
  getItemsByMood: (mood: string) => WishlistItem[];
  updateWishlistItem: (itemId: string, updates: Partial<WishlistItem>) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],

  addToWishlist: (product: Product, mood: string, occasion?: string, notes?: string) => {
    const newItem: WishlistItem = {
      id: Date.now().toString(),
      product,
      mood,
      occasion,
      notes,
      dateAdded: new Date().toISOString()
    };

    set(state => ({
      items: [...state.items, newItem]
    }));
  },

  removeFromWishlist: (itemId: string) => {
    set(state => ({
      items: state.items.filter(item => item.id !== itemId)
    }));
  },

  getItemsByMood: (mood: string) => {
    return get().items.filter(item => item.mood === mood);
  },

  updateWishlistItem: (itemId: string, updates: Partial<WishlistItem>) => {
    set(state => ({
      items: state.items.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    }));
  },

  clearWishlist: () => {
    set({ items: [] });
  }
}));