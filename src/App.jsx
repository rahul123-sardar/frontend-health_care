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

  // Backend API
  const API_URL =
    import.meta.env.VITE_BACKEND_URL ||
    "https://backend-health-care-wrp.vercel.app/api/patient";

  // Fetch patients
  const fetchPatients = async () => {
    try {
      const res = await axios.get(API_URL);
      console.log("Fetched patients:", res.data);
      setPatients(res.data);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setPatients([]);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "image" ? files[0] : value,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          data.append(key, key === "patientId" || key === "billingCode" ? Number(value) : value);
        }
      });

      await axios.post(API_URL, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Patient added!");
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
      console.error("Error adding patient:", err);
      alert("Failed to add patient.");
    }
  };

  // Role-based fields
  const roles = {
    Nurse: ["patientId", "name", "vitals", "diagnosis", "notes"],
    Billing: ["patientId", "name", "billingCode"],
    Unauthorized: [],
  };

  return (
    <div className="main-container">
      <h2>Add Patient</h2>
      <form onSubmit={handleSubmit} className="form">
        {["patientId", "name", "vitals", "billingCode", "diagnosis", "notes"].map(key => (
          <input
            key={key}
            name={key}
            value={formData[key]}
            onChange={handleChange}
            placeholder={key}
            required
          />
        ))}
        <input type="file" name="image" onChange={handleChange} />
        <button type="submit">Add Patient</button>
      </form>

      <h2>Select Role</h2>
      <div className="button-group">
        {Object.keys(roles).map(r => (
          <button key={r} onClick={() => setRole(r)}>
            {r}
          </button>
        ))}
      </div>

      <h2>Patients</h2>
      {role === "Unauthorized" ? (
        <p>Access Denied</p>
      ) : (
        patients.map(p => (
          <div key={p._id || p.patientId} className="patient-card">
            {roles[role].map(field => (
              <p key={field}>
                <strong>{field}: </strong>
                {p[field] || "-"}
              </p>
            ))}
            {/* Show image or placeholder */}
            <img
              src={p.image ? p.image : "https://via.placeholder.com/120"}
              alt="patient"
              width="120"
            />
          </div>
        ))
      )}
    </div>
  );
}

export default App;
