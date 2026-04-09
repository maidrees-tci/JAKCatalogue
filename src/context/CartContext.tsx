import { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { CartItem, Product } from '../types/models';

type CartContextValue = {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>('med-cart', []);

  const addToCart = (product: Product, quantity: number) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          unitPrice: product.price,
          quantity,
          imageUrl: product.imageUrl,
          requiresPrescription: product.requiresPrescription,
        },
      ];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return;
    setItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
    );
  };

  const removeItem = (productId: string) =>
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, addToCart, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCartContext must be used within CartProvider');
  return context;
}
