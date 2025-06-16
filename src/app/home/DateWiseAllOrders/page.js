"use client";

import { useState } from "react";
import axios from "axios";

const OrdersByDateRange = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `/api/orders/datewiseAlluserOrder?startDate=${startDate}&endDate=${endDate}`
      );
      setOrders(response.data.data);
      setTotalOrders(response.data.totalOrders);
      setTotalAmount(response.data.totalAmount);
    } catch (err) {
      setError("Failed to fetch orders. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gradient-bg flex items-center flex-col min-h-screen p-4 sm:p-8">
      <h1 className="text-2xl mb-4 text-center">Orders by Date Range</h1>

      {/* Date Picker Inputs */}
      <div className="mb-4 flex flex-wrap gap-4 justify-center items-center">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="text-black p-2 font-mono border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-40 bg-gray-200 rounded-md shadow-sm"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="text-black p-2 font-mono border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-40 bg-gray-200 rounded-md shadow-sm"
        />
        <button
          onClick={fetchOrders}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Fetch Orders
        </button>
      </div>

      {/* Error / Loading */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="mb-4">Loading orders...</p>}

      {/* Orders Table */}
      {orders.length > 0 && (
        <div className="w-full overflow-x-auto mt-6">
          <table className="min-w-[600px] w-full border border-collapse text-center text-sm sm:text-base bg-white shadow-md rounded-md">
            <thead>
              <tr className="bg-gray-300">
                <th className="border text-black px-4 py-2 text-black">Date</th>
                <th className="border text-black px-4 py-2 text-black">रजिस्टर नं.</th>
                <th className="border text-black px-4 py-2 text-black">उत्पादकाचे नाव</th>
                <th className="border text-black px-4 py-2 text-black">खरेदी प्रकार</th>
                <th className="border text-black px-4 py-2 text-black">रक्कम</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="bg-gray-100">
                  <td className="border text-black px-4 py-2">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="border text-black px-4 py-2">{order.createdBy.registerNo}</td>
                  <td className="border text-black px-4 py-2">{order.createdBy.name}</td>
                  <td className="border text-black px-4 py-2">{order.kharediData}</td>
                  <td className="border text-black px-4 py-2">{order.rakkam}</td>
                </tr>
              ))}

              {/* Total Row */}
              <tr className="bg-gray-300 font-bold">
                <td className="border text-black px-4 py-2 text-black" colSpan="3">
                  एकूण रक्कम
                </td>
                <td className="border text-black px-4 py-2 text-black"></td>
                <td className="border text-black px-4 py-2 text-black">{totalAmount}</td>
              </tr>
            </tbody>
          </table>

          <p className="mt-4 font-bold text-center">Total Orders: {totalOrders}</p>
        </div>
      )}
    </div>
  );
};

export default OrdersByDateRange;
