"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const AnimalDetailsPage = () => {
  const [animalDetails, setAnimalDetails] = useState([]);
  const [filteredDetails, setFilteredDetails] = useState([]);
  const [showInYears, setShowInYears] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    village: "",
    tahasil: "",
    district: "",
    registerNo: "",
    username: "",
    species: "",
    breed: "",
    tagId: "",
    animalGender: "",
    age: "",
    quantityOfMilk: "",
    tagStatus: "",
    purpose: "",
    healthStatus: "",
    typeOfDisease: "",
  });

  const filterOptions = {
    species: ["Cow", "Buffalo", "Goat", "Other"],
    animalGender: ["Male", "Female"],
    tagStatus: ["tagged", "untagged"],  // changed "Untagged" to "untagged"
    healthStatus: ["Healthy", "Sick"],
    typeOfDisease: ["FMD", "Mastitis", "Brucellosis", "None"],
  };
  

  useEffect(() => {
    const fetchAnimalDetails = async () => {
      try {
        const res = await axios.get("/api/AnimalDetails/AllOwnerAnimal");
        setAnimalDetails(res.data.data);
        setFilteredDetails(res.data.data);
      } catch (error) {
        console.error("Error fetching animal details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimalDetails();
  }, []);

  // Filter handler
  useEffect(() => {
    const filtered = animalDetails.filter((animal) =>
      Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
  
        const filterValue = value.toLowerCase();
        const animalValue = animal[key]?.toString().toLowerCase() || "";
  
        // Use exact match for dropdown filters
        if (filterOptions[key]) {
          return animalValue === filterValue;
        }
  
        // Use includes for text inputs
        return animalValue.includes(filterValue);
      })
    );
    setFilteredDetails(filtered);
  }, [filters, animalDetails]);
  

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAgeFormat = () => setShowInYears((prev) => !prev);

  return (
    <div className="gradient-bg flex flex-col min-h-screen p-4">
      <div className="bg-blue-50 rounded-lg shadow-md p-4">
        <h1 className="text-2xl font-bold text-black text-center py-4">Animal Details</h1>
        <button
          onClick={toggleAgeFormat}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showInYears ? "Show Age in Months" : "Convert Age to Years"}
        </button>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {Object.entries(filters).map(([key, val]) => {
            const isDropdown = Object.keys(filterOptions).includes(key);
            return isDropdown ? (
            <select
                key={key}
                value={filters[key]}
                onChange={(e) => handleFilterChange(key, e.target.value)}
                className="border p-1 text-black rounded text-sm"
            >
                <option value="">{`All ${key}`}</option>
                {filterOptions[key].map((option) => (
                <option key={option} value={option}>{option}</option>
                ))}
            </select>
            ) : (
            <input
                key={key}
                type="text"
                placeholder={`Search by ${key}`}
                value={filters[key]}
                onChange={(e) => handleFilterChange(key, e.target.value)}
                className="border p-1 text-black rounded text-sm"
            />
            );
        })}
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : filteredDetails.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-400 text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="text-black border text-center px-2 py-1">District</th>
                  <th className="text-black border text-center px-2 py-1">Tahasil</th>
                  <th className="text-black border text-center px-2 py-1">Village</th>
                  <th className="text-black border text-center px-2 py-1">R. No</th>
                  <th className="text-black border text-center px-2 py-1">Username</th>
                  <th className="text-black border text-center px-2 py-1">Species</th>
                  <th className="text-black border text-center px-2 py-1">Breed</th>
                  <th className="text-black border text-center px-2 py-1">Tag ID</th>
                  <th className="text-black border text-center px-2 py-1">Gender</th>
                  <th className="text-black border text-center px-2 py-1">Age</th>
                  <th className="text-black border text-center px-2 py-1">Milk Qty</th>
                  <th className="text-black border text-center px-2 py-1">Tag Status</th>
                  <th className="text-black border text-center px-2 py-1">Purpose</th>
                  <th className="text-black border text-center px-2 py-1">Health</th>
                  <th className="text-black border text-center px-2 py-1">Disease</th>
                </tr>
              </thead>
              <tbody>
                {filteredDetails.map((animal) => (
                  <tr key={animal._id} className="hover:bg-gray-50">
                    <td className="text-black border text-center px-2 py-1">{animal.district}</td>
                    <td className="text-black border text-center px-2 py-1">{animal.tahasil}</td>
                    <td className="text-black border text-center px-2 py-1">{animal.village}</td>
                    <td className="text-black border text-center px-2 py-1">{animal.registerNo || "N/A"}</td>
                    <td className="text-black border text-center px-2 py-1">{animal.username || "N/A"}</td>
                    <td className="text-black border text-center px-2 py-1">{animal.species}</td>
                    <td className="text-black border text-center px-2 py-1">{animal.breed}</td>
                    <td className="text-black border text-center px-2 py-1">{animal.tagId || "N/A"}</td>
                    <td className="text-black border text-center px-2 py-1">{animal.animalGender}</td>
                    <td className="text-black border text-center px-2 py-1">
                    {showInYears
                      ? `${(animal.age / 12).toFixed(1)} years`
                      : `${animal.age} months`}
                  </td>
                    <td className="text-black border text-center px-2 py-1">{animal.quantityOfMilk || "N/A"}</td>
                    <td className="text-black border text-center px-2 py-1">{animal.tagStatus}</td>
                    <td className="text-black border text-center px-2 py-1">{animal.purpose}</td>
                    <td className="text-black border text-center px-2 py-1">{animal.healthStatus}</td>
                    <td className="text-black border text-center px-2 py-1">{animal.typeOfDisease || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">No animal data found.</p>
        )}
      </div>
    </div>
  );
};

export default AnimalDetailsPage;
