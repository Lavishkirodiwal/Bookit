import { useState } from "react";

const CreateExperience = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    about: "",
    images: [""], // can add multiple image URLs dynamically later
    availableDates: [""], // initially empty
  });

  // Handle text inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add new date slot
  const addDateSlot = () => {
    setFormData({
      ...formData,
      availableDates: [...formData.availableDates, { date: "", timeSlots: [""] }],
    });
  };

  // Remove a date slot
  const removeDateSlot = (index) => {
    const dates = [...formData.availableDates];
    dates.splice(index, 1);
    setFormData({ ...formData, availableDates: dates });
  };

  // Handle change in date field
  const handleDateChange = (index, value) => {
    const dates = [...formData.availableDates];
    dates[index].date = value;
    setFormData({ ...formData, availableDates: dates });
  };

  // Add new time slot to a specific date
  const addTimeSlot = (index) => {
    const dates = [...formData.availableDates];
    dates[index].timeSlots.push("");
    setFormData({ ...formData, availableDates: dates });
  };

  // Handle change in a specific time slot
  const handleTimeChange = (dateIndex, timeIndex, value) => {
    const dates = [...formData.availableDates];
    dates[dateIndex].timeSlots[timeIndex] = value;
    setFormData({ ...formData, availableDates: dates });
  };

  // Remove a time slot
  const removeTimeSlot = (dateIndex, timeIndex) => {
    const dates = [...formData.availableDates];
    dates[dateIndex].timeSlots.splice(timeIndex, 1);
    setFormData({ ...formData, availableDates: dates });
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
      console.log("Submitting formData:", JSON.stringify(formData, null, 2));
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
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Create New Experience</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic info */}
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

        {/* Date & Time Slots */}
        <div>
          <h3 className="font-bold mb-2">Available Dates & Time Slots</h3>
          {formData.availableDates.map((dateObj, dateIndex) => (
            <div key={dateIndex} className="mb-4 border p-3 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <input
                  type="date"
                  value={dateObj.date}
                  onChange={(e) => handleDateChange(dateIndex, e.target.value)}
                  className="border p-2 rounded-md"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeDateSlot(dateIndex)}
                  className="text-red-500 ml-2"
                >
                  Remove Date
                </button>
              </div>

              {/* Time Slots */}
              <div className="ml-4 space-y-2">
                {dateObj.timeSlots.map((time, timeIndex) => (
                  <div key={timeIndex} className="flex items-center space-x-2">
                    <input
                      type="time"
                      value={time}
                      onChange={(e) =>
                        handleTimeChange(dateIndex, timeIndex, e.target.value)
                      }
                      className="border p-2 rounded-md"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeTimeSlot(dateIndex, timeIndex)}
                      className="text-red-500"
                    >
                      Remove Time
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addTimeSlot(dateIndex)}
                  className="text-blue-500 mt-2"
                >
                  + Add Time Slot
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addDateSlot}
            className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition"
          >
            + Add Date Slot
          </button>
        </div>

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
