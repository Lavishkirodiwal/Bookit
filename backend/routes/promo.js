import express from "express";
import { validatePromo } from "../controller/places.js";

const router = express.Router();

router.post("/validation", validatePromo);

export default router;
