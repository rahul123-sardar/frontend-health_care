// App.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [patients, setPatients] = useState([]);
  const [role, setRole] = useState(""); // Nurse, Billing, Unauthorized

  // Replace this with your deployed backend URL
  const API_URL = "https://backend-health-care-wrp.vercel.app/api/patient";

  // Fetch patients from backend
  const fetchPatients = async () => {
    try {
      const res = await axios.get(API_URL);
      setPatients(res.data);
      console.log("Fetched patients:", res.data);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Role-based fields
  const roles = {
    Nurse: ["patientId", "name", "vitals", "diagnosis", "notes"],
    Billing: ["patientId", "name", "billingCode"],
    Unauthorized: [],
  };

  return (
    <div className="main-container">
      <h1>Secure PHI Access Simulator</h1>

      {/* Role Selection */}
      <div className="role-buttons">
        {Object.keys(roles).map((r) => (
          <button key={r} onClick={() => setRole(r)}>
            {r}
          </button>
        ))}
      </div>

      {/* Patients List */}
      <div className="patients-list">
        {role === "Unauthorized" && <p>Access Denied</p>}
        {role && role !== "Unauthorized" &&
          patients.map((p) => (
            <div key={p._id || p.patientId} className="patient-card">
              {roles[role].map((field) => (
                <p key={field}>
                  <strong>{field}: </strong>
                  {p[field] ?? "-"}
                </p>
              ))}
              {p.image && (
                <img
                  src={p.image}
                  alt="patient"
                  width="120"
                  height="120"
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
