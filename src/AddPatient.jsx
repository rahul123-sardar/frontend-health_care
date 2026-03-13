import { useState, useRef } from "react";
import axios from "axios";

function AddPatient() {
  const [formData, setFormData] = useState({
    patientId: "",
    name: "",
    vitals: "",
    billingCode: "",
    diagnosis: "",
    notes: ""
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Compress image before upload
  const compressImage = (file, maxWidth = 800, maxHeight = 800) => {
    return new Promise((resolve) => {
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
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => resolve(blob),
          file.type,
          0.7 // compress to 70%
        );
      };
    });
  };

  // Handle file input
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const compressed = await compressImage(file);
    setImage(compressed);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setProgress(0);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (image) data.append("image", image);

    try {
      const res = await axios.post(
        "https://backend-health-care-xr5d.vercel.app/api/patient/save",
        data,
        {
          onUploadProgress: (event) => {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          }
        }
      );

      alert(res.data.message || "Patient saved successfully!");

      // Reset form
      setFormData({
        patientId: "",
        name: "",
        vitals: "",
        billingCode: "",
        diagnosis: "",
        notes: ""
      });
      setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
      setProgress(0);
    } catch (error) {
      console.error("Upload Error:", error);
      alert(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Patient Record</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            placeholder="Patient ID"
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Patient Name"
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="vitals"
            value={formData.vitals}
            onChange={handleChange}
            placeholder="Vitals (e.g., 120/80, 98.6F)"
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            name="billingCode"
            value={formData.billingCode}
            onChange={handleChange}
            placeholder="Billing Code"
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            placeholder="Diagnosis"
            className="w-full border p-2 rounded"
          />
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Doctor Notes"
            className="w-full border p-2 rounded"
          />
          <input
            type="file"
            ref={fileInputRef}
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
          />

          {loading && (
            <div className="w-full bg-gray-200 h-2 rounded mt-2">
              <div
                className="bg-blue-600 h-2 rounded"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : "Save Patient"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPatient;