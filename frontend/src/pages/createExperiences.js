import { useState } from "react";

const CreateExperience = () => {
  const [formData, setFormData] = useState({
    title: "India Gate Visit",
    description: "Explore the iconic India Gate, a beautiful war memorial in the heart of Delhi. Perfect for sightseeing, photography, and evening walks.",
    location: "New Delhi, India",
    price: 500,
    about: "India Gate is a national monument built in 1931 to honor soldiers who sacrificed their lives in wars. Visitors can enjoy the surrounding gardens, street food, and historical significance.",
    images: ["https://example.com/india-gate1.jpg", "https://example.com/india-gate2.jpg"],
    availableDates: [{ dateSlots: ["2025-11-10", "2025-11-11"], timeSlots: ["09:00", "12:00"] }],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/experiences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Experience created successfully!");
        console.log(data);
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error creating experience");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Create New Experience</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <textarea
          name="about"
          placeholder="About"
          value={formData.about}
          onChange={handleChange}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
        >
          Create Experience
        </button>
      </form>
    </div>
  );
};

export default CreateExperience;
