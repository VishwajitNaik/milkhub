"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function VisitTypeSelector() {
  const [visitTypes, setVisitTypes] = useState([]);
  const [selectedVisitType, setSelectedVisitType] = useState("");
  const [visitRate, setVisitRate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchVisitTypes() {
      try {
        const res = await axios.get("/api/Docter/GetVisitType");
        const data = res.data.data || [];
        setVisitTypes(data);
        setSelectedVisitType(data[0]?.visitType || "");
        setVisitRate(data[0]?.visitRate || "");
      } catch (err) {
        console.error("Failed to fetch visit types:", err);
        setError("Failed to load visit types.");
      } finally {
        setLoading(false);
      }
    }

    fetchVisitTypes();
  }, []);

  const handleVisitTypeChange = (e) => {
    const selectedType = e.target.value;
    setSelectedVisitType(selectedType);

    const matchedType = visitTypes.find(v => v.visitType === selectedType);
    if (matchedType) {
      setVisitRate(matchedType.visitRate);
    } else {
      setVisitRate("");
    }
  };

  if (loading) return <p className="text-center">Loading visit types...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="p-4 border rounded shadow-md max-w-md mx-auto space-y-4 bg-white">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Visit Type</label>
        <select
          value={selectedVisitType}
          onChange={handleVisitTypeChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
        >
          {visitTypes.map((type) => (
            <option key={type._id} value={type.visitType}>
              {type.visitType}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Visit Rate</label>
        <input
          type="text"
          value={visitRate ? `${visitRate} ₹` : ""}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm text-black"
        />
      </div>
    </div>
  );
}
