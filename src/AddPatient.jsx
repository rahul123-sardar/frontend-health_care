import { useState } from "react";
import axios from "axios";

function AddPatient() {
  const [image, setImage] = useState(null);
  

  const [formData, setFormData] = useState({
    patientId: "",
    name: "",
    vitals: "",
    billingCode: "",
    diagnosis: "",
    notes: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {

  //     const res = await axios.post(
  //       "http://localhost:5000/api/patient/save",
  //       formData
  //     );

  //     alert(res.data.message);

  //     setFormData({
  //       patientId: "",
  //       name: "",
  //       vitals: "",
  //       billingCode: "",
  //       diagnosis: "",
  //       notes: ""
  //     });

  //   } catch (error) {

  //     console.log(error);
  //     alert("Error saving patient");

  //   }
  // };


  const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData();

data.append("patientId", formData.patientId);
data.append("name", formData.name);
data.append("vitals", formData.vitals);
data.append("billingCode", formData.billingCode);
data.append("diagnosis", formData.diagnosis);
data.append("notes", formData.notes);
if (image) {
  data.append("image", image);
}

  try {

    const res = await axios.post(
  "https://backend-health-care-xr5d.vercel.app/api/patient/save",
  data,
  {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  }
);
    

    alert(res.data.message);

  } catch (error) {
  console.log("AXIOS ERROR:", error);
  console.log("SERVER RESPONSE:", error.response?.data);

  alert(error.response?.data?.message || "Server error");
}
};

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-lg shadow-md w-[500px]">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Add Patient Record
        </h2>

        <form
onSubmit={handleSubmit}
encType="multipart/form-data"
className="space-y-4"
>

          <div>
            <label className="block text-sm font-medium">
              Patient ID
            </label>
            <input
              type="number"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Patient Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Vitals
            </label>
            <input
              type="text"
              name="vitals"
              value={formData.vitals}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="120/90, 98.6F"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Billing Code
            </label>
            <input
              type="number"
              name="billingCode"
              value={formData.billingCode}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Diagnosis
            </label>
            <input
              type="text"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Doctor Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
<label className="block text-sm font-medium">
Patient Image
</label>

<input
type="file"
name="image"
onChange={(e)=>setImage(e.target.files[0])}
className="w-full border p-2 rounded"
/>
</div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Save Patient
          </button>

        </form>

      </div>

    </div>

  );
}

export default AddPatient;