import { useState } from "react";
import axios from "axios";
import AddPatient from "./AddPatient";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [role, setRole] = useState("");

  // Use environment variable for backend base URL
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://backend-health-care-97bf.vercel.app/api/patient";

  const getPatient = async (roleName) => {
    setRole(roleName);

    try {
      // Correct endpoint: match backend routes
      const res = await axios.get(`${API_BASE_URL}/patient`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
      setData([]); // clear data on error
    }
  };

  return (
    <div className="bg-gray-100 p-8 min-h-screen main-container">
      <AddPatient />

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow card">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 title">
          Secure PHI Access Simulator
        </h1>

        <div className="flex gap-4 mb-6 button-group">
          <button
            onClick={() => getPatient("Nurse")}
            className="bg-green-600 text-white px-4 py-2 rounded btn btn-nurse"
          >
            Nurse
          </button>

          <button
            onClick={() => getPatient("Billing")}
            className="bg-yellow-500 text-white px-4 py-2 rounded btn btn-billing"
          >
            Billing Clerk
          </button>

          <button
            onClick={() => getPatient("Unauthorized")}
            className="bg-red-500 text-white px-4 py-2 rounded btn btn-unauthorized"
          >
            Unauthorized
          </button>
        </div>

        {/* Nurse View */}
        {role === "Nurse" &&
          data.length > 0 &&
          data.map((patient) => (
            <div
              key={patient._id}
              className="bg-green-50 p-4 border border-green-400 mb-3 patient-box nurse-view"
            >
              <h2 className="font-bold">Nurse View</h2>
              {patient.image && <img src={patient.image} width="120" />}
              <p>Patient ID: {patient.patientId}</p>
              <p>Name: {patient.name}</p>
              <p>Vitals: {patient.vitals}</p>
              <p>Diagnosis: {patient.diagnosis}</p>
              <p>Notes: {patient.notes}</p>
            </div>
          ))}

        {/* Billing Clerk View */}
        {role === "Billing" &&
          data.length > 0 &&
          data.map((patient) => (
            <div
              key={patient._id}
              className="bg-yellow-50 p-4 border border-yellow-400 mb-3 patient-box billing-view"
            >
              <h2 className="font-bold">Billing Clerk View</h2>
              {patient.image && <img src={patient.image} width="120" />}
              <p>Patient ID: {patient.patientId}</p>
              <p>Name: {patient.name}</p>
              <p>Billing Code: {patient.billingCode}</p>
              <p className="text-red-600 mt-2">
                Diagnosis & Notes are encrypted (Access denied)
              </p>
            </div>
          ))}

        {/* Unauthorized View */}
        {role === "Unauthorized" && (
          <div className="bg-red-100 p-4 border border-red-400 patient-box denied">
            <h2 className="font-bold text-red-700">ACCESS DENIED</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;