import mongoose, { Schema, type Document, type Types } from 'mongoose';

export interface IOrderItem {
  product: Types.ObjectId;
  productName: string;
  image: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  customer: Types.ObjectId;
  items: IOrderItem[];
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
  paymentMethod: 'cod' | 'online';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        productName: { type: String, required: true },
        image: { type: String, default: '' },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    subtotal: { type: Number, required: true, min: 0 },
    deliveryCharge: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, default: '' },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    paymentMethod: { type: String, enum: ['cod', 'online'], default: 'cod' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', orderSchema);
