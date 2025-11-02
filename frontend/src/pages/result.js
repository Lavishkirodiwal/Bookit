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
        const res = await fetch(`${API_URL}/api/booking/${id}`);
        if (!res.ok) throw new Error("Booking not found");
        const data = await res.json();
        const bookingData = data.booking || data;
        setBooking(bookingData);

        if (bookingData.experienceId) {
          const expRes = await fetch(`${API_URL}/api/experiences/${bookingData.experienceId}`);
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

  const bookingId = `TRV-${new Date().getFullYear()}-${booking._id.slice(0, 4)}-${booking._id.slice(-3)}`;
  const { name, email, date, time, persons, subtotal, tax, total } = booking;

  // =============================
  // Ticket-style PDF generator
  // =============================
  const downloadTicket = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: [500, 250] });

    // Background
    doc.setFillColor(250, 250, 250);
    doc.rect(0, 0, 500, 250, "F");

    // Header
    doc.setFontSize(22);
    doc.setTextColor(0, 102, 204);
    doc.text("🎟️ Booking Ticket", 250, 40, { align: "center" });

    // Divider line
    doc.setDrawColor(0, 102, 204);
    doc.setLineWidth(1);
    doc.line(20, 55, 480, 55);

    // Booking ID Box
    doc.setDrawColor(0, 102, 204);
    doc.setLineWidth(1);
    doc.rect(20, 60, 460, 30);
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Booking ID: ${bookingId}`, 30, 80);

    // Experience Section
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(experience?.title || "N/A", 250, 110, { align: "center" });
    doc.setFontSize(12);
    doc.setTextColor(80);
    doc.text(`Location: ${experience?.location || "N/A"}`, 250, 130, { align: "center" });

    // Details Section
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Name: ${name || "-"}`, 30, 160);
    doc.text(`Email: ${email || "-"}`, 30, 180);
    doc.text(`Date: ${date || "-"}`, 250, 160, { align: "center" });
    doc.text(`Time: ${time || "-"}`, 250, 180, { align: "center" });
    doc.text(`People: ${persons || "-"}`, 400, 160);

    // Pricing Section
    doc.setFontSize(14);
    doc.setTextColor(0, 153, 0);
    doc.text(`Total: $${total?.toFixed(2) || "-"}`, 400, 180);

    // Decorative dashed line for "tear here"
    doc.setLineDash([5, 5], 0);
    doc.line(20, 210, 480, 210);
    doc.setLineDash(); // reset dash

    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text("Please present this ticket at the entrance.", 250, 230, { align: "center" });

    doc.save(`Booking-${bookingId}.pdf`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-green-600">✅ Booking Confirmed!</h1>
        <p className="text-gray-700 mb-6">Thank you for booking your experience with us.</p>

        <div className="mb-6 text-left border p-4 rounded bg-gray-50">
          <p className="font-semibold mb-1">Booking ID: <span className="text-gray-600">{bookingId}</span></p>
          <p className="font-semibold mb-1">Experience:</p>
          <p className="text-gray-600 mb-2">{experience?.title || "N/A"}</p>
          {experience?.location && <p className="text-gray-600 mb-2">📍 {experience.location}</p>}
          <p className="mb-1"><span className="font-semibold">Date:</span> {date || "-"}</p>
          <p className="mb-1"><span className="font-semibold">Time:</span> {time || "-"}</p>
          <p className="mb-1"><span className="font-semibold">People:</span> {persons || "-"}</p>
          <p className="mb-1"><span className="font-semibold">Name:</span> {name || "-"}</p>
          <p className="mb-1"><span className="font-semibold">Email:</span> {email || "-"}</p>
          <hr className="my-3" />
          <p className="mb-1"><span className="font-semibold">Subtotal:</span> ${subtotal?.toFixed(2) || "-"}</p>
          <p className="mb-1"><span className="font-semibold">Tax (10%):</span> ${tax?.toFixed(2) || "-"}</p>
          <p className="font-semibold text-lg mt-2 text-green-700">Total: ${total?.toFixed(2) || "-"}</p>
        </div>

        <div className="flex flex-col space-y-3">
          <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded transition-colors text-center">Back to Home</Link>
          <Link href="/" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded transition-colors text-center">Book Another Experience</Link>
          <button onClick={downloadTicket} className="bg-gray-200 hover:bg-gray-300 font-semibold px-6 py-3 rounded transition-colors">Download Ticket</button>
        </div>
      </div>
    </div>
  );
}
