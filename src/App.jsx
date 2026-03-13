// App.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [patients, setPatients] = useState([]);
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    patientId: "",
    name: "",
    vitals: "",
    billingCode: "",
    diagnosis: "",
    notes: "",
    image: null,
  });

  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL || "https://backend-health-care-97bf.vercel.app/api/patient";

  // Fetch patients
  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/patient`);
      setPatients(res.data);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
      setPatients([]);
    }
  };

  // Handle role buttons
  const handleRole = (roleName) => {
    setRole(roleName);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit patient
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) data.append(key, formData[key]);
      });

      await axios.post(`${API_BASE_URL}/patient/save`, data, {
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

      fetchPatients(); // Refresh list after adding
    } catch (err) {
      console.error("Error adding patient:", err);
      alert("Failed to add patient.");
    }
  };

  // Role configuration for mapping
  const roleConfig = {
    Nurse: {
      title: "Nurse View",
      bg: "bg-green-50",
      border: "border-green-400",
      fields: ["patientId", "name", "vitals", "diagnosis", "notes"],
      showImage: true,
    },
    Billing: {
      title: "Billing Clerk View",
      bg: "bg-yellow-50",
      border: "border-yellow-400",
      fields: ["patientId", "name", "billingCode"],
      showImage: true,
      accessDenied: "Diagnosis & Notes are encrypted (Access denied)",
    },
    Unauthorized: {
      title: "ACCESS DENIED",
      bg: "bg-red-100",
      border: "border-red-400",
    },
  };

  // Fetch patients on mount
  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="bg-gray-100 p-8 min-h-screen main-container">
      {/* Add Patient Form */}
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-bold mb-4">Add Patient</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Patient ID"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Vitals"
            name="vitals"
            value={formData.vitals}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Billing Code"
            name="billingCode"
            value={formData.billingCode}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Diagnosis"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
          <input type="file" name="image" onChange={handleChange} />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
          >
            Add Patient
          </button>
        </form>
      </div>

      {/* Role Buttons */}
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow mb-6">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">
          Secure PHI Access Simulator
        </h1>
        <div className="flex gap-4 mb-4">
          {["Nurse", "Billing", "Unauthorized"].map((r) => (
            <button
              key={r}
              onClick={() => handleRole(r)}
              className={`px-4 py-2 rounded btn ${
                r === "Nurse"
                  ? "bg-green-600 text-white"
                  : r === "Billing"
                  ? "bg-yellow-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Patient List */}
        {role && role !== "Unauthorized" &&
          patients.map((patient) => {
            const config = roleConfig[role];
            return (
              <div
                key={patient._id}
                className={`${config.bg} p-4 border ${config.border} mb-3 patient-box`}
              >
                <h2 className="font-bold">{config.title}</h2>
                {config.showImage && patient.image && (
                  <img src={patient.image} width="120" alt="patient" />
                )}
                {config.fields.map((field) => (
                  <p key={field}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}:{" "}
                    {patient[field]}
                  </p>
                ))}
                {config.accessDenied && (
                  <p className="text-red-600 mt-2">{config.accessDenied}</p>
                )}
              </div>
            );
          })}

        {/* Unauthorized View */}
        {role === "Unauthorized" && (
          <div
            className={`${roleConfig.Unauthorized.bg} p-4 border ${roleConfig.Unauthorized.border} patient-box`}
          >
            <h2 className="font-bold text-red-700">
              {roleConfig.Unauthorized.title}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;