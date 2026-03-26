import mongoose, { Schema, Types } from 'mongoose';

export interface INewsletterCampaign {
  title: string;
  subject: string;
  content: string;
  sentBy: Types.ObjectId;
  recipientCount: number;
  successCount: number;
  failedCount: number;
  status: 'SENT' | 'PARTIAL';
}

const NewsletterCampaignSchema = new Schema<INewsletterCampaign>(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipientCount: { type: Number, required: true, default: 0 },
    successCount: { type: Number, required: true, default: 0 },
    failedCount: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ['SENT', 'PARTIAL'], default: 'SENT' },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const NewsletterCampaign = mongoose.model<INewsletterCampaign>(
  'NewsletterCampaign',
  NewsletterCampaignSchema
);

export default NewsletterCampaign;
