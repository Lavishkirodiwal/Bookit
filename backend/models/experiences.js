import mongoose from "mongoose";
import { reviewSchema } from "../models/review.js";


const experienceSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  price: Number,
  images: [String],
  availableDates: [
    {
      dateSlots: [String], // e.g. "2025-11-10"
      timeSlots: [String], // e.g. ["09:00", "12:00", "15:00"]
    },
  ],
  about: String,
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
});

export default mongoose.model("Experiences", experienceSchema);
