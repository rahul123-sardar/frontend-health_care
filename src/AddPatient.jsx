import React, { useState } from "react";
import axios from "axios";

const AddPatient = () => {
  const [patient, setPatient] = useState({
    patientId: "",
    name: "",
    vitals: "",
    billingCode: "",
    diagnosis: "",
    notes: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Handle input change
  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  // Handle file select & preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("patientId", formik.values.patientId);
  formData.append("name", formik.values.name);
  formData.append("vitals", formik.values.vitals);
  formData.append("billingCode", formik.values.billingCode);
  formData.append("diagnosis", formik.values.diagnosis);
  formData.append("notes", formik.values.notes);
  if (file) formData.append("image", file); // file from <input type="file" />

  try {
    const res = await axios.post(
      "https://backend-health-care-xr5d.vercel.app/api/patient/save",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    alert(res.data.message);
  } catch (err) {
    console.error(err);
    alert("Upload failed");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-8">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">
          Add Patient
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label>Patient ID</label>
              <input
                type="number"
                name="patientId"
                value={patient.patientId}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl"
              />
            </div>

            <div>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={patient.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl"
              />
            </div>

            <div>
              <label>Vitals</label>
              <input
                type="text"
                name="vitals"
                value={patient.vitals}
                onChange={handleChange}
                placeholder="120/80, 98.6F"
                className="w-full p-3 border rounded-xl"
              />
            </div>

            <div>
              <label>Billing Code</label>
              <input
                type="number"
                name="billingCode"
                value={patient.billingCode}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl"
              />
            </div>
          </div>

          <div>
            <label>Diagnosis</label>
            <input
              type="text"
              name="diagnosis"
              value={patient.diagnosis}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            />
          </div>

          <div>
            <label>Doctor Notes</label>
            <textarea
              name="notes"
              value={patient.notes}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            />
          </div>

          {/* File Upload */}
          <div>
            <label>Patient Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border p-2 rounded-xl"
            />
            {preview && (
              <div className="w-24 h-32 mt-2 border rounded-xl overflow-hidden">
                <img
                  src={preview}
                  alt="preview"
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            {loading && (
              <div className="w-full bg-gray-200 h-3 rounded mt-2">
                <div
                  className="bg-indigo-500 h-3 rounded"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-4 text-white rounded-2xl ${
              loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
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