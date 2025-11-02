import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  experienceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Experience", // <-- reference model
    required: true
  },
  name: String,
  email: String,
  date: String,
  time: String,
  persons: Number,
  subtotal: Number,
  tax: Number,
  total: Number
});

export default mongoose.model("Booking", bookingSchema);
