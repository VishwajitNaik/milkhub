"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import Loading from "../../components/Loading/Loading";

const DrProfile = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    specialization: "",
    sangh: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/Docter/profile");
        setDoctorData(response.data.data);
        setFormData({
          name: response.data.data.name,
          phone: response.data.data.phone,
          address: response.data.data.address,
          specialization: response.data.data.specialization,
          sangh: response.data.data.sangh,
        });
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load profile data");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put("/api/Docter/updateDr", formData);
      setDoctorData(response.data.data);
      setIsEditing(false);
      // Optionally show success toast
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="text-center mt-20">
      <Loading />
    </div>
  );

  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="gradient-bg flex flex-col min-h-screen">
    <div className="bg-white p-6 rounded-lg mt-10 shadow-md w-full max-w-4xl mx-auto">
      <div className="flex justify-center mb-6">
        <Image 
          src="/assets/avatar.png" 
          alt="Doctor Profile" 
          width={150} 
          height={150}
          className="rounded-full border-4 border-blue-200"
        />
      </div>
      
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Doctor Profile
      </h1>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border text-black border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">Phone:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border text-black border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="block text-gray-700 font-medium">Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 border text-black border-gray-300 rounded-md"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">Specialization:</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className="w-full p-2 border text-black border-gray-300 rounded-md"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">Sangh:</label>
              <input
                type="text"
                name="sangh"
                value={formData.sangh}
                onChange={handleInputChange}
                className="w-full p-2 border text-black border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div className="flex justify-center space-x-4 pt-4">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all duration-300"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="bg-blue-100 p-4 rounded-lg shadow-md flex items-center">
            <strong className="bg-blue-200 text-gray-700 p-2 rounded-md mr-2">
              Name:
            </strong>
            <span className="text-gray-800 text-lg font-medium">
              {doctorData?.name}
            </span>
          </div>
          
          <div className="bg-blue-100 p-4 rounded-lg shadow-md flex items-center">
            <strong className="bg-blue-200 text-gray-700 p-2 rounded-md mr-2">
              Phone:
            </strong>
            <span className="text-gray-800 text-lg font-medium">
              {doctorData?.phone}
            </span>
          </div>
          
          <div className="bg-blue-100 p-4 rounded-lg shadow-md flex items-center md:col-span-2">
            <strong className="bg-blue-200 text-gray-700 p-2 rounded-md mr-2">
              Address:
            </strong>
            <span className="text-gray-800 text-lg font-medium">
              {doctorData?.address || "Not provided"}
            </span>
          </div>
          
          <div className="bg-blue-100 p-4 rounded-lg shadow-md flex items-center">
            <strong className="bg-blue-200 text-gray-700 p-2 rounded-md mr-2">
              Specialization:
            </strong>
            <span className="text-gray-800 text-lg font-medium">
              {doctorData?.specialization || "Not specified"}
            </span>
          </div>
          
          <div className="bg-blue-100 p-4 rounded-lg shadow-md flex items-center">
            <strong className="bg-blue-200 text-gray-700 p-2 rounded-md mr-2">
              Sangh:
            </strong>
            <span className="text-gray-800 text-lg font-medium">
              {doctorData?.sangh || "Not specified"}
            </span>
          </div>
          
          <div className="col-span-1 md:col-span-2 flex justify-center pt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all duration-300"
            >
              Update Profile
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default DrProfile;