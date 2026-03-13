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
    import.meta.env.VITE_BACKEND_URL ||
    "https://backend-health-care-97bf.vercel.app/api/patient";

  // Fetch patients
  const fetchPatients = async () => {
    try {
      const res = await axios.get(API_BASE_URL);
      setPatients(res.data);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
      setPatients([]);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: name === "image" ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
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
      fetchPatients();
    } catch (err) {
      console.error("Failed to add patient:", err);
      alert("Failed to add patient.");
    }
  };

  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      {/* Add Patient Form */}
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Patient</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {["patientId", "name", "vitals", "billingCode", "diagnosis", "notes"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field]}
              onChange={handleChange}
              required={field === "patientId" || field === "name"}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-4 py-2 rounded font-semibold"
          >
            Add Patient
          </button>
        </form>
      </div>

      {/* Role Buttons */}
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg mb-6">
        <h1 className="text-3xl font-bold text-blue-800 mb-4 text-center">
          Secure PHI Access Simulator
        </h1>
        <div className="flex gap-4 justify-center mb-6">
          {["Nurse", "Billing", "Unauthorized"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-6 py-2 rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105 ${
                r === "Nurse"
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : r === "Billing"
                  ? "bg-yellow-500 text-white hover:bg-yellow-600"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Patient List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {role && role !== "Unauthorized" &&
            patients.map((patient) => {
              const config = roleConfig[role];
              return (
                <div
                  key={patient._id}
                  className={`${config.bg} p-6 rounded-lg border ${config.border} shadow-md flex flex-col items-start gap-2`}
                >
                  <h2 className="font-bold text-lg">{config.title}</h2>
                  {config.showImage && patient.image && (
                    <img
                      src={patient.image}
                      width="120"
                      alt="patient"
                      className="rounded-md border border-gray-200 mt-2"
                    />
                  )}
                  {config.fields.map((field) => (
                    <p key={field} className="text-gray-700">
                      <span className="font-semibold">{field.charAt(0).toUpperCase() + field.slice(1)}:</span>{" "}
                      {patient[field]}
                    </p>
                  ))}
                  {config.accessDenied && <p className="text-red-600 font-semibold mt-2">{config.accessDenied}</p>}
                </div>
              );
            })}

          {/* Unauthorized View */}
          {role === "Unauthorized" && (
            <div className={`${roleConfig.Unauthorized.bg} p-6 border ${roleConfig.Unauthorized.border} rounded-lg shadow-md text-center`}>
              <h2 className="font-bold text-red-700 text-xl">{roleConfig.Unauthorized.title}</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;