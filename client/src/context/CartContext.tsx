import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { CartItem, Product } from '@/types';

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue>({
  items: [], addItem: () => {}, removeItem: () => {}, updateQuantity: () => {},
  clearCart: () => {}, totalItems: 0, subtotal: 0,
});

const STORAGE_KEY = 'mmc_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); if (s) setItems(JSON.parse(s)); } catch {}
  }, []);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);

  const addItem = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product._id === product._id);
      if (existing) {
        const maxQty = product.stock > 0 ? product.stock : 1;
        const newQty = Math.min(existing.quantity + quantity, maxQty);
        return prev.map((i) => i.product._id === product._id ? { ...i, quantity: newQty } : i);
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock > 0 ? product.stock : 1) }];
    });
  };

  const removeItem = (productId: string) => setItems((prev) => prev.filter((i) => i.product._id !== productId));

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) => prev.map((i) => {
      if (i.product._id !== productId) return i;
      const maxQty = i.product.stock > 0 ? i.product.stock : 1;
      return { ...i, quantity: Math.max(1, Math.min(quantity, maxQty)) };
    }));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => {
    const price = i.product.discountPrice ?? i.product.price;
    return s + price * i.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() { return useContext(CartContext); }
