"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";

export default function Result({ booking }) {
  const [ticket, setTicket] = useState(null);

  // Format booking ID: e.g., TRV-2025-1029-001 from _id
  const bookingId = booking?._id
    ? `TRV-${new Date().getFullYear()}-${booking._id.slice(0, 4)}-${booking._id.slice(-3)}`
    : "TRV-2025-1029-001";

  const {
    experience = {},
    date,
    time,
    persons,
    total,
  } = booking || {};

  const downloadTicket = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Booking Ticket", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Booking ID: ${bookingId}`, 20, 40);
    doc.text(`Experience: ${experience.title || "Amazing Experience"}`, 20, 50);
    doc.text(`Date: ${date || "-"}`, 20, 60);
    doc.text(`Time: ${time || "-"}`, 20, 70);
    doc.text(`People: ${persons || "-"}`, 20, 80);
    doc.text(`Total: $${total || "-"}`, 20, 90);

    doc.save(`Booking-${bookingId}.pdf`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-green-600">✅ Booking Confirmed!</h1>
        <p className="text-gray-700 mb-6">Thank you for booking your experience with us.</p>

        {/* Booking Summary */}
        <div className="mb-6 text-left border p-4 rounded bg-gray-50">
          <p className="font-semibold mb-1">
            Booking ID: <span className="text-gray-600">{bookingId}</span>
          </p>
          <p className="font-semibold mb-1">Experience:</p>
          <p className="text-gray-600 mb-2">{experience.title || "Amazing Experience"}</p>
          <p className="mb-1">
            <span className="font-semibold">Date:</span> {date || "-"}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Time:</span> {time || "-"}
          </p>
          <p className="mb-1">
            <span className="font-semibold">People:</span> {persons || "-"}
          </p>
          <p className="font-semibold text-lg mt-2">Total: ${total || "-"}</p>
        </div>

        {/* Action Buttons */}
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

      {/* Optional: Related Experiences / Suggestions */}
      <div className="max-w-5xl w-full mt-10">
        <h2 className="text-xl font-bold mb-4 text-center">You Might Also Like</h2>
        {/* Render ExperienceCard components here */}
      </div>
    </div>
  );
}
