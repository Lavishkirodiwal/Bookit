import Header from "@/components/header";
import { useRouter } from "next/router";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function Checkout() {
  const router = useRouter();
  const [cart, setCart] = useCart();
  const [form, setForm] = useState({ name: "", email: "" });
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!cart || cart.length === 0) {
    return (
      <>
        <Header cartCount={0} />
        <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
          <h1 className="text-2xl font-bold mb-4 text-center">Checkout</h1>
          <p className="text-center text-gray-500">No items in cart. Add experiences first.</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
          >
            Go Back Home
          </button>
        </div>
      </>
    );
  }

  const grandTotal = cart.reduce((sum, item) => sum + Number(item.total || 0), 0);

  const handleBooking = async () => {
    // Validate form: require name/email if missing
    if (!form.name || !form.email) {
      alert("Please enter your name and email to continue.");
      return;
    }

    const bookings = cart.map(item => ({
      name: item.name || form.name,
      email: item.email || form.email,
      persons: item.quantity,
      experienceId: item._id,
      date: item.date,
      time: item.time,
    }));

    try {
      const res = await fetch(`${API_URL}/api/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookings),
      });
      if (res.ok) {
        setCart([]); // clear cart
        router.push("/result");
      } else {
        const data = await res.json();
        alert(data.message || "Booking failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong with booking");
    }
  };

  return (
    <>
      <Header cartCount={cart.length} />

      <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
        <h1 className="text-2xl font-bold mb-6 text-center">Checkout</h1>

        <div className="mb-6 border p-4 rounded-lg bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">Booking Summary</h2>
          {cart.map((item, index) => (
            <div key={index} className="mb-3 border-b pb-2">
              <p><b>Experience:</b> {item.title}</p>
              <p><b>Date:</b> {item.date}</p>
              <p><b>Time:</b> {item.time}</p>
              <p><b>People:</b> {item.quantity}</p>
              <p><b>Total:</b> ${Number(item.total).toFixed(2)}</p>
            </div>
          ))}
          <p className="text-lg font-bold mt-2">Grand Total: ${grandTotal.toFixed(2)}</p>
        </div>

        <div className="flex flex-col space-y-4">
          {!cart.every(item => item.name) && (
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}

          {!cart.every(item => item.email) && (
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}

          <button
            onClick={handleBooking}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition-colors"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </>
  );
}


