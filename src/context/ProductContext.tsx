import { createContext, useContext, useState, type ReactNode } from 'react';
import { seedProducts } from '../data/products';
import { seedCustomers } from '../data/users';
import type { Order, Product } from '../types/models';

type ProductContextValue = {
  products: Product[];
  orders: Order[];
  customers: typeof seedCustomers;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  upsertProduct: (product: Product) => void;
};

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState(seedProducts);
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = (order: Order) => setOrders((prev) => [order, ...prev]);
  const updateOrderStatus = (orderId: string, status: Order['status']) =>
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  const upsertProduct = (product: Product) =>
    setProducts((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (!existing) return [product, ...prev];
      return prev.map((p) => (p.id === product.id ? product : p));
    });

  return (
    <ProductContext.Provider
      value={{ products, orders, customers: seedCustomers, addOrder, updateOrderStatus, upsertProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProductContext() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProductContext must be used within ProductProvider');
  return context;
}
