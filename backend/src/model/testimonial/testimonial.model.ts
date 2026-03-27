import mongoose, { Document, Schema } from 'mongoose';

export enum TestimonialStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface ITestimonial extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  location?: string;
  title?: string;
  review: string;
  rating: number;
  status: TestimonialStatus;
  approvedAt?: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    location: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    review: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    status: {
      type: String,
      enum: Object.values(TestimonialStatus),
      default: TestimonialStatus.PENDING,
    },
    approvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
