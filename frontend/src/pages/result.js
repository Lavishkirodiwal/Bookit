"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";

export default function Result() {
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("lastBooking");
    if (stored) {
      setBooking(JSON.parse(stored));
    }
  }, []);

  const handleDownloadTicket = () => {
    if (!booking) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Booking Ticket", 20, 20);
    doc.setFontSize(12);

    doc.text(`Booking ID: ${booking._id || "TRV-" + Date.now()}`, 20, 40);
    doc.text(`Experience: ${booking.experience?.title || booking.title || "N/A"}`, 20, 50);
    doc.text(`Date: ${booking.date || "N/A"}`, 20, 60);
    doc.text(`Time: ${booking.time || "N/A"}`, 20, 70);
    doc.text(`People: ${booking.persons || 1}`, 20, 80);
    doc.text(`Total: ₹${booking.total || 0}`, 20, 90);
    doc.text(`Name: ${booking.name || "N/A"}`, 20, 100);
    doc.text(`Email: ${booking.email || "N/A"}`, 20, 110);

    doc.setFontSize(10);
    doc.text("Thank you for booking with us!", 20, 130);

    doc.save(`Booking-${booking._id || "ticket"}.pdf`);
  };

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">No booking found</h2>
          <Link href="/" className="text-blue-500 underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const {
    experience = {},
    date,
    time,
    persons,
    total,
    _id,
  } = booking;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-green-600">✅ Booking Confirmed!</h1>
        <p className="text-gray-700 mb-6">Thank you for booking your experience with us.</p>

        <div className="mb-6 text-left border p-4 rounded bg-gray-50">
          <p className="font-semibold mb-1">
            Booking ID: <span className="text-gray-600">{_id || "TRV-" + Date.now()}</span>
          </p>
          <p className="font-semibold mb-1">Experience:</p>
          <p className="text-gray-600 mb-2">{experience.title || "Amazing Experience"}</p>
          <p className="mb-1"><b>Date:</b> {date || "—"}</p>
          <p className="mb-1"><b>Time:</b> {time || "—"}</p>
          <p className="mb-1"><b>People:</b> {persons || 1}</p>
          <p className="font-semibold text-lg mt-2">Total: ₹{total || 0}</p>
        </div>

        <div className="flex flex-col space-y-3">
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded transition-colors"
          >
            Back to Home
          </Link>

          <Link
            href="/experiences"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded transition-colors"
          >
            Book Another Experience
          </Link>

          <button
            onClick={handleDownloadTicket}
            className="bg-gray-200 hover:bg-gray-300 font-semibold px-6 py-3 rounded transition-colors"
          >
          Download Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
