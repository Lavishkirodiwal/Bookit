import React, { useState, useEffect } from "react";
import axios from "axios";

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

  // Fetch experiences from API
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch(`${API_URL}/api/experiences`);
        const data = await response.json();
        setExperiences(data);
      } catch (error) {
        console.error("Error fetching experiences:", error);
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
      const response = await axios.post(`${API_URL}/api/experiences`, formData);
      alert("Experience created successfully!");
      console.log(response.data);
      // Optionally refresh the experience list
      setExperiences([...experiences, response.data]);
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

      {/* Optional: List of experiences */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Existing Experiences</h3>
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
