import express from "express";
import { createBooking } from "../controller/places.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/:id", getBookingById); 

export default router;


