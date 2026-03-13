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
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => resolve(blob), file.type, 0.7);
      };
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const compressed = await compressImage(file);
    setImage(compressed);

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-8">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">
          Add Patient
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Patient ID</label>
              <input
                type="number"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Vitals</label>
              <input
                type="text"
                name="vitals"
                value={formData.vitals}
                onChange={handleChange}
                placeholder="120/80, 98.6F"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Billing Code</label>
              <input
                type="number"
                name="billingCode"
                value={formData.billingCode}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          {/* Diagnosis & Notes */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Diagnosis</label>
            <input
              type="text"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Doctor Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
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
    className="w-full border p-2 rounded-xl mb-3"
  />
  {preview && (
    <div className="border rounded-xl shadow-md w-28 h-36 flex items-center justify-center overflow-hidden bg-gray-100">
      <img
        src={preview}
        alt="Preview"
        className="object-cover w-full h-full"
      />
    </div>
  )}
  <p className="text-gray-500 text-sm mt-1">Passport-size preview</p>
</div>
          {/* Upload Progress */}
          {loading && (
            <div className="w-full bg-gray-200 h-3 rounded mt-2">
              <div
                className="bg-indigo-500 h-3 rounded transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
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
}

export default AddPatient;