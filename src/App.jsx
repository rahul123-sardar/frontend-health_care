import { useState } from "react";
import axios from "axios";
import AddPatient from "./AddPatient";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [role, setRole] = useState("");

  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL ||
    "https://backend-health-care-xr5d.vercel.app/api";

  const getPatient = async (roleName) => {
    setRole(roleName);

    try {
      const res = await axios.get(`${API_BASE_URL}/patient`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
      setData([]);
    }
  };

  // Configuration for each role
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

  return (
    <div className="bg-gray-100 p-8 min-h-screen main-container">
      <AddPatient />

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow card">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 title">
          Secure PHI Access Simulator
        </h1>

        <div className="flex gap-4 mb-6 button-group">
          {["Nurse", "Billing", "Unauthorized"].map((r) => (
            <button
              key={r}
              onClick={() => getPatient(r)}
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

        {/* Render Patients */}
        {role && role !== "Unauthorized" &&
          data.map((patient) => {
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

        {/* Unauthorized */}
        {role === "Unauthorized" && (
          <div
            className={`${roleConfig.Unauthorized.bg} p-4 border ${roleConfig.Unauthorized.border} patient-box`}
          >
            <h2 className="font-bold text-red-700">{roleConfig.Unauthorized.title}</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;