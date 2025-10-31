import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  ExperienceId: { type: mongoose.Schema.Types.ObjectId, ref: "Experiences" },
  name: String,
  email: String,
  age: String,
  date: String,
  time: String,
  persons: Number,
});

export default mongoose.model("Booking", bookingSchema);
