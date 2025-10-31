import mongoose from "mongoose";
import Experiences from "../models/experiences.js";
import Booking from "../models/booking.js";
import Promo from "../models/promo.js";

export const getExperiences = async (req, res) => {
  try {
    const experiences = await Experiences.find(); // fetch all experiences from DB
    res.set("Cache-Control", "no-store"); // prevent 304 caching in dev
    res.status(200).json(experiences); // return JSON array
  } catch (error) {
    console.error("Error fetching experiences:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getExperienceById = async (req, res) => {
  try {
    const experience = await Experiences.findById(req.params.id);
    if (!experience) return res.status(404).json({ message: "Experience not found" });
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { experienceId, quantity, promoCode } = req.body;
    const experience = await Experiences.findById(experienceId);
    if (!experience) return res.status(404).json({ message: "Experience not found" });

    // Base price and tax
    const subtotal = experience.price * quantity;
    const taxRate = 0.1;
    const tax = subtotal * taxRate;

    // Promo
    let discount = 0;
    if (promoCode) {
      const promo = await Promo.findOne({ code: promoCode, valid: true });
      if (promo) discount = promo.discount;
    }

    const discountAmount = (subtotal + tax) * (discount / 100);
    const total = subtotal + tax - discountAmount;

    // Save booking
    const booking = new Booking({
      ...req.body,
      subtotal,
      tax,
      total,
    });
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

    if (!promo) {
      return res.status(404).json({ valid: false, message: "Invalid promo code" });
    }

    if (promo.expiryDate && promo.expiryDate < new Date()) {
      return res.status(400).json({ valid: false, message: "Promo expired" });
    }

    if (promo.valid === false) {
      return res.status(400).json({ valid: false, message: "Promo inactive" });
    }

    res.json({
      valid: true,
      discount: promo.discount,
      message: "Promo code applied successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

