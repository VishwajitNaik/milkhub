"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/app/components/Loading/Loading";

const BillKapatTable = () => {
  const [billKapatData, setBillKapatData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [updatedRate, setUpdatedRate] = useState("");

  const fetchBillKapatData = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `/api/billkapat/AllUserBillKapat?startDate=${startDate}&endDate=${endDate}`
      );
      setBillKapatData(response.data.data);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record._id);
    setUpdatedRate(record.rate);
  };

  const handleUpdate = async (recordId) => {
    if (!updatedRate || isNaN(updatedRate)) {
      alert("Please enter a valid number for rate.");
      return;
    }

    try {
      await axios.put(`/api/billkapat/update`, {
        recordId,
        rate: parseFloat(updatedRate),
      });

      setBillKapatData((prevData) =>
        prevData.map((user) => ({
          ...user,
          records: user.records.map((record) =>
            record._id === recordId ? { ...record, rate: parseFloat(updatedRate) } : record
          ),
        }))
      );

      setEditingRecord(null);
    } catch (error) {
      console.error("Failed to update record", error);
      alert("Failed to update record");
    }
  };

  // Calculate total amount
  const calculateTotal = () => {
    return billKapatData.reduce((total, user) => {
      return (
        total +
        user.records.reduce((userTotal, record) => userTotal + record.rate, 0)
      );
    }, 0);
  };

  return (
    <div className="gradient-bg flex flex-col min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">सर्व उत्पादक बिल कपात रक्कम</h1>

        {/* Date Range Inputs */}
        <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
          <div className="w-full sm:w-auto">
            <input
              type="date"
              className="text-black p-2 text-xl font-mono mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md shadow-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="text-white">ते</div>
          <div className="w-full sm:w-auto">
            <input
              type="date"
              className="text-black p-2 text-xl font-mono mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md shadow-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="w-full md:w-36 p-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md shadow-black transition-transform duration-300 hover:scale-105"
            onClick={fetchBillKapatData}
          >
            Fetch Data
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Loading State */}
        {loading && (
          <p>
            <Loading />
          </p>
        )}

        {/* Data Table */}
        {!loading && billKapatData.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-1/2 border-collapse border border-gray-200 bg-slate-100">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="text-black border border-gray-300 px-4 py-2 text-left">
                    उत्पादक नं
                  </th>
                  <th className="text-black border border-gray-300 px-4 py-2 text-left">
                    कपात तारीख
                  </th>
                  <th className="text-black border border-gray-300 px-4 py-2 text-left">
                    रक्कम
                  </th>
                  <th className="text-black border border-gray-300 px-4 py-2 text-left">
                    अपडेट
                  </th>
                </tr>
              </thead>
              <tbody>
                {billKapatData.map((user) =>
                  user.records.map((record) => (
                    <tr key={record._id} className="border-b">
                      <td className="text-black border border-gray-300 px-4 py-2">
                        {user.registerNo}
                      </td>
                      <td className="text-black border border-gray-300 px-4 py-2">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="text-black border border-gray-300 px-4 py-2">
                        {editingRecord === record._id ? (
                          <input
                            type="number"
                            className="w-20 p-1 border border-gray-400 rounded"
                            value={updatedRate}
                            onChange={(e) => setUpdatedRate(e.target.value)}
                          />
                        ) : (
                          record.rate
                        )}
                      </td>

                      <td className="text-black border border-gray-300 px-4 py-2">
                        {editingRecord === record._id ? (
                          <button
                            className="bg-green-500 text-white px-2 py-1 rounded"
                            onClick={() => handleUpdate(record._id)}
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            className="bg-blue-500 text-white px-2 py-1 rounded"
                            onClick={() => handleEdit(record)}
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}

                {/* Total Row */}
                <tr className="bg-gray-200">
                  <td className="text-black border border-gray-300 px-4 py-2" colSpan="2">
                    <strong>Total:</strong>
                  </td>
                  <td className="text-black border border-gray-300 px-4 py-2">
                    <strong>{calculateTotal()}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillKapatTable;
