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
  "https://frontend-health-care-pink.vercel.app/api/proxy";

  // Fetch patients from serverless backend
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
      className: "nurse-view",
      fields: ["patientId", "name", "vitals", "diagnosis", "notes"],
      showImage: true,
    },
    Billing: {
      title: "Billing Clerk View",
      className: "billing-view",
      fields: ["patientId", "name", "billingCode"],
      showImage: true,
      accessDenied: "Diagnosis & Notes are encrypted (Access denied)",
    },
    Unauthorized: {
      title: "ACCESS DENIED",
      className: "denied",
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
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          data.append(
            key,
            key === "patientId" || key === "billingCode" ? Number(value) : value
          );
        }
      });

      // POST to serverless endpoint (no /save)
      await axios.post(API_BASE_URL, data, {
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
    <div className="main-container">
      {/* Add Patient Form */}
      <div className="card">
        <h2 className="title">Add Patient</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          {["patientId", "name", "vitals", "billingCode", "diagnosis", "notes"].map(
            (field) => (
              <input
                key={field}
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                required
              />
            )
          )}
          <input type="file" name="image" onChange={handleChange} />
          <button type="submit">Add Patient</button>
        </form>
      </div>

      {/* Role Buttons */}
      <div className="card">
        <h1 className="title">Secure PHI Access Simulator</h1>
        <div className="button-group">
          {["Nurse", "Billing", "Unauthorized"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`btn ${
                r === "Nurse"
                  ? "btn-nurse"
                  : r === "Billing"
                  ? "btn-billing"
                  : "btn-unauthorized"
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
              <div key={patient._id} className={`patient-box ${config.className}`}>
                <h2 className="font-bold">{config.title}</h2>
                {config.showImage && patient.image && (
                  <img src={patient.image} width="120" alt="patient" />
                )}
                {config.fields.map((field) => (
                  <p key={field}>
                    <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>{" "}
                    {patient[field] ?? "-"}
                  </p>
                ))}
                {role === "Billing" && config.accessDenied && (
                  <p className="access-denied">{config.accessDenied}</p>
                )}
              </div>
            );
          })}

        {/* Unauthorized View */}
        {role === "Unauthorized" && (
          <div className={`patient-box ${roleConfig.Unauthorized.className}`}>
            <h2>{roleConfig.Unauthorized.title}</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;