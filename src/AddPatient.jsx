import React, { useState, useRef } from "react";
import { useFormik } from "formik";
import axios from "axios";

const validate = (values) => {
  const errors = {};
  if (!values.patientId) {
    errors.patientId = "Required";
  }
  if (!values.name) {
    errors.name = "Required";
  }
  return errors;
};

const AddPatient = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const compressImage = (file, maxWidth = 800, maxHeight = 800) =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          const scale = Math.min(maxWidth / width, maxHeight / height);
          width *= scale;
          height *= scale;
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => resolve(blob), file.type, 0.7);
      };
    });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const compressed = await compressImage(file);
    setImage(compressed);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const formik = useFormik({
    initialValues: {
      patientId: "",
      name: "",
      vitals: "",
      billingCode: "",
      diagnosis: "",
      notes: "",
    },
    validate,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      setProgress(0);

      const data = new FormData();
      Object.entries(values).forEach(([key, value]) => data.append(key, value));
      if (image) data.append("image", image);

      try {
        const res = await axios.post(
          "https://backend-health-care-xr5d.vercel.app/api/patient/save",
          data,
          {
            onUploadProgress: (event) => {
              const percent = Math.round((event.loaded * 100) / event.total);
              setProgress(percent);
            },
          }
        );

        alert(res.data.message || "Patient saved successfully!");
        resetForm();
        setImage(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = null;
        setProgress(0);
      } catch (error) {
        console.error("Upload Error:", error);
        alert(error.response?.data?.message || "Server error");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-8">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">
          Add Patient
        </h1>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient ID */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">Patient ID</label>
              <input
                type="number"
                name="patientId"
                onChange={formik.handleChange}
                value={formik.values.patientId}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400"
              />
              {formik.errors.patientId ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.patientId}</div>
              ) : null}
            </div>
            {/* Name */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400"
              />
              {formik.errors.name ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
              ) : null}
            </div>
            {/* Vitals */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">Vitals</label>
              <input
                type="text"
                name="vitals"
                placeholder="120/80, 98.6F"
                onChange={formik.handleChange}
                value={formik.values.vitals}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            {/* Billing Code */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">Billing Code</label>
              <input
                type="number"
                name="billingCode"
                onChange={formik.handleChange}
                value={formik.values.billingCode}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          {/* Diagnosis */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Diagnosis</label>
            <input
              type="text"
              name="diagnosis"
              onChange={formik.handleChange}
              value={formik.values.diagnosis}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Doctor Notes</label>
            <textarea
              name="notes"
              onChange={formik.handleChange}
              value={formik.values.notes}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Image Upload */}
          <div className="flex flex-col items-center">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              className="w-full border p-2 rounded-xl mb-2"
            />
            {preview && (
              <div className="border rounded-xl shadow-md w-24 h-32 flex items-center justify-center overflow-hidden bg-gray-100">
                <img src={preview} alt="Preview" className="object-cover w-full h-full" />
              </div>
            )}
          </div>

          {/* Progress */}
          {loading && (
            <div className="w-full bg-gray-200 h-3 rounded mt-2">
              <div
                className="bg-indigo-500 h-3 rounded transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-2xl font-semibold text-white transition-all duration-200 ${
              loading
                ? "bg-gray-400"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            }`}
          >
            {loading ? `Saving... ${progress}%` : "Save Patient"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPatient;