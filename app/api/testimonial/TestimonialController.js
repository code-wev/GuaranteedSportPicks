import { dbConnect } from "@/lib/dbConnect";
import Testimonial from "./TestimonialModel";
import { NextResponse } from "next/server";

export const saveTestimonial = async (data) => {
  await dbConnect();
  console.log(data, "testimonial data")
  const newTestimonial = new Testimonial(data);
  const saved = newTestimonial.save();
  return saved;
};

export const getAllTestimonial = async () => {
  await dbConnect();
  const data = await Testimonial.find();
  return data;
};

export const deleteTestimonial = async (id) => {
  await dbConnect();
  const deleted = await Testimonial.deleteOne({ _id: id });
  return deleted;
};

export const updateTestimonial = async (data) => {
  const id = data.id;
  const updated = await Testimonial.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name: data.name,
        img: data.img,
        profession: data.profession,
        comment: data.comment,
        rating: data.rating,
        status: data.status,
      },
    }
  );
  return updated;
};
