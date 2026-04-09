export type ProductCategory =
  | 'mobility'
  | 'monitoring'
  | 'respiratory'
  | 'diagnostics'
  | 'rehab'
  | 'consumables';

export type Product = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category: ProductCategory;
  brand: string;
  shortDescription: string;
  description: string;
  price: number;
  stock: number;
  requiresPrescription: boolean;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  certifications: ('FDA' | 'CE')[];
};

export type CartItem = {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
  requiresPrescription: boolean;
};

export type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  defaultAddress?: string;
  isAdmin: boolean;
};

export type Order = {
  id: string;
  customerId: string;
  items: CartItem[];
  shippingAddress: {
    fullName: string;
    email: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'card';
  prescriptionAcknowledged: boolean;
  createdAt: string;
};
