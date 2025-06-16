"use client";

import { useState } from "react";
import axios from "axios";

export default function AddVisitTypeForm() {
  const [visitType, setVisitType] = useState("");
  const [visitCode, setVisitCode] = useState("");
  const [visitRate, setVisitRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/api/sangh/AddVisitType", {
        visitType,
        visitCode,
        visitRate,
      });

      setMessage(res.data.message);
      setVisitType("");
      setVisitCode("");
      setVisitRate("");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-900">Add Visit Type</h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
        <div>
          <label className="block mb-1 font-medium">Visit Type</label>
          <input
            type="text"
            value={visitType}
            onChange={(e) => setVisitType(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Visit Code</label>
          <input
            type="number"
            value={visitCode}
            onChange={(e) => setVisitCode(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Visit Rate (₹)</label>
          <input
            type="number"
            value={visitRate}
            onChange={(e) => setVisitRate(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            required
            min={1}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Add Visit Type"}
        </button>

        {message && <p className="text-green-600 text-sm text-center mt-2">{message}</p>}
        {error && <p className="text-red-600 text-sm text-center mt-2">{error}</p>}
      </form>
    </div>
  );
}
