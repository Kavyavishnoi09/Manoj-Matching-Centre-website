export type Role = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  role: Role;
  active?: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  url: string;
  publicId: string;
}

export type StockStatus = 'in_stock' | 'out_of_stock' | 'made_to_order';

export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: Category | string | null;
  description: string;
  fabricType: string;
  material: string;
  colors: string[];
  pattern: string;
  width: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  stockStatus: StockStatus;
  images: ProductImage[];
  featured: boolean;
  newArrival: boolean;
  active: boolean;
  popularity: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: string;
  productName: string;
  image: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'online';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  _id: string;
  orderNumber: string;
  customer: string | { _id: string; name: string; email: string; phone: string };
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  shippingAddress: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessSettings {
  _id: string;
  businessName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapUrl: string;
  instagram: string;
  facebook: string;
  businessHours: string;
  aboutText: string;
  deliveryCharge: number;
  freeDeliveryThreshold: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
