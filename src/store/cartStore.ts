import { create } from 'zustand';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  
  addItem: (product: Product) => {
    const items = get().items;
    const existingItem = items.find(item => item.product.id === product.id);
    
    if (existingItem) {
      set({
        items: items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      });
    } else {
      set({
        items: [...items, { product, quantity: 1 }]
      });
    }
  },
  
  removeItem: (productId: string) => {
    set({
      items: get().items.filter(item => item.product.id !== productId)
    });
  },
  
  updateQuantity: (productId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    
    set({
      items: get().items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    });
  },
  
  clearCart: () => {
    set({ items: [] });
  },
  
  toggleCart: () => {
    set({ isOpen: !get().isOpen });
  },
  
  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  },
  
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  }
}));