"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  useCreateTestimonialMutation,
  useGetMyTestimonialsQuery,
} from "@/feature/TestimonialApi";
import { FiStar } from "react-icons/fi";

const STATUS_STYLES = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-600",
};

export default function UserTestimonialsPage() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    rating: 5,
    review: "",
  });

  const { data, isLoading } = useGetMyTestimonialsQuery();
  const [createTestimonial, { isLoading: isSubmitting }] = useCreateTestimonialMutation();

  const testimonials = data?.data || [];

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await createTestimonial(form).unwrap();
      toast.success("Your testimonial has been submitted for admin review.");
      setForm({
        title: "",
        location: "",
        rating: 5,
        review: "",
      });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to submit testimonial.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl lg:text-[32px] font-medium">My Testimonials</h1>
        <p className="text-gray-500 text-base mt-1">
          Share your experience. Admin will review your testimonial before it goes live.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold">Submit a Review</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Example: Full-time bettor"
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="Example: New York"
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <select
              value={form.rating}
              onChange={(e) => setForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} Star{rating > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
            <textarea
              rows={6}
              value={form.review}
              onChange={(e) => setForm((prev) => ({ ...prev, review: e.target.value }))}
              placeholder="Tell us how the picks, analysis, or subscription helped you."
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <p className="text-xs text-gray-400 mt-1">Minimum 20 characters.</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#B91C1C] hover:bg-red-700 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            {isSubmitting ? "Submitting..." : "Submit Testimonial"}
          </button>
        </form>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold">Your Submission History</h2>
          <p className="text-sm text-gray-500 mt-1 mb-5">
            Admin approval is required before testimonials appear publicly.
          </p>

          {isLoading ? (
            <div className="py-12 text-sm text-gray-500">Loading your testimonials...</div>
          ) : testimonials.length === 0 ? (
            <div className="py-12 text-sm text-gray-400">No testimonials submitted yet.</div>
          ) : (
            <div className="space-y-4">
              {testimonials.map((item) => (
                <div key={item._id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{item.title || "Member Review"}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        STATUS_STYLES[item.status] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="flex gap-1 text-yellow-500 mt-3">
                    {Array.from({ length: item.rating || 0 }).map((_, index) => (
                      <FiStar key={index} className="fill-current" />
                    ))}
                  </div>

                  <p className="text-sm text-gray-700 mt-3 leading-relaxed">{item.review}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
