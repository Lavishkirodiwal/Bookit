import { ShoppingCartIcon } from "@heroicons/react/24/solid";

export default function CheckoutBubble({ cartCount, onClick }) {
  if (cartCount === 0) return null;

  return (
    <div
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg cursor-pointer hover:bg-indigo-700 transition flex items-center space-x-2"
    >
      <ShoppingCartIcon className="w-6 h-6" />
      <span className="font-semibold">{cartCount}</span>
    </div>
  );
}
