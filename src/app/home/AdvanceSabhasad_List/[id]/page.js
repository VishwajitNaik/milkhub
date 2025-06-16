"use client";
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Loading from "@/app/components/Loading/Loading";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalAdvance, setTotalAdvance] = useState(0);
  const { id } = useParams();

  const fetchOrders = useCallback(async () => {
    if (startDate && endDate) {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/advance/GetAdvanceUserSide', {
          params: {
            userId: id,
            startDate,
            endDate,
          },
        });
        setOrders(response.data.data || []);
        setTotalAdvance(response.data.totalAdvance || 0);
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please select both start and end dates.');
      setLoading(false);
    }
  }, [id, startDate, endDate]);

  useEffect(() => {
    if (startDate && endDate) {
      fetchOrders();
    }
  }, [fetchOrders, startDate, endDate]);

  const totalRate = orders.reduce((total, order) => total + parseFloat(order.rakkam || 0), 0);

  return (
    <div className="gradient-bg flex flex-col min-h-screen">
      <div className="container mx-auto p-2 md:p-4">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center bg-transparent shadow-md rounded-md shadow-black w-full md:w-fit p-2 mx-auto">
          सभासद अडवांस 
        </h1>

        <div className="mb-4 flex flex-col md:flex-row gap-2 md:gap-4 md:items-center justify-center">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <label className="block font-bold text-base md:text-lg p-2 shadow-md rounded-md shadow-black w-full md:w-auto">
              पासून
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-black p-1 md:p-2 text-sm md:text-xl font-mono border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md shadow-sm"
              />
            </label>
            <label className="block font-bold text-base md:text-lg p-2 shadow-md rounded-md shadow-black w-full md:w-auto">
              पर्यंत
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-black p-1 md:p-2 text-sm md:text-xl font-mono border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md shadow-sm"
              />
            </label>
          </div>
          <button
            onClick={fetchOrders}
            className="w-full md:w-36 p-2 md:p-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md shadow-black transition-transform duration-300 hover:scale-105"
          >
            अडवांस पहा 
          </button>
        </div>
        
        {error && <p className="text-red-500 text-center">{error}</p>}
        
        {loading ? (
          <Loading />
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto rounded-md shadow-md shadow-black">
            <table className="w-full bg-white text-black shadow-md rounded-lg text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-200 font-bold">
                  <th className="py-2 px-2 md:py-3 md:px-4 border-b text-center">तारीख</th>
                  <th className="py-2 px-2 md:py-3 md:px-4 border-b text-center">रक्कम</th>
                  <th className="py-2 px-2 md:py-3 md:px-4 border-b text-center">कृती</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-100">
                    <td className="py-1 px-1 md:py-2 md:px-4 border-b text-center font-bold whitespace-nowrap">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="py-1 px-1 md:py-2 md:px-4 border-b text-center whitespace-nowrap">
                      {order.rakkam}
                    </td>
                    <td className="py-1 px-1 md:py-2 md:px-4 border-b text-center">
                      <button
                        className="bg-red-500 text-white px-2 py-1 md:px-4 md:py-2 rounded hover:bg-red-700 transition text-xs md:text-base"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-300 font-bold">
                  <td className="py-2 px-2 md:py-3 md:px-4 border-t text-center whitespace-nowrap">एकूण</td>
                  <td className="py-2 px-2 md:py-3 md:px-4 border-t text-center whitespace-nowrap">{totalRate.toFixed(2)}</td>
                  <td className="py-2 px-2 md:py-3 md:px-4 border-t text-center"></td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center font-bold text-lg md:text-2xl my-4">
            या तारखांमध्ये अडवांस उपलब्ध नाही.
          </p>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;