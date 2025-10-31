import { useState } from "react";
import Link from "next/link";

export default function ExperienceCard({ experience, onAddToCart }) {
  const [hovered, setHovered] = useState(false);

  const renderStars = (rating = 0) =>
    [1, 2, 3, 4, 5].map((i) => (
      <span key={i} className={i <= rating ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));

  return (
    <div
      className="relative bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-500 hover:shadow-2xl cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Section */}
        <div className="relative w-full h-56 overflow-hidden">
  <img
    src={
      experience.images && experience.images.length > 0
        ? experience.images[0]
        : experience.image || "/default.jpg"
    }
    alt={experience.title}
    className={`w-full object-cover transition-all duration-700 ease-in-out ${
      hovered ? "h-96" : "h-56"
    }`}
  />

  {/* Optional overlay, if needed */}
  <div className="absolute inset-0 transition-opacity duration-700"></div>

  
        {/* Hover background overlay */}
        <div
          className={`absolute inset-0 transition-all duration-700 `}
        ></div>
      </div>

      {/* Content */}
      <div
        className={`relative p-5 transition-all duration-700 ease-in-out ${
          hovered ? "bg-black/60 text-white" : "bg-white text-gray-800"
        }`}
      >
        <h2
          className={`text-2xl font-bold mb-2 transition-all duration-500 ${
            hovered ? "text-white" : "text-gray-900"
          }`}
        >
          {experience.title}
        </h2>

        <p
          className={`transition-opacity duration-500 ${
            hovered ? "opacity-80" : "text-gray-600"
          }`}
        >
          {experience.location}
        </p>

        {!hovered && (
          <>
            <div className="mt-2">{renderStars(Math.round(experience.rating || 0))}</div>
            <p className="font-bold text-lg text-indigo-600 mt-3">
              ${experience.price} / person
            </p>
          </>
        )}

        {/* Buttons on hover */}
        {hovered && (
          <div className="flex gap-2 mt-4">
            <Link href={`/details/${experience._id}`}>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                View Details
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
