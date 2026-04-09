import type { CartItem } from '../types/models';

export const calculateOrderTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shipping = subtotal > 250 ? 0 : 12;
  const tax = subtotal * 0.06;
  return { subtotal, shipping, tax, total: subtotal + shipping + tax };
};
