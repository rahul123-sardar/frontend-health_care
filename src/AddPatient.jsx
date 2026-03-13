// AddPatient.jsx
import { useState } from "react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://backend-health-care-97bf.vercel.app/api/patient";

export default function AddPatient({ onPatientAdded }) {
  const [formData, setFormData] = useState({
    patientId: "",
    name: "",
    vitals: "",
    billingCode: "",
    diagnosis: "",
    notes: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === "image" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        let value = formData[key];
        // Convert numeric fields to numbers
        if (key === "patientId" || key === "billingCode") value = Number(value);
        if (value !== null && value !== "") data.append(key, value);
      });

      await axios.post(`${API_BASE_URL}/save`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Patient added successfully!");
      setFormData({
        patientId: "",
        name: "",
        vitals: "",
        billingCode: "",
        diagnosis: "",
        notes: "",
        image: null,
      });

      if (onPatientAdded) onPatientAdded(); // Notify parent to refresh list
    } catch (err) {
      console.error("Failed to add patient:", err.response?.data || err.message);
      alert("Failed to add patient.");
    }
  };

  return (
    <div className="card">
      <h2 className="title">Add Patient</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {["patientId", "name", "vitals", "billingCode", "diagnosis", "notes"].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={formData[field]}
            onChange={handleChange}
            required={field === "patientId" || field === "name"}
          />
        ))}
        <input type="file" name="image" onChange={handleChange} />
        <button type="submit" className="btn btn-nurse">
          Add Patient
        </button>
      </form>
    </div>
  );
}