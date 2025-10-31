import React, { useState } from "react";
import axios from "axios";

const CreateExperience = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    about: "",
    images: [],
    availableDates: [{ date: "", timeSlots: [""] }],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/experiences", formData);
      alert("Experience created successfully!");
      console.log(response.data);
    } catch (error) {
      console.error(error);
      alert("Error creating experience");
    }
  };

  return (
    <div>
      <h2>Create New Experience</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <br />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <br />
        <textarea
          name="about"
          placeholder="About"
          value={formData.about}
          onChange={handleChange}
        />
        <br />
        <button type="submit">Create Experience</button>
      </form>
    </div>
  );
};

export default CreateExperience;
