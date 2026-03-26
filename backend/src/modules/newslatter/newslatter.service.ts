// Import the model
import mongoose from 'mongoose';

import NewsletterCampaign, {
  INewsletterCampaign,
} from '../../../src/model/newslatter/newsletter-campaign.model';
import NewsLatter, { Inewslatter } from '../../../src/model/newslatter/newslatter.model';
import User from '../../../src/model/user/user.schema';
import SendEmail from '../../utils/email/send-email';
import { IdOrIdsInput, SearchQueryInput } from '../../handlers/common-zod-validator';
import {
  CreateNewslatterInput,
  SendNewsletterInput,
  UpdateNewslatterInput,
} from './newslatter.validation';

const buildNewsletterHtml = (title: string, content: string) => `
  <div style="margin:0;padding:32px 16px;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;">
      <tr>
        <td>
          <div style="background:#ffffff;border-radius:16px;padding:32px;box-shadow:0 12px 30px rgba(0,0,0,0.08);">
            <p style="margin:0 0 8px;color:#b91c1c;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
              Guaranteed Sport Picks
            </p>
            <h1 style="margin:0 0 16px;color:#111827;font-size:28px;line-height:1.2;">${title}</h1>
            <div style="color:#374151;font-size:15px;line-height:1.7;">
              ${content}
            </div>
            <div style="height:1px;background:#e5e7eb;margin:24px 0;"></div>
            <p style="margin:0;color:#6b7280;font-size:13px;">
              You are receiving this email because your newsletter subscription is active.
            </p>
          </div>
        </td>
      </tr>
    </table>
  </div>
`;

/**
 * Service function to create a new newslatter.
 *
 * @param {CreateNewslatterInput} data - The data to create a new newslatter.
 * @returns {Promise<Partial<IInewslatter>>} - The created newslatter.
 */
const createNewslatter = async (data: CreateNewslatterInput): Promise<Partial<Inewslatter>> => {
  const userExists = await User.findOne({ _id: data.userId });
  if (!userExists) {
    throw new Error('User not found');
  }

  const existingNewslatter = await NewsLatter.findOne({ userId: data.userId })
    .select('isActive')
    .lean();
  const requestedStatus = data.isActive;

  if (existingNewslatter) {
    if (requestedStatus !== undefined) {
      const updatedNewslatter = await NewsLatter.findOneAndUpdate(
        { userId: data.userId },
        { $set: { isActive: requestedStatus } },
        { new: true }
      );
      return updatedNewslatter as Partial<Inewslatter>;
    }
    // If no status provided and already exists, return existing
    return existingNewslatter;
  }

  const newNewslatter = new NewsLatter({
    ...data,
    userId: data.userId,
    isActive: requestedStatus ?? true,
  });
  const savedNewslatter = await newNewslatter.save();
  return savedNewslatter;
};

/**
 * Service function to update a single newslatter by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the newslatter to update.
 * @param {UpdateNewslatterInput} data - The updated data for the newslatter.
 * @returns {Promise<Partial<INewslatter>>} - The updated newslatter.
 */
const updateNewslatter = async (
  id: IdOrIdsInput['id'],
  data: UpdateNewslatterInput
): Promise<Partial<Inewslatter | null>> => {
  // Check for duplicate (filed) combination

  if (data.userId) {
    const userObjectId = new mongoose.Types.ObjectId(data.userId);
    const userExists = await User.exists({ _id: data.userId });
    if (!userExists) {
      throw new Error('User not found');
    }
  }

  const updatePayload = data.userId
    ? { ...data, userId: new mongoose.Types.ObjectId(data.userId) }
    : data;
  const requestedStatus = data.isActive;
  if (requestedStatus !== undefined) {
    const updatedStatus = await NewsLatter.findByIdAndUpdate(
      id,
      { $set: { isActive: requestedStatus } },
      { new: true }
    );
    return updatedStatus;
  }

  // Prevent duplicate updates

  // Proceed to update the newslatter
  const updatedNewslatter = await NewsLatter.findByIdAndUpdate(id, updatePayload, { new: true });
  return updatedNewslatter;
};

