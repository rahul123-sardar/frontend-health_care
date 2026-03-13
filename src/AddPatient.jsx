import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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
    validationSchema: Yup.object({
      patientId: Yup.number().required("Required"),
      name: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("patientId", values.patientId);
      formData.append("name", values.name);
      formData.append("vitals", values.vitals);
      formData.append("billingCode", values.billingCode);
      formData.append("diagnosis", values.diagnosis);
      formData.append("notes", values.notes);
      if (file) formData.append("image", file);

      try {
        const res = await axios.post(
          "https://backend-health-care-xr5d.vercel.app/api/patient/save",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert(res.data.message);
        formik.resetForm();
        setFile(null);
      } catch (err) {
        console.error(err);
        alert("Upload failed");
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <input
        type="number"
        name="patientId"
        placeholder="Patient ID"
        onChange={formik.handleChange}
        value={formik.values.patientId}
      />
      <input
        type="text"
        name="name"
        placeholder="Name"
        onChange={formik.handleChange}
        value={formik.values.name}
      />
      <input
        type="text"
        name="vitals"
        placeholder="Vitals"
        onChange={formik.handleChange}
        value={formik.values.vitals}
      />
      <input
        type="number"
        name="billingCode"
        placeholder="Billing Code"
        onChange={formik.handleChange}
        value={formik.values.billingCode}
      />
      <input
        type="text"
        name="diagnosis"
        placeholder="Diagnosis"
        onChange={formik.handleChange}
        value={formik.values.diagnosis}
      />
      <textarea
        name="notes"
        placeholder="Notes"
        onChange={formik.handleChange}
        value={formik.values.notes}
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