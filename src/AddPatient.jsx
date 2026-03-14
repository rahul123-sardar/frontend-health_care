import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";

const AddPatient = () => {
  const [file, setFile] = useState(null);

  const formik = useFormik({
    initialValues: {
      patientId: "",
      name: "",
      vitals: "",
      billingCode: "",
      diagnosis: "",
      notes: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        Object.keys(values).forEach((key) => formData.append(key, values[key]));
        if (file) formData.append("image", file);

        const res = await axios.post(
          "http://localhost:5000/api/patient/save",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        alert("Patient added successfully!");
        resetForm();
        setFile(null);
      } catch (err) {
        console.error("Failed to add patient:", err.response?.data || err.message);
        alert(err.response?.data?.message || "Error adding patient");
      }
    },
  });

  // Example AddPatient.jsx handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("patientId", patientId);
  formData.append("name", name);
  formData.append("vitals", vitals);
  formData.append("billingCode", billingCode);
  formData.append("diagnosis", diagnosis);
  formData.append("notes", notes);
  if (file) formData.append("image", file); // <-- must match "image" in multer.single("image")

  try {
    const res = await axios.post(
      "http://localhost:5000/api/patient/save",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    console.log("Patient saved:", res.data);
  } catch (err) {
    console.error("Failed to save patient:", err.response?.data || err.message);
  }
};

  return (
    <form onSubmit={formik.handleSubmit}>
      <input
        type="number"
        name="patientId"
        placeholder="Patient ID"
        value={formik.values.patientId}
        onChange={formik.handleChange}
        required
      />
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formik.values.name}
        onChange={formik.handleChange}
        required
      />
      <input
        type="text"
        name="vitals"
        placeholder="Vitals"
        value={formik.values.vitals}
        onChange={formik.handleChange}
      />
      <input
        type="number"
        name="billingCode"
        placeholder="Billing Code"
        value={formik.values.billingCode}
        onChange={formik.handleChange}
      />
      <input
        type="text"
        name="diagnosis"
        placeholder="Diagnosis"
        value={formik.values.diagnosis}
        onChange={formik.handleChange}
      />
      <textarea
        name="notes"
        placeholder="Notes"
        value={formik.values.notes}
        onChange={formik.handleChange}
      />
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Add Patient</button>
    </form>
  );
};

export default AddPatient;