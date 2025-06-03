"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';

const RatesDisplay = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get('/api/milkrate/getRates');
        setRates(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rates:", error.message);
        setError("Error fetching rates");
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const deleteRate = async (rateId) => {
    try {
      await axios.delete(`/api/milkrate/deleterate?id=${rateId}`);
      setRates((prevRates) => prevRates.filter((rate) => rate._id !== rateId));
    } catch (error) {
      console.error("Error deleting rate:", error.message);
      alert("Error deleting rate");
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="gradient-bg">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-white text-center bg-transparent p-2 shadow-md shadow-black">
          दूध दर
        </h1>

        {/* Desktop View */}
        <div className="hidden md:block w-full max-w-4xl bg-white shadow-md rounded-lg p-6 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th colSpan="4" className="text-black py-3 px-4 border-b bg-gray-300">म्हैस दर</th>
                <th colSpan="4" className="text-black py-3 px-4 border-b bg-gray-300">गाय दर</th>
                <th className="text-black py-3 px-4 border-b bg-gray-300"></th>
              </tr>
              <tr>
                <th className="text-black py-3 px-4 border-b bg-gray-200">जास्त फॅट</th>
                <th className="text-black py-3 px-4 border-b bg-gray-200">जास्त फॅट दर</th>
                <th className="text-black py-3 px-4 border-b bg-gray-200">कमी फॅट</th>
                <th className="text-black py-3 px-4 border-b bg-gray-200">कमी फॅट दर</th>
                <th className="text-black py-3 px-4 border-b bg-gray-200">जास्त फॅट</th>
                <th className="text-black py-3 px-4 border-b bg-gray-200">जास्त फॅट दर</th>
                <th className="text-black py-3 px-4 border-b bg-gray-200">कमी फॅट</th>
                <th className="text-black py-3 px-4 border-b bg-gray-200">कमी फॅट दर</th>
                <th className="text-black py-3 px-4 border-b bg-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rates.map((rate) => (
                <tr key={rate._id} className="text-center">
                  <td className="text-black py-2 px-4 border-b">{rate.HighFatB}</td>
                  <td className="text-black py-2 px-4 border-b">{rate.HighRateB}</td>
                  <td className="text-black py-2 px-4 border-b">{rate.LowFatB}</td>
                  <td className="text-black py-2 px-4 border-b">{rate.LowRateB}</td>
                  <td className="text-black py-2 px-4 border-b">{rate.HighFatC}</td>
                  <td className="text-black py-2 px-4 border-b">{rate.HighRateC}</td>
                  <td className="text-black py-2 px-4 border-b">{rate.LowFatC}</td>
                  <td className="text-black py-2 px-4 border-b">{rate.LowRateC}</td>
                  <td className="text-black py-2 px-4 border-b">
                    <button
                      onClick={() => deleteRate(rate._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      डिलिट करा
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden w-full">
          {rates.map((rate) => (
            <div key={rate._id} className="bg-white shadow-md rounded-lg p-4 mb-4">
              {/* Buffalo Rates */}
              <div className="mb-4">
                <h2 className="text-lg font-bold text-black text-center bg-gray-300 py-2 rounded-t">म्हैस दर</h2>
                <div className="grid grid-cols-2 gap-2 border-b border-gray-200 pb-2">
                  <div className="text-black text-center bg-gray-100 p-2">जास्त फॅट</div>
                  <div className="text-black text-center bg-gray-100 p-2">{rate.HighFatB}</div>
                  <div className="text-black text-center bg-gray-100 p-2">जास्त फॅट दर</div>
                  <div className="text-black text-center bg-gray-100 p-2">{rate.HighRateB}</div>
                  <div className="text-black text-center bg-gray-100 p-2">कमी फॅट</div>
                  <div className="text-black text-center bg-gray-100 p-2">{rate.LowFatB}</div>
                  <div className="text-black text-center bg-gray-100 p-2">कमी फॅट दर</div>
                  <div className="text-black text-center bg-gray-100 p-2">{rate.LowRateB}</div>
                </div>
              </div>

              {/* Cow Rates */}
              <div className="mb-4">
                <h2 className="text-lg font-bold text-black text-center bg-gray-300 py-2 rounded-t">गाय दर</h2>
                <div className="grid grid-cols-2 gap-2 border-b border-gray-200 pb-2">
                  <div className="text-black text-center bg-gray-100 p-2">जास्त फॅट</div>
                  <div className="text-black text-center bg-gray-100 p-2">{rate.HighFatC}</div>
                  <div className="text-black text-center bg-gray-100 p-2">जास्त फॅट दर</div>
                  <div className="text-black text-center bg-gray-100 p-2">{rate.HighRateC}</div>
                  <div className="text-black text-center bg-gray-100 p-2">कमी फॅट</div>
                  <div className="text-black text-center bg-gray-100 p-2">{rate.LowFatC}</div>
                  <div className="text-black text-center bg-gray-100 p-2">कमी फॅट दर</div>
                  <div className="text-black text-center bg-gray-100 p-2">{rate.LowRateC}</div>
                </div>
              </div>

              {/* Delete Button - spans two columns */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="col-span-2">
                  <button
                    onClick={() => deleteRate(rate._id)}
                    className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                  >
                    डिलिट करा
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatesDisplay;