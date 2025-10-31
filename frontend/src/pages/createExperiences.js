import React, { useState, useEffect } from "react";

const CreateExperience = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    about: "",
    images: [],
    availableDates: [{ date: "", timeSlots: [""] }],
  });

  const [experiences, setExperiences] = useState([]);

  // Fetch existing experiences
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch(`${API_URL}/api/experiences`);
        const data = await res.json();
        setExperiences(data);
      } catch (err) {
        console.error("Error fetching experiences:", err);
      }
    };

    fetchExperiences();
  }, [API_URL]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/experiences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create experience");

      const newExperience = await res.json();
      alert("Experience created successfully!");
      setExperiences([...experiences, newExperience]);
      setFormData({
        title: "",
        description: "",
        location: "",
        price: "",
        about: "",
        images: [],
        availableDates: [{ date: "", timeSlots: [""] }],
      });
    } catch (err) {
      console.error(err);
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

      {/* Existing experiences */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Existing Experiences</h3>
        {experiences.length === 0 && <p className="text-gray-500">No experiences found.</p>}
        {experiences.map((exp) => (
          <div key={exp._id} className="p-4 border rounded mb-2">
            <h4 className="font-bold">{exp.title}</h4>
            <p>{exp.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateExperience;
