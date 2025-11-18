import mongoose, { Schema, models, model } from "mongoose";

const blogApiSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    img: {
      type: String,
      default: null,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    status:{
        type:String,
        enum:["publish", "draft"],
        default:"publish"
    }
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// Prevent model overwrite error in Next.js (Hot Reload)
export const Blog =
  models.Blog || model("Blog", blogApiSchema);
