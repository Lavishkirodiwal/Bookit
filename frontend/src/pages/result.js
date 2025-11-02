"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import jsPDF from "jspdf";

export default function Result() {
  const router = useRouter();
  const { id } = router.query;
  const [booking, setBooking] = useState(null);
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!id) return;

    const fetchBooking = async () => {
      try {
        // Fetch booking data
        const res = await fetch(`${API_URL}/api/booking/${id}`);
        if (!res.ok) throw new Error("Booking not found");
        const data = await res.json();
        const bookingData = data.booking || data;
        setBooking(bookingData);

        // Fetch experience details safely
        if (bookingData.experienceId) {
          const expId =
            typeof bookingData.experienceId === "object"
              ? bookingData.experienceId._id
              : bookingData.experienceId;

          const expRes = await fetch(`${API_URL}/api/experiences/${expId}`);
          if (expRes.ok) {
            const expData = await expRes.json();
            setExperience(expData);
          }
        }
      } catch (error) {
        console.error(error);
        setBooking(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading booking...</p>;
  if (!booking)
    return <p className="text-center mt-10 text-red-500">Booking not found</p>;

  const bookingId = `TRV-${new Date().getFullYear()}-${booking._id.slice(
    0,
    4
  )}-${booking._id.slice(-3)}`;
  const { name, email, date, time, persons, subtotal, tax, total } = booking;

  // =============================
  // Royal-style PDF Ticket
  // =============================
  const downloadTicket = () => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: [700, 300],
  });

  // Colors
  const gold = [230, 185, 80];
  const black = [15, 15, 15];
  const white = [255, 255, 255];

  // ----- BASE SHAPES -----
  doc.setFillColor(...black);
  doc.rect(0, 0, 700, 300, "F");

  doc.setFillColor(...gold);
  doc.rect(550, 0, 150, 300, "F");

  doc.setFillColor(...gold);
  doc.circle(550, 40, 20, "F");
  doc.circle(550, 260, 20, "F");

  doc.setFillColor(...gold);
  doc.circle(0, 40, 20, "F");
  doc.circle(0, 260, 20, "F");

  // ----- LEFT IMAGE -----
  const img = "tick.png"; // your uploaded image/logo
  doc.addImage(img, "PNG", 40, 80, 100, 100);

  // ----- TEXT -----
  doc.setTextColor(...gold);
  doc.setFontSize(12);
  doc.text("🏰 ROYAL BOOKING TICKET 🏰", 180, 40); // header text updated

  // Date | Time top-right (before stub)
  doc.text(`${date || booking?.date || "01 NOVEMBER"} | ${time || booking?.time || "18:00"}`, 470, 40);

  // Event main title
  doc.setTextColor(...white);
  doc.setFontSize(28);
  doc.text(experience?.title?.toUpperCase() || "EXPERIENCE TITLE", 350, 130, { align: "center" });

  // Subtitle removed / blank
  doc.setTextColor(...gold);
  doc.setFontSize(14);
  doc.text("", 350, 155, { align: "center" }); // removed DJ/artist text

  // Row / Seat info
  doc.setTextColor(...white);
  doc.setFontSize(12);
  doc.text(`ROW: -`, 180, 230);
  doc.text(`SEAT: -`, 280, 230);

  // Ticket number (bottom-right before stub)
  doc.text(`${bookingId || "100289"}`, 480, 230);

  // ----- BARCODE SIDE -----
  doc.setTextColor(...black);
  doc.setFontSize(14);
  doc.text(`${bookingId || "100289"}`, 620, 100, { angle: 90 });
  doc.setFontSize(10);
  doc.text(`${date || booking?.date || "01 NOVEMBER"} ${time || booking?.time || "18:00"}`, 640, 100, { angle: 90 });

  // ----- BARCODE LINES -----
  doc.setDrawColor(...black);
  let x = 590;
  for (let i = 0; i < 15; i++) {
    doc.setLineWidth(i % 2 === 0 ? 2 : 1);
    doc.line(x, 60, x, 240);
    x += 5;
  }

  // ----- FOOTER -----
  doc.setTextColor(...gold);
  doc.setFontSize(10);
  doc.text("Present this ticket at the entrance.", 350, 280, { align: "center" });

  // Save
  doc.save(`Ticket-${bookingId || "000000"}.pdf`);
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-green-600">✅ Booking Confirmed!</h1>
        <p className="text-gray-700 mb-6">Thank you for booking your experience with us.</p>

        <div className="mb-6 text-left border p-4 rounded bg-gray-50">
          <p className="font-semibold mb-1">
            Booking ID: <span className="text-gray-600">{bookingId}</span>
          </p>
          <p className="font-semibold mb-1">Experience:</p>
          <p className="text-gray-600 mb-2">{experience?.title || "N/A"}</p>
          {experience?.location && (
            <p className="text-gray-600 mb-2">📍 {experience.location}</p>
          )}
          <p className="mb-1">
            <span className="font-semibold">Date:</span> {date || "-"}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Time:</span> {time || "-"}
          </p>
          <p className="mb-1">
            <span className="font-semibold">People:</span> {persons || "-"}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Name:</span> {name || "-"}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Email:</span> {email || "-"}
          </p>
          <hr className="my-3" />
          <p className="mb-1">
            <span className="font-semibold">Subtotal:</span> ${subtotal?.toFixed(2) || "-"}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Tax (10%):</span> ${tax?.toFixed(2) || "-"}
          </p>
          <p className="font-semibold text-lg mt-2 text-green-700">
            Total: ${total?.toFixed(2) || "-"}
          </p>
        </div>

        <div className="flex flex-col space-y-3">
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded transition-colors text-center"
          >
            Back to Home
          </Link>
          <Link
            href="/"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded transition-colors text-center"
          >
            Book Another Experience
          </Link>
          <button
            onClick={downloadTicket}
            className="bg-gray-200 hover:bg-gray-300 font-semibold px-6 py-3 rounded transition-colors"
          >
            Download Ticket
          </button>
        </div>
      </div>
    </div>
  );
}

