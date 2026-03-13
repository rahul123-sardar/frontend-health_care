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
  const [preview, setPreview] = useState(null); // for image preview
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const compressed = await compressImage(file);
    setImage(compressed);

    // Show preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

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
      setPreview(null);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Add Patient Record</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            placeholder="Patient ID"
            required
            className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Patient Name"
            required
            className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="vitals"
            value={formData.vitals}
            onChange={handleChange}
            placeholder="Vitals (e.g., 120/80, 98.6F)"
            className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            name="billingCode"
            value={formData.billingCode}
            onChange={handleChange}
            placeholder="Billing Code"
            className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            placeholder="Diagnosis"
            className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Doctor Notes"
            className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="flex flex-col items-center">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
              className="w-full border border-gray-300 p-2 rounded-xl mb-2"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border mt-2 shadow-md"
              />
            )}
          </div>

          {loading && (
            <div className="w-full bg-gray-200 h-3 rounded mt-2">
              <div
                className="bg-blue-600 h-3 rounded transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-2xl text-white font-semibold ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } transition-colors duration-200`}
          >
            {loading ? `Saving... ${progress}%` : "Save Patient"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPatient;