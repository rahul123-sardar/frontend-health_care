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
  const [loading, setLoading] = useState(false); // ✅ Declare loading
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (image) data.append("image", image);

    try {
      const res = await axios.post(
        "https://backend-health-care-xr5d.vercel.app/api/patient/save",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
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

    } catch (error) {
      console.log("AXIOS ERROR:", error);
      alert(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-[500px]">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Patient Record</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
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
            placeholder="Vitals"
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
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full border p-2 rounded"
          />
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