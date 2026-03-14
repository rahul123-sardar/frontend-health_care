import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [patients, setPatients] = useState([]);
  const [role, setRole] = useState(""); // Nurse, Billing, Unauthorized
  const [loading, setLoading] = useState(false);

  const API_URL = "https://backend-health-care-wrp.vercel.app/api/patient";

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      if (Array.isArray(res.data)) {
        setPatients(res.data);
        console.log("Fetched patients:", res.data);
      } else {
        console.error("Response data is not an array:", res.data);
      }
    } catch (err) {
      console.error("Failed to fetch patients:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const roles = {
    Nurse: ["patientId", "name", "vitals", "diagnosis", "notes"],
    Billing: ["patientId", "name", "billingCode"],
    Unauthorized: [],
  };

  return (
    <div className="app-container">
      <header>
        <h1>Secure PHI Access Simulator</h1>
      </header>

      {/* Role Selection */}
      <section className="role-section">
        <h2>Select Role</h2>
        <div className="role-buttons">
          {Object.keys(roles).map((r) => (
            <button
              key={r}
              className={`role-btn ${r.toLowerCase()}`}
              onClick={() => setRole(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </section>

      {/* Patient List */}
      <section className="patients-section">
        <h2>Patients</h2>

        {loading && <p>Loading patients...</p>}
        {!loading && role === "" && <p>Please select a role to view patients.</p>}
        {!loading && role === "Unauthorized" && (
          <p className="access-denied">Access Denied</p>
        )}
        {!loading &&
          role &&
          role !== "Unauthorized" &&
          patients.length === 0 && <p>No patients found.</p>}

        <div className="patients-grid">
          {!loading &&
            role &&
            role !== "Unauthorized" &&
            Array.isArray(patients) &&
            patients.map((p) => (
              <div key={p._id || p.patientId} className="patient-card">
                <div className="patient-image">
                  <img
                    src={p.image || "https://via.placeholder.com/120"}
                    alt={p.name || "patient"}
                  />
                </div>
                <div className="patient-details">
                  {roles[role].map((field) => (
                    <p key={field}>
                      <strong>
                        {field.charAt(0).toUpperCase() + field.slice(1)}:
                      </strong>{" "}
                      {p[field] ?? "-"}
                    </p>
                  ))}
                  {role === "Billing" && (
                    <p className="access-denied">
                      Diagnosis & Notes are encrypted
                    </p>
                  )}
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

export default App;