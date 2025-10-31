import mongoose from "mongoose";
import Experience from "../models/experiences.js"; // singular
import Booking from "../models/booking.js";
import Promo from "../models/promo.js";

export const createExperience = async (req, res) => {
  try {
    const newExperience = new Experience(req.body);
    const savedExperience = await newExperience.save();
    res.status(201).json(savedExperience);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateExperience = async (req, res) => {
  try {
    const updatedExperience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedExperience)
      return res.status(404).json({ message: "Experience not found" });
    res.status(200).json(updatedExperience);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    const deletedExperience = await Experience.findByIdAndDelete(req.params.id);
    if (!deletedExperience)
      return res.status(404).json({ message: "Experience not found" });
    res.status(200).json({ message: "Experience deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find();
    res.set("Cache-Control", "no-store");
    res.status(200).json(experiences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) return res.status(404).json({ message: "Experience not found" });
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Booking creation with promo handling
export const createBooking = async (req, res) => {
  try {
    const { experienceId, quantity, promoCode } = req.body;
    const experience = await Experience.findById(experienceId);
    if (!experience) return res.status(404).json({ message: "Experience not found" });

    const subtotal = experience.price * quantity;
    const taxRate = 0.1;
    const tax = subtotal * taxRate;

    let discount = 0;
    if (promoCode) {
      const promo = await Promo.findOne({ code: promoCode, valid: true });
      if (promo) discount = promo.discount;
    }

    const discountAmount = (subtotal + tax) * (discount / 100);
    const total = subtotal + tax - discountAmount;

    const booking = new Booking({ ...req.body, subtotal, tax, total });
    await booking.save();

    res.status(201).json({ message: "Booking successful", booking });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const validatePromo = async (req, res) => {
  const { code } = req.body;
  try {
    const promo = await Promo.findOne({ code });
    if (!promo) return res.status(404).json({ valid: false, message: "Invalid promo code" });
    if (promo.expiryDate && promo.expiryDate < new Date())
      return res.status(400).json({ valid: false, message: "Promo expired" });
    if (promo.valid === false)
      return res.status(400).json({ valid: false, message: "Promo inactive" });

    res.json({ valid: true, discount: promo.discount, message: "Promo code applied successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
