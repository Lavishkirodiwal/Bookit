import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./database/db.js";
import experiencesRoutes from "./routes/experiences.js";
import bookingRoutes from "./routes/booking.js";
import promoRoutes from "./routes/promo.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/experiences", experiencesRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/promo", promoRoutes);
app.use("/api/auth", authRoutes);
// Checkout route
app.post("/api/checkout", (req, res) => {
  const { id, date, time, quantity, total } = req.body;

  // Validate input
  if (!id || !date || !time || !quantity || !total) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Generate booking ID
  const bookingId = `TRV-${new Date().getFullYear()}-${Date.now()}`;

  const booking = {
    bookingId,
    experienceId: id,
    date,
    time,
    quantity,
    total,
  };

  // Here you would normally save booking to DB
  console.log("New booking:", booking);

  res.status(200).json({
    success: true,
    booking,
    message: "Checkout successful",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Connect to DB and start server
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Backend running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ DB connection failed", err);
  });
