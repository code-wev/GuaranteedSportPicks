import { Schema, model, models } from "mongoose";

const testimonialSchema = new Schema(
  {
    name: { type: String, required: true },
    img: { type: String, required: false }, // optional user image
    profession: { type: String, required: false },
    comment: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    status:{
        type:String,
        default:"pending",
        enum:['pending', "active", "unpublish"]
    }
  },
  { timestamps: true }
);

const Testimonial =
  models.Testimonial || model("Testimonial", testimonialSchema);

export default Testimonial;
