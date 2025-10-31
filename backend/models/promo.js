import mongoose from "mongoose";

const promoSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  discount: { type: Number}, // percentage (e.g. 10 = 10%)
  valid: { type: Boolean, default: true },    // true = can still be used
   expiryDate: { type: Date },
}, { timestamps: true });

export default mongoose.model("Promo", promoSchema);
