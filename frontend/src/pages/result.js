"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import jsPDF from "jspdf";

export default function Result() {
  const router = useRouter();
  const { id } = router.query;
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch booking details from backend
  useEffect(() => {
    if (!id) return;

    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/booking/${id}`);
        if (!res.ok) throw new Error("Booking not found");
        const data = await res.json();
        setBooking(data.booking);
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

  // Generate formatted booking ID
  const bookingId = `TRV-${new Date().getFullYear()}-${booking._id.slice(
    0,
    4
  )}-${booking._id.slice(-3)}`;

  const { experienceId: experience, name, email, date, time, persons, subtotal, tax, total } = booking;


  // Download booking ticket as PDF
  const downloadTicket = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Booking Ticket", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Booking ID: ${bookingId}`, 20, 40);
    doc.text(`Name: ${name || "-"}`, 20, 50);
    doc.text(`Email: ${email || "-"}`, 20, 60);
    doc.text(`Experience: ${experience?.title || "N/A"}`, 20, 70);
    doc.text(`Location: ${experience?.location || "N/A"}`, 20, 80);
    doc.text(`Date: ${date || "-"}`, 20, 90);
    doc.text(`Time: ${time || "-"}`, 20, 100);
    doc.text(`People: ${persons || "-"}`, 20, 110);
    doc.text(`Subtotal: $${subtotal?.toFixed(2) || "-"}`, 20, 120);
    doc.text(`Tax: $${tax?.toFixed(2) || "-"}`, 20, 130);
    doc.text(`Total: $${total?.toFixed(2) || "-"}`, 20, 140);

    doc.save(`Booking-${bookingId}.pdf`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-green-600">
          ✅ Booking Confirmed!
        </h1>
        <p className="text-gray-700 mb-6">
          Thank you for booking your experience with us.
        </p>

        {/* Booking Summary */}
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

          {/* Show pricing breakdown */}
          <hr className="my-3" />
          <p className="mb-1">
            <span className="font-semibold">Subtotal:</span>{" "}
            ${subtotal?.toFixed(2) || "-"}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Tax (10%):</span>{" "}
            ${tax?.toFixed(2) || "-"}
          </p>
          <p className="font-semibold text-lg mt-2 text-green-700">
            Total: ${total?.toFixed(2) || "-"}
          </p>
        </div>

        {/* Buttons */}
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

      {/* Optional: Related Experiences */}
      <div className="max-w-5xl w-full mt-10">
        <h2 className="text-xl font-bold mb-4 text-center">
          You Might Also Like
        </h2>
        {/* Render ExperienceCard components here */}
      </div>
    </div>
  );
}

