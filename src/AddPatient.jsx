import React, { useState } from "react";
import axios from "axios";

const AddPatient = () => {
  const [patientId, setPatientId] = useState("");
  const [name, setName] = useState("");
  const [vitals, setVitals] = useState("");
  const [billingCode, setBillingCode] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("patientId", patientId);
      formData.append("name", name);
      formData.append("vitals", vitals);
      formData.append("billingCode", billingCode);
      formData.append("diagnosis", diagnosis);
      formData.append("notes", notes);
      formData.append("image", file);

      const res = await axios.post(
        "https://backend-health-care-xr5d.vercel.app/api/patient/save",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Upload success:", res.data);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Patient ID"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Vitals"
        value={vitals}
        onChange={(e) => setVitals(e.target.value)}
      />
      <input
        type="text"
        placeholder="Billing Code"
        value={billingCode}
        onChange={(e) => setBillingCode(e.target.value)}
      />
      <input
        type="text"
        placeholder="Diagnosis"
        value={diagnosis}
        onChange={(e) => setDiagnosis(e.target.value)}
      />
      <input
        type="text"
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="submit">Save Patient</button>
    </form>
  );
};

export default AddPatient;