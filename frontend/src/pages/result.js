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

  // Convert image URL to Base64 for jsPDF
  const loadImageToBase64 = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = (err) => reject(err);
      img.src = url;
    });

  useEffect(() => {
    if (!id) return;

    const fetchBooking = async () => {
      try {
        // Fetch booking
        const res = await fetch(`${API_URL}/api/booking/${id}`);
        if (!res.ok) throw new Error("Booking not found");
        const data = await res.json();
        const bookingData = data.booking || data;
        setBooking(bookingData);

        // Fetch experience if exists
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
  if (!booking) return <p className="text-center mt-10 text-red-500">Booking not found</p>;

  const bookingId = `TRV-${new Date().getFullYear()}-${booking._id.slice(0, 4)}-${booking._id.slice(-3)}`;
  const { name, email, date, time, persons, subtotal, tax, total } = booking;

  // Royal-themed ticket generator
  const downloadTicket = async () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: [600, 250] });

    // Background
    doc.setFillColor(255, 247, 200); // golden yellow
    doc.rect(0, 0, 600, 250, "F");

    // Outer border
    doc.setDrawColor(204, 153, 0); // dark gold
    doc.setLineWidth(3);
    doc.rect(10, 10, 580, 230, "S");

    // Header
    doc.setFontSize(28);
    doc.setTextColor(153, 102, 0);
    doc.setFont("helvetica", "bold");
    doc.text("🏰 Royal Experience Ticket 🏰", 300, 50, { align: "center" });

    // Divider line
    doc.setDrawColor(153, 102, 0);
    doc.setLineWidth(1);
    doc.line(20, 60, 580, 60);

    // Fort Image
    const fortImageUrl = "https://example.com/fort.png"; // <-- replace with your fort image URL
    try {
      const base64Img = await loadImageToBase64(fortImageUrl);
      doc.addImage(base64Img, "PNG", 450, 70, 120, 80);
    } catch (err) {
      console.error("Image failed to load", err);
      doc.setFillColor(230, 200, 150);
      doc.rect(450, 70, 120, 80, "F");
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("Fort Image", 510, 110, { align: "center" });
    }

    // Booking details
    doc.setFontSize(14);
    doc.setTextColor(102, 51, 0);
    doc.setFont("helvetica", "normal");
    doc.text(`Booking ID: ${bookingId}`, 30, 150);
    doc.text(`Name: ${name || "-"}`, 30, 170);
    doc.text(`Email: ${email || "-"}`, 30, 190);
    doc.text(`Experience: ${experience?.title || "-"}`, 300, 150, { align: "center" });
    doc.text(`Location: ${experience?.location || "-"}`, 300, 170, { align: "center" });
    doc.text(`Date: ${date || "-"}`, 300, 190, { align: "center" });
    doc.text(`Time: ${time || "-"}`, 500, 150);
    doc.text(`People: ${persons || "-"}`, 500, 170);

    // Total Price
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 102, 0);
    doc.text(`Total: $${total?.toFixed(2) || "-"}`, 500, 190);

    // Tear line
    doc.setDrawColor(204, 153, 0);
    doc.setLineDash([5, 5], 0);
    doc.line(20, 230, 580, 230);
    doc.setLineDash();

    // Footer note
    doc.setFontSize(10);
    doc.setTextColor(102, 51, 0);
    doc.setFont("helvetica", "italic");
    doc.text("Please present this ticket at the entrance. Enjoy your royal experience!", 300, 245, { align: "center" });

    doc.save(`Royal-Ticket-${bookingId}.pdf`);
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
