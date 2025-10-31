import { useState } from "react";
import CheckoutBubble from "./checkoutBubble";

export default function Header({ cartCount }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-indigo-600">Travelify</div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 items-center">
          <a href="#" className="text-gray-700 hover:text-indigo-600 transition">Categories</a>
          <a href="#" className="text-gray-700 hover:text-indigo-600 transition">Offers</a>
          <a href="checkout" className="text-gray-700 hover:text-indigo-600 transition">Checkout</a>
          <a href="#" className="text-gray-700 hover:text-indigo-600 transition">About</a>
        </nav>

        {/* Login/Signup Buttons */}
        <div className="hidden md:flex space-x-4">
          <button className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50 transition">Login</button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">Signup</button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700">
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white px-6 pb-4 space-y-2 shadow-md">
          <a href="#" className="block text-gray-700 hover:text-indigo-600">Categories</a>
          <a href="#" className="block text-gray-700 hover:text-indigo-600">Offers</a>
          <a href="#" className="block text-gray-700 hover:text-indigo-600">Checkout</a>
          <a href="#" className="block text-gray-700 hover:text-indigo-600">About</a>
          <div className="flex space-x-2 mt-2">
            <button className="flex-1 px-4 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50 transition">Login</button>
            <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">Signup</button>
          </div>
        </nav>
      )}
      <CheckoutBubble cartCount={cartCount} onClick={() => window.location.href = "/checkout"} />
    </header>
  );
}
