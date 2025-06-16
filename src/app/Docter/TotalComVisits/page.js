"use client";
import React, { useState } from "react";

const CompletedVisits = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [visits, setVisits] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCompletedVisits = async () => {
    setLoading(true);
    setError("");
    setVisits([]);
    setTotalEarnings(0);

    try {
      const params = new URLSearchParams({ startDate, endDate });
      const res = await fetch(`/api/Docter/getCompletedVisits?${params}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.message || "Error fetching visits");
      } else {
        setVisits(data.data || []);
        setTotalEarnings(data.totalEarnings || 0);
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h2 className="text-xl font-bold mb-4 text-center text-blue-800">Completed Doctor Visits</h2>

      {/* Date inputs */}
      <div className="bg-white text-gray-700 rounded-lg shadow-md p-4 space-y-3 mb-6">
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded-md"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm text-gray-700">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded-md"
          />
        </div>

        <button
          onClick={fetchCompletedVisits}
          disabled={!startDate || !endDate || loading}
          className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          {loading ? "Loading..." : "Fetch"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-600 text-sm mb-4 text-center">{error}</div>
      )}

      {/* Total Earnings */}
      <div className="text-center font-semibold mb-4 text-gray-700">
        Total Earnings: <span className="text-green-700">₹{totalEarnings.toFixed(2)}</span>
      </div>

      {/* Visit List */}
      {visits.length === 0 ? (
        <div className="text-center text-gray-500">No visits found</div>
      ) : (
        <div className="space-y-4">
          {visits.map((visit) => (
            <div
              key={visit._id}
              className="bg-white p-4 rounded-lg shadow-md space-y-2"
            >
              <div className="flex justify-between text-sm text-gray-700">
                <span className="font-semibold">Date:</span>
                <span>
                  {visit.date ? new Date(visit.date).toLocaleDateString() : ""}
                </span>
              </div>
            <div className="flex justify-between text-sm text-gray-700">
                <span className="font-semibold">Register No:</span>
                <span>{visit.createdBy?.registerNo || "-"}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-700">
                <span className="font-semibold">Status:</span>
                <span>{visit.status}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-700">
                <span className="font-semibold">Owner Name:</span>
                <span>{visit.createdBy?.ownerName || "-"}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span className="font-semibold">Visit Rate:</span>
                <span>₹{visit.visitRate || 0}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedVisits;
