import express from "express";
import {
  createExperience,
  updateExperience,
  deleteExperience,
  getExperiences,
  getExperienceById,
  createBooking,
  validatePromo,
} from "../controller/places.js";

const router = express.Router();

// Experience CRUD
router.post("/", createExperience);
router.get("/", getExperiences);
router.get("/:id", getExperienceById);
router.put("/:id", updateExperience);
router.delete("/:id", deleteExperience);

export default router;


