import { create } from 'zustand';
import { WardrobeItem, WardrobeCategory } from '../types';

interface WardrobeState {
  items: WardrobeItem[];
  addItem: (item: WardrobeItem) => void;
  removeItem: (itemId: string) => void;
  updateItem: (itemId: string, updates: Partial<WardrobeItem>) => void;
  getItemsByCategory: (category: WardrobeCategory) => WardrobeItem[];
  getItemsByMood: (mood: string) => WardrobeItem[];
  getItemsByColor: (color: string) => WardrobeItem[];
  generateOutfitRecommendations: (occasion?: string, mood?: string) => WardrobeItem[][];
  incrementWearCount: (itemId: string) => void;
  addToOutfitHistory: (items: WardrobeItem[], occasion: string) => void;
}

export const useWardrobeStore = create<WardrobeState>((set, get) => ({
  items: [],

  addItem: (item: WardrobeItem) => {
    set(state => ({
      items: [...state.items, item]
    }));
  },

  removeItem: (itemId: string) => {
    set(state => ({
      items: state.items.filter(item => item.id !== itemId)
    }));
  },

  updateItem: (itemId: string, updates: Partial<WardrobeItem>) => {
    set(state => ({
      items: state.items.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    }));
  },

  getItemsByCategory: (category: WardrobeCategory) => {
    return get().items.filter(item => item.category === category);
  },

  getItemsByMood: (mood: string) => {
    return get().items.filter(item => item.mood.includes(mood));
  },

  getItemsByColor: (color: string) => {
    return get().items.filter(item => item.color.toLowerCase() === color.toLowerCase());
  },

  generateOutfitRecommendations: (occasion?: string, mood?: string) => {
    const items = get().items;
    const outfits: WardrobeItem[][] = [];

    // Simple algorithm to generate outfit combinations
    const tops = items.filter(item => item.category === 'tops');
    const bottoms = items.filter(item => item.category === 'bottoms');
    const shoes = items.filter(item => item.category === 'shoes');
    const accessories = items.filter(item => item.category === 'accessories');

    // Generate up to 5 outfit combinations
    for (let i = 0; i < Math.min(5, tops.length); i++) {
      const outfit: WardrobeItem[] = [];
      
      if (tops[i]) outfit.push(tops[i]);
      if (bottoms[i % bottoms.length]) outfit.push(bottoms[i % bottoms.length]);
      if (shoes[i % shoes.length]) outfit.push(shoes[i % shoes.length]);
      if (accessories[i % accessories.length]) outfit.push(accessories[i % accessories.length]);

      if (outfit.length >= 2) {
        outfits.push(outfit);
      }
    }

    return outfits;
  },

  incrementWearCount: (itemId: string) => {
    set(state => ({
      items: state.items.map(item =>
        item.id === itemId 
          ? { 
              ...item, 
              wearCount: item.wearCount + 1,
              lastWorn: new Date().toISOString()
            } 
          : item
      )
    }));
  },

  addToOutfitHistory: (items: WardrobeItem[], occasion: string) => {
    // This would typically save to a separate outfit history store
    items.forEach(item => {
      get().incrementWearCount(item.id);
    });
  }
}));