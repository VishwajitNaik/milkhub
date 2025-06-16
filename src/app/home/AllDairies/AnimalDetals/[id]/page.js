"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

function AnimalDetails() {
  const { id } = useParams();
  const [animalDetails, setAnimalDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const [filteredDetails, setFilteredDetails] = useState([]);
      const [showInYears, setShowInYears] = useState(false);
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
        const response = await axios.get(`/api/sangh/Animal/${id}`);
        setAnimalDetails(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching animal details:", error.message);
        setError("Error fetching animal details");
        setLoading(false);
      }
    };

    fetchAnimalDetails();
  }, [id]);

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

  if (loading) return <p className="p-4 text-blue-600">Loading...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Animal Details</h1>
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

        
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-black">Register No</th>
              <th className="border px-4 py-2 text-black">Owner Name</th>
              <th className="border px-4 py-2 text-black">Species</th>
              <th className="border px-4 py-2 text-black">Gender</th>
              <th className="border px-4 py-2 text-black">Breed</th>
              <th className="border px-4 py-2 text-black">Age</th>
              <th className="border px-4 py-2 text-black">Village</th>
              <th className="border px-4 py-2 text-black">Tahasil</th>
              <th className="border px-4 py-2 text-black">District</th>
              <th className="border px-4 py-2 text-black">Date</th>
              <th className="border px-4 py-2 text-black">Purpose</th>
              <th className="border px-4 py-2 text-black">Running Month</th>
              <th className="border px-4 py-2 text-black">Tag Status</th>
              <th className="border px-4 py-2 text-black">Health</th>
            </tr>
          </thead>
          <tbody>
    {filteredDetails.map((animal) => (
  <tr key={animal._id} className="text-center">
    <td className="border px-4 py-2 text-black">{animal.registerNo}</td>
    <td className="border px-4 py-2 text-black">{animal.username}</td>
    <td className="border px-4 py-2 text-black">{animal.species}</td>
    <td className="border px-4 py-2 text-black">{animal.animalGender}</td>
    <td className="border px-4 py-2 text-black">{animal.breed}</td>
    <td className="border px-4 py-2 text-black">
      {showInYears
        ? `${(animal.age / 12).toFixed(1)} yrs`
        : `${animal.age} months`}
    </td>
    <td className="border px-4 py-2 text-black">{animal.village}</td>
    <td className="border px-4 py-2 text-black">{animal.tahasil}</td>
    <td className="border px-4 py-2 text-black">{animal.district}</td>
    <td className="border px-4 py-2 text-black">
      {new Date(animal.date).toLocaleDateString("en-IN")}
    </td>
    <td className="border px-4 py-2 text-black">{animal.purpose}</td>
    <td className="border px-4 py-2 text-black">{animal.runningMonth || "-"}</td>
    <td className="border px-4 py-2 text-black">{animal.tagStatus}</td>
    <td className="border px-4 py-2 text-black">{animal.healthStatus}</td>
  </tr>
))}

          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AnimalDetails;
