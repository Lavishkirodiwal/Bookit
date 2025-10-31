import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/header";
import ExperienceCard from "../components/ExperienceCard";
import CheckoutBubble from "../components/checkoutBubble";
import { useCart } from "@/context/CartContext";

export default function Home() {
  const router = useRouter();
  const [experiences, setExperiences] = useState([]);
  const [cart, setCart] = useCart();
  const [loading, setLoading] = useState(true);

  // Fetch experiences from API
  useEffect(() => {
    fetch("http://localhost:5000/api/experiences")
      .then((res) => res.json())
      .then((data) => {
        setExperiences(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Add an experience to cart
  const handleAddToCart = (item) => {
  setCart([...cart, item]); // localStorage will auto-update via useEffect
};


  // Navigate to checkout page
  const handleCheckoutClick = () => {
    router.push("/checkout");
  };

  return (
    <>
      <Header cartCount={cart.length} />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 text-lg">Loading experiences...</p>
          </div>
        ) : experiences.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No experiences found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((exp) => (
              <ExperienceCard
                key={exp._id}
                experience={exp}
                onAddToCart={() => handleAddToCart(exp)}
              />
            ))}
          </div>
        )}
      </div>


    </>
  );
}
