import mongoose, { Schema, Types } from 'mongoose';

export interface Inewslatter {
  email: string;
  userId: Types.ObjectId;
  isActive: boolean;
}

const NewsLatterSchema = new Schema<Inewslatter>(
  {
    email: { type: String, required: true, unique: true, ref: 'User' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
  },

  { timestamps: true }
);

const NewsLatter = mongoose.model<Inewslatter>('NewsLatter', NewsLatterSchema);

export default NewsLatter;
