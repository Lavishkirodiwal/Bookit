"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // or useRouter
import jsPDF from "jspdf";

export default function Result() {
  const [booking, setBooking] = useState(null);
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId"); // get bookingId from URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!bookingId) return;
    fetch(`${API_URL}/api/booking/${bookingId}`)
      .then(res => res.json())
      .then(data => setBooking(data.booking))
      .catch(err => console.error(err));
  }, [bookingId]);

  const downloadTicket = () => {
    if (!booking) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Booking Ticket", 20, 20);
    doc.setFontSize(12);
    doc.text(`Booking ID: ${booking.bookingId}`, 20, 40);
    doc.text(`Experience: ${booking.experienceTitle}`, 20, 50);
    doc.text(`Date: ${booking.date}`, 20, 60);
    doc.text(`Time: ${booking.time}`, 20, 70);
    doc.text(`People: ${booking.persons}`, 20, 80);
    doc.text(`Total: $${booking.total}`, 20, 90);
    doc.save(`ticket-${booking.bookingId}.pdf`);
  };

  if (!booking) return <p>Loading booking...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-green-600">✅ Booking Confirmed!</h1>
        <p className="text-gray-700 mb-6">Thank you for booking your experience with us.</p>

        <div className="mb-6 text-left border p-4 rounded bg-gray-50">
          <p className="font-semibold mb-1">Booking ID: <span className="text-gray-600">{booking.bookingId}</span></p>
          <p className="font-semibold mb-1">Experience:</p>
          <p className="text-gray-600 mb-2">{booking.experienceTitle}</p>
          <p className="mb-1"><span className="font-semibold">Date:</span> {booking.date}</p>
          <p className="mb-1"><span className="font-semibold">Time:</span> {booking.time}</p>
          <p className="mb-1"><span className="font-semibold">People:</span> {booking.persons}</p>
          <p className="font-semibold text-lg mt-2">Total: ${booking.total}</p>
        </div>

        <div className="flex flex-col space-y-3">
          <a href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded">Back to Home</a>
          <a href="/" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded">Book Another Experience</a>
          <button onClick={downloadTicket} className="bg-gray-200 hover:bg-gray-300 font-semibold px-6 py-3 rounded">Download Ticket</button>
        </div>
      </div>
    </div>
  );
}
