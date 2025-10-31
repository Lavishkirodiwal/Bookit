import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import { useCart } from "@/context/CartContext";
import Image from 'next/image';

export default function Details() {
  const router = useRouter();
  const { id } = router.query;
  const [experience, setExperience] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useCart();
  const taxRate = 0.1;
 const API_URL = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    if (id) {
    fetch(`${API_URL}/api/experiences/${id}`)
        .then(res => res.json())
        .then(data => {
          setExperience(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!experience) return <p>Experience not found</p>;

  // Billing
  const subtotal = experience.price * quantity;
  const tax = subtotal * taxRate;
  const discountAmount = (subtotal + tax) * (discount / 100);
  const total = subtotal + tax - discountAmount;

  const handlePromo = async () => {
    const res = await fetch("http://localhost:5000/api/promo/validation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: promo }),
    });
    const data = await res.json();
    if (data.valid) {
      setDiscount(data.discount);
      alert(`Promo applied: ${data.discount}% off`);
    } else {
      alert(data.message || "Invalid promo code");
      setDiscount(0);
    }
  };

  const handleAddToCart = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select date and time");
      return;
    }

    const bookingData = {
      date: selectedDate,
      time: selectedTime,
      quantity,
      total: total.toFixed(2),
    };

    setCart([...cart, { ...experience, ...bookingData }]);
    router.push("/checkout");
  };

  const availableDates = experience.availableDates || [];
  const selectedDateObj = availableDates.find(d => d.dateSlots.includes(selectedDate));
  const timeSlots = selectedDateObj ? selectedDateObj.timeSlots : [];

  return (
    <>
      <Header cartCount={cart.length} />

      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Image 
            src={experience.images?.[0] || "/default.jpg"}
            alt={experience.title}
            className="w-full h-72 object-cover rounded-xl"
          />
          <h1 className="text-3xl font-bold">{experience.title}</h1>
          <p>{experience.description}</p>
          <p>📍 {experience.location}</p>

          <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
            {/* Date */}
            <div>
              <label>Select Date</label>
              <div className="flex gap-2 flex-wrap">
                {availableDates.flatMap(d => d.dateSlots).map(date => (
                  <button
                    key={date}
                    onClick={() => { setSelectedDate(date); setSelectedTime(""); }}
                    className={selectedDate === date ? "bg-indigo-600 text-white" : "bg-gray-100"}
                  >
                    {date}
                  </button>
                ))}
              </div>
            </div>

            {/* Time */}
            {selectedDate && (
              <div>
                <label>Select Time</label>
                <div className="flex gap-2 flex-wrap">
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={selectedTime === time ? "bg-green-600 text-white" : "bg-gray-100"}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label>People</label>
              <div className="flex gap-2">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>
            </div>

            {/* Promo */}
            <div>
              <label>Promo Code</label>
              <div className="flex gap-2">
                <input
                  value={promo}
                  onChange={e => setPromo(e.target.value)}
                  placeholder="Enter promo code"
                />
                <button onClick={handlePromo}>Apply</button>
              </div>
            </div>

            {/* Add to Cart */}
            <button onClick={handleAddToCart} className="w-full bg-green-600 text-white py-2 rounded">
              Add to Cart & Checkout
            </button>
          </div>
        </div>

        {/* Billing Summary */}
        <aside className="lg:col-span-1 sticky top-20">
          <div className="bg-gray-50 border rounded-xl p-6 shadow-md space-y-4">
            <h3>Billing Summary</h3>
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <p>Tax: ${tax.toFixed(2)}</p>
            {discount > 0 && <p>Discount ({discount}%): -${discountAmount.toFixed(2)}</p>}
            <hr />
            <p>Total: ${total.toFixed(2)}</p>
          </div>
        </aside>
      </div>
    </>
  );
}



