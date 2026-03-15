import { useState, useEffect } from "react";
import axios from "axios";
import AddPatient from "./AddPatient";
import "./App.css";

function App() {
  const [patients, setPatients] = useState([]);
  const [role, setRole] = useState(""); // Nurse, Billing, Unauthorized
  const [loading, setLoading] = useState(false);

  const API_URL = "https://backend-health-care-wrp.vercel.app/api/patient";

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      if (Array.isArray(res.data)) {
        setPatients(res.data);
        console.log("Fetched patients:", res.data);
      } else {
        console.error("Response data is not an array:", res.data);
      }
    } catch (err) {
      console.error("Failed to fetch patients:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const roles = {
    Nurse: ["patientId", "name", "vitals", "diagnosis", "notes"],
    Billing: ["patientId", "name", "billingCode"],
    Unauthorized: [],
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8 lg:px-16">
      <AddPatient />

      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-blue-700">
          Secure PHI Access Simulator
        </h1>
        <p className="text-gray-600 mt-2">Select your role to view patient data</p>
      </header>

      {/* Role Selection */}
      <section className="text-center mb-12">
        <div className="flex justify-center flex-wrap gap-6">
          {Object.keys(roles).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-6 py-2 font-semibold rounded-lg shadow-md transition transform hover:-translate-y-1 hover:shadow-xl ${
                r === "Nurse"
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : r === "Billing"
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </section>

      {/* Patient List */}
      <section>
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
          Patients
        </h2>

        {/* Messages */}
        {loading && <p className="text-center text-gray-500">Loading patients...</p>}
        {!loading && role === "" && (
          <p className="text-center text-gray-500">Please select a role to view patients.</p>
        )}
        {!loading && role === "Unauthorized" && (
          <p className="text-center text-red-600 font-bold">Access Denied</p>
        )}
        {!loading && role && role !== "Unauthorized" && patients.length === 0 && (
          <p className="text-center text-gray-500">No patients found.</p>
        )}

        {/* Patients Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {!loading &&
            role &&
            role !== "Unauthorized" &&
            Array.isArray(patients) &&
            patients.map((p) => (
              <div
                key={p._id || p.patientId}
                className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center transition transform hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Patient Image */}
                <div className="mb-4 w-24 h-24">
                  <img
                    src={p.image || "https://via.placeholder.com/150"}
                    alt={p.name || "patient"}
                    className="w-20 h-20 object-cover rounded-full border border-gray-200 shadow-sm"
                  />
                </div>

                {/* Patient Details */}
                <div className="text-center text-gray-800 text-sm">
                  {roles[role].map((field) => (
                    <p key={field} className="mb-1">
                      <span className="font-semibold">
                        {field.charAt(0).toUpperCase() + field.slice(1)}:
                      </span>{" "}
                      {p[field] ?? "-"}
                    </p>
                  ))}
                  {role === "Billing" && (
                    <p className="inline-block bg-red-100 text-red-700 px-2 py-1 rounded text-xs mt-2">
                      Diagnosis & Notes are encrypted
                    </p>
                  )}
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

export default App;