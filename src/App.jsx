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

  const API_URL =
    import.meta.env.VITE_BACKEND_URL ||
    "https://backend-health-care-wrp.vercel.app/api/patient";

  // Fetch patients
  const fetchPatients = async () => {
    try {
      const res = await axios.get(API_URL);
      setPatients(res.data);
    } catch (err) {
      console.error(err);
      setPatients([]);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "image" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          data.append(key, key === "patientId" || key === "billingCode" ? Number(value) : value);
        }
      });

      await axios.post(API_URL, data, { headers: { "Content-Type": "multipart/form-data" } });

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
      console.error(err);
      alert("Failed to add patient.");
    }
  };

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
      {Object.keys(roles).map(r => (
        <button key={r} onClick={() => setRole(r)}>{r}</button>
      ))}

      <h2>Patients</h2>
      {role === "Unauthorized" ? (
        <p>Access Denied</p>
      ) : (
        patients.map(p => (
          <div key={p._id || p.patientId} className="patient-card">
            {roles[role].map(field => (
              <p key={field}>
                <strong>{field}: </strong>{p[field] || "-"}
              </p>
            ))}
            {p.image && <img src={p.image} alt="patient" width="120" />}
          </div>
        ))
      )}
    </div>
  );
}

export default App;