/**
 * Service function to delete a single newslatter by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the newslatter to delete.
 * @returns {Promise<Partial<INewslatter>>} - The deleted newslatter.
 */
const deleteNewslatter = async (id: IdOrIdsInput['id']): Promise<Partial<Inewslatter | null>> => {
  const deletedNewslatter = await NewsLatter.findByIdAndDelete(id);
  return deletedNewslatter;
};

/**
 * Service function to retrieve a single newslatter by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the newslatter to retrieve.
 * @returns {Promise<Partial<INewslatter>>} - The retrieved newslatter.
 */
const getNewslatterById = async (id: IdOrIdsInput['id']): Promise<Partial<Inewslatter | null>> => {
  const newslatter = await NewsLatter.findOne({ userId: id });
  return newslatter;
};

/**
 * Service function to retrieve multiple newslatter based on query parameters.
 *
 * @param {SearchQueryInput} query - The query parameters for filtering newslatter.
 * @returns {Promise<Partial<INewslatter>[]>} - The retrieved newslatter
 */
const getManyNewslatter = async (
  query: SearchQueryInput
): Promise<{ newslatters: Partial<Inewslatter>[]; totalData: number; totalPages: number }> => {
  const { searchKey = '', showPerPage = 10, pageNo = 1 } = query;
  const searchFilter: Record<string, unknown> = {
    ...(searchKey
      ? {
          email: { $regex: searchKey, $options: 'i' },
        }
      : {}),
  };
  // Calculate the number of items to skip based on the page number

  const skipItems = (pageNo - 1) * showPerPage;
  // Find the total count of matching newslatter
  const totalData = await NewsLatter.countDocuments(searchFilter);
  // Calculate the total number of pages
  const totalPages = Math.ceil(totalData / showPerPage);
  // Find newslatters based on the search filter with pagination
  const newslatters = await NewsLatter.find(searchFilter)
    .skip(skipItems)
    .limit(showPerPage)
    .sort({ createdAt: -1 })
    .select('')
    .lean();
  return { newslatters, totalData, totalPages };
};

const sendNewsletterCampaign = async (
  data: SendNewsletterInput,
  adminUserId: string
): Promise<Partial<INewsletterCampaign>> => {
  const subscribers = await NewsLatter.find({ isActive: true })
    .select('email')
    .lean();

  if (!subscribers.length) {
    throw new Error('No active newsletter subscribers found');
  }

  const html = buildNewsletterHtml(data.title, data.content);
  const recipientEmails = subscribers
    .map((subscriber) => subscriber.email?.trim().toLowerCase())
    .filter(Boolean);

  const sendResults = await Promise.all(
    recipientEmails.map(async (email) => {
      const success = await SendEmail({
        to: email,
        subject: data.subject,
        text: `${data.title}\n\n${data.content.replace(/<[^>]+>/g, ' ')}`,
        html,
      });

      return success;
    })
  );

  const successCount = sendResults.filter(Boolean).length;
  const failedCount = sendResults.length - successCount;

  const campaign = await NewsletterCampaign.create({
    title: data.title,
    subject: data.subject,
    content: data.content,
    sentBy: new mongoose.Types.ObjectId(adminUserId),
    recipientCount: recipientEmails.length,
    successCount,
    failedCount,
    status: failedCount > 0 ? 'PARTIAL' : 'SENT',
  });

  return campaign.toObject();
};

const getNewsletterCampaigns = async (): Promise<Partial<INewsletterCampaign>[]> => {
  const campaigns = await NewsletterCampaign.find()
    .sort({ createdAt: -1 })
    .limit(20)
    .populate('sentBy', 'firstName lastName email')
    .lean();

  return campaigns;
};

export const newslatterServices = {
  createNewslatter,
  updateNewslatter,
  deleteNewslatter,
  getNewslatterById,
  getManyNewslatter,
  sendNewsletterCampaign,
  getNewsletterCampaigns,
};
