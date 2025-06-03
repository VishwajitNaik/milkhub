"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Loading from "../../../../components/Loading/Loading";

const OwnerProfile = () => {
  const [ownerData, setOwnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    SanghName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/sangh/getDetails");

        setOwnerData(response.data.data);
        setFormData({
          SanghName: response.data.data.SanghName,
          email: response.data.data.email,
          phone: response.data.data.phone,
        });
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load owner data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("/api/sangh/updateSangh", formData);
      setOwnerData(response.data.data);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update owner profile");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-20">
        <Loading />
      </div>
    );
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="gradient-bg flex flex-col min-h-screen">
      {isEditing ? (
        <div className="container mx-auto p-4 bg-white p-6 rounded-lg mt-10 shadow-md w-full max-w-4xl shadow-white">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Update Owner Profile
          </h1>
          <form
            onSubmit={handleUpdate}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <div>
              <label className="block text-sm mb-1 text-black">Name:</label>
              <input
                type="text"
                name="SanghName"
                value={formData.SanghName}
                onChange={handleInputChange}
                className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-black">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-black">Phone:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
              />
            </div>
            <div className="col-span-1 md:col-span-2 text-center">
              <button
                type="submit"
                className="text-center w-full md:w-36 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md shadow-black transition-transform duration-300 hover:scale-105"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg mt-10 shadow-md w-full max-w-4xl mx-auto shadow-white">
          <Image src="/assets/avatar.png" alt="Logo" width={200} height={200} />
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Owner Profile
          </h1>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <p className="bg-blue-100 p-4 rounded-lg shadow-md flex items-center">
              <strong className="bg-blue-200 text-gray-700 p-2 rounded-md mr-2">
                Name:
              </strong>
              <span className="text-gray-800 text-lg font-medium">
                {ownerData.SanghName}
              </span>
            </p>
            <p className="bg-blue-100 p-4 rounded-lg shadow-md flex items-center">
              <strong className="bg-blue-200 text-gray-700 p-2 rounded-md mr-2">
                Email:
              </strong>
              <span className="text-gray-800 text-lg font-medium">
                {ownerData.email}
              </span>
            </p>
            <p className="bg-blue-100 p-4 rounded-lg shadow-md flex items-center">
              <strong className="bg-blue-200 text-gray-700 p-2 rounded-md mr-2">
                Phone:
              </strong>
              <span className="text-gray-800 text-lg font-medium">
                {ownerData.phone}
              </span>
            </p>
            <div className="col-span-1 md:col-span-2 flex justify-center">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all duration-300"
              >
                अपडेट प्रोफाइल
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerProfile;
