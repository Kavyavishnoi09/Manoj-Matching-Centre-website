import mongoose, { Schema, type Document, type Types } from 'mongoose';

export interface IProductImage {
  url: string;
  publicId: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  category: Types.ObjectId | null;
  description: string;
  fabricType: string;
  material: string;
  colors: string[];
  pattern: string;
  width: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  stockStatus: 'in_stock' | 'out_of_stock' | 'made_to_order';
  images: IProductImage[];
  featured: boolean;
  newArrival: boolean;
  active: boolean;
  popularity: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    description: { type: String, default: '' },
    fabricType: { type: String, default: '' },
    material: { type: String, default: '' },
    colors: { type: [String], default: [] },
    pattern: { type: String, default: '' },
    width: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: null, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    stockStatus: {
      type: String,
      enum: ['in_stock', 'out_of_stock', 'made_to_order'],
      default: 'in_stock',
    },
    images: {
      type: [
        {
          url: { type: String, required: true },
          publicId: { type: String, required: true },
        },
      ],
      default: [],
    },
    featured: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    popularity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', fabricType: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ newArrival: 1 });
productSchema.index({ price: 1 });

export const Product = mongoose.model<IProduct>('Product', productSchema);
