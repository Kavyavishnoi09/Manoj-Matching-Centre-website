import mongoose, { Schema, type Document } from 'mongoose';

export interface IBusinessSettings extends Document {
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

const businessSettingsSchema = new Schema<IBusinessSettings>(
  {
    businessName: { type: String, required: true, default: 'Manoj Matching Centre' },
    phone: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    mapUrl: { type: String, default: '' },
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    businessHours: { type: String, default: '' },
    aboutText: { type: String, default: '' },
    deliveryCharge: { type: Number, default: 50 },
    freeDeliveryThreshold: { type: Number, default: 1000 },
  },
  { timestamps: true }
);

export const BusinessSettings = mongoose.model<IBusinessSettings>(
  'BusinessSettings',
  businessSettingsSchema
);
