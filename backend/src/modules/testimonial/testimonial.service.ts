import mongoose from 'mongoose';
import Testimonial, { ITestimonial, TestimonialStatus } from '../../model/testimonial/testimonial.model';
import User from '../../model/user/user.schema';
import { CreateTestimonialInput, UpdateTestimonialStatusInput } from './testimonial.validation';

const createTestimonial = async (
  userId: string,
  data: CreateTestimonialInput
): Promise<Partial<ITestimonial>> => {
  const user = await User.findById(userId).lean();
  if (!user) {
    throw new Error('User not found');
  }

  const testimonial = await Testimonial.create({
    userId: new mongoose.Types.ObjectId(userId),
    name: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    location: data.location,
    title: data.title,
    review: data.review,
    rating: data.rating,
    status: TestimonialStatus.PENDING,
  } as any);

  return testimonial;
};

const getMyTestimonials = async (userId: string): Promise<Partial<ITestimonial>[]> => {
  return Testimonial.find({
    userId: new mongoose.Types.ObjectId(userId),
  } as any)
    .sort({ createdAt: -1 })
    .lean();
};

const getApprovedTestimonials = async (): Promise<Partial<ITestimonial>[]> => {
  return Testimonial.find({
    status: TestimonialStatus.APPROVED,
  })
    .sort({ approvedAt: -1, createdAt: -1 })
    .limit(6)
    .lean();
};

const getManyTestimonialsAdmin = async (query: any): Promise<Partial<ITestimonial>[]> => {
  const { searchKey = '', status } = query;
  const filter: Record<string, unknown> = {};

  if (searchKey?.trim()) {
    filter.$or = [
      { name: { $regex: searchKey, $options: 'i' } },
      { email: { $regex: searchKey, $options: 'i' } },
      { review: { $regex: searchKey, $options: 'i' } },
      { title: { $regex: searchKey, $options: 'i' } },
      { location: { $regex: searchKey, $options: 'i' } },
    ];
  }

  if (status && Object.values(TestimonialStatus).includes(status)) {
    filter.status = status;
  }

  return Testimonial.find(filter).sort({ createdAt: -1 }).lean();
};

const updateTestimonialStatus = async (
  id: string,
  data: UpdateTestimonialStatusInput
): Promise<Partial<ITestimonial | null>> => {
  const updatePayload: Record<string, unknown> = {
    status: data.status,
  };

  updatePayload.approvedAt = data.status === TestimonialStatus.APPROVED ? new Date() : undefined;

  return Testimonial.findByIdAndUpdate(id, updatePayload, { new: true }).lean();
};

export const testimonialServices = {
  createTestimonial,
  getMyTestimonials,
  getApprovedTestimonials,
  getManyTestimonialsAdmin,
  updateTestimonialStatus,
};
