// pages/owners/index.js
"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const page = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch owner data
 useEffect(() => {
  const getOwners = async () => {
    try {
      const res = await axios.get("/api/Docter/getOwners");
      console.log("Sangh Data:", res.data.data);

      const mappedOwners = res.data.data.map((owner) => {
        const visitCount = res.data.visitCounts[owner._id] || 0;

        const mapped = {
          ...owner,
          address: res.data.addresses[owner._id] || null,
          visitCount
        };

        console.log("Mapped owner:", mapped);
        return mapped;
      });

      setOwners(mappedOwners);
      setLoading(false);

    } catch (error) {
      console.error("Failed to fetch owners:", error.message);
      setError("Failed to fetch owners");
      setLoading(false);
    }
  };

  getOwners();
}, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  const handleOwnerDetails = (ownerId) => {
    // Implement the logic to handle owner details, e.g., navigate to a details page
    console.log("Show details for owner ID:", ownerId);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gradient-bg">
      <h1 className="text-3xl font-bold mb-8 text-gray-700">Owners List</h1>
      <div className="overflow-x-auto w-full max-w-6xl bg-white shadow-md rounded-lg">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-gray-600">Reg No</th>
              <th className="px-6 py-3 text-left text-gray-600">Dairy Name</th>
              <th className="px-6 py-3 text-left text-gray-600">Phone</th>
              <th className="px-6 py-3 text-left text-gray-600">Village</th>
              <th className="px-6 py-3 text-left text-gray-600">Taluka</th>
              <th className="px-6 py-3 text-left text-gray-600">District</th>
              <th className="px-6 py-3 text-left text-gray-600">Details</th>
            </tr>
          </thead>
          <tbody>
            {owners.map((owner) => (
              <tr key={owner._id} className="border-b">
                <td className="text-black px-6 py-4">{owner.registerNo}</td>
                <td className="text-black px-6 py-4">{owner.dairyName}</td>
                <td className="text-black px-6 py-4">{owner.phone}</td>
                <td className="text-black px-6 py-4">{owner.address?.village || '-'}</td>
                <td className="text-black px-6 py-4">{owner.address?.tahasil || '-'}</td>
                <td className="text-black px-6 py-4">{owner.address?.district || '-'}</td>
                <td className="text-black px-6 py-4">
                  <div className="relative inline-block">
                    <Link href={`/Docter/${owner._id}`}>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 relative">
                        View Details 
                      </button>
                    </Link>
                    {owner.visitCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {owner.visitCount}
                      </span>
                    )}
                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  )
}

export default page