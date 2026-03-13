import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const AddPatient = () => {
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

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
    onSubmit: async (values, { resetForm }) => {
      if (!imageUrl) {
        alert("Please upload an image first!");
        return;
      }
      const payload = { ...values, image: imageUrl };
      console.log("Submitting payload:", payload);

      // Here you can send payload to your backend
      try {
        setLoading(true);
        const res = await axios.post(
          "https://backend-health-care-xr5d.vercel.app/api/patient/save",
          payload
        );
        alert(res.data.message || "Patient saved successfully!");
        resetForm();
        setPreview(null);
        setImageUrl("");
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Server error");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "patients"); // Set in Cloudinary
    setLoading(true);
    setProgress(0);

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dchn8rrno/image/upload",
        formData,
        {
          onUploadProgress: (e) => {
            setProgress(Math.round((e.loaded * 100) / e.total));
          },
        }
      );
      setImageUrl(res.data.secure_url);
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      alert("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-8">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">
          Add Patient
        </h1>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Patient ID</label>
              <input
                type="number"
                name="patientId"
                onChange={formik.handleChange}
                value={formik.values.patientId}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400"
              />
              {formik.touched.patientId && formik.errors.patientId ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.patientId}</div>
              ) : null}
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400"
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
              ) : null}
            </div>
          </div>

          {/* File Upload */}
          <div className="flex flex-col items-center">
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              className="w-full border p-2 rounded-xl mb-2"
            />
            {preview && (
              <div className="w-24 h-32 border rounded-xl overflow-hidden shadow-md bg-gray-100 flex items-center justify-center">
                <img src={preview} alt="preview" className="object-cover w-full h-full" />
              </div>
            )}
            {loading && (
              <div className="w-full bg-gray-200 h-3 rounded mt-2">
                <div
                  className="bg-indigo-500 h-3 rounded transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>

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