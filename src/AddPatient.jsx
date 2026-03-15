import React from "react";
import { useFormik } from "formik";
import axios from "axios";

const AddPatient = () => {
  const formik = useFormik({
    initialValues: {
      patientId: "",
      name: "",
      vitals: "",
      billingCode: "",
      diagnosis: "",
      notes: "",
      image: null
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("patientId", values.patientId);
        formData.append("name", values.name);
        formData.append("vitals", values.vitals);
        formData.append("billingCode", values.billingCode);
        formData.append("diagnosis", values.diagnosis);
        formData.append("notes", values.notes);
        if (values.image) formData.append("image", values.image);

        const res = await axios.post(
          "https://backend-health-care-wrp.vercel.app/api/patient/save",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );

        console.log(formData);

        console.log("Patient added:", res.data);
        alert("Patient added successfully!");
        resetForm(); // clear form
      } catch (error) {
        console.error("Failed to add patient:", error);
        alert("Failed to add patient. Check console for details.");
      }
    }
  });

  return (
    <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
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
        type="text"
        name="notes"
        placeholder="Notes"
        value={formik.values.notes}
        onChange={formik.handleChange}
      />
      <input
        type="file"
        name="image"
        onChange={(event) => {
          formik.setFieldValue("image", event.currentTarget.files[0]);
        }}
        accept="image/*"
      />
      <button type="submit">Add Patient</button>
    </form>
  );
};

export default AddPatient;