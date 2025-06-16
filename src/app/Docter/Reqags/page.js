"use client";

import { useEffect, useState } from "react";
import axios from "axios";

// Format date as dd/mm/yyyy
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function AnimalTable() {
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const [showTagForm, setShowTagForm] = useState(false);
  const [tagIdInput, setTagIdInput] = useState("");
  const [animalForTagging, setAnimalForTagging] = useState(null);

  useEffect(() => {
    async function fetchAnimals() {
      try {
        const res = await axios.get("/api/Docter/getReqTagAnimal");
        const data = res.data.data || [];
        setAnimals(data);
        setFilteredAnimals(data);
      } catch (err) {
        setError("Failed to fetch animal details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnimals();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    const filtered = animals.filter((animal) =>
      [animal.village, animal.tahasil, animal.district, animal.username]
        .some(field => field?.toLowerCase().includes(query))
    );
    setFilteredAnimals(filtered);
  };

  const groupedByTagType = filteredAnimals.reduce((acc, animal) => {
    const key = animal.tagType || "Unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(animal);
    return acc;
  }, {});

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="p-4 min-h-screen gradient-bg">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">Animal Records</h2>

      <div className="mb-4 text-center">
        <input
          type="text"
          placeholder="Search village, tahasil, district, username..."
          value={search}
          onChange={handleSearch}
          className="p-2 text-black border border-gray-400 rounded w-full md:w-1/3"
        />
      </div>

      {Object.keys(groupedByTagType).map((tagType) => (
        <div key={tagType} className="mb-8">
          <h3 className="text-lg font-semibold mb-2">{tagType}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs md:text-sm border border-gray-300">
              <thead className="bg-gray-100 text-black">
                <tr>
                  <th className="border p-2">No</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Village</th>
                  <th className="border p-2">Username</th>
                  <th className="border p-2">Tag</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white text-gray-700">
                {groupedByTagType[tagType].map((animal, index) => (
                  <tr key={animal._id} className="text-center">
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{formatDate(animal.date)}</td>
                    <td className="border p-2">{animal.village}</td>
                    <td className="border p-2 max-w-[120px] whitespace-nowrap overflow-x-auto overflow-y-hidden text-ellipsis scrollbar-thin scrollbar-thumb-gray-400">
                      {animal.username}
                    </td>
                    <td className="border p-2">{animal.tagStatus}</td>
                    <td className="border p-2 space-x-2">
                      <button
                        className="text-blue-500 underline"
                        onClick={() => setSelectedAnimal(animal)}
                      >
                        More
                      </button>
                      <button
                        className="text-green-500 underline"
                        onClick={() => {
                          setAnimalForTagging(animal);
                          setTagIdInput("");
                          setShowTagForm(true);
                        }}
                      >
                        Add Tag
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Details Popup */}
      {selectedAnimal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 w-11/12 max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-xl"
              onClick={() => setSelectedAnimal(null)}
            >
              ✖
            </button>
            <h3 className="text-lg text-black font-bold mb-4">Animal Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
              {Object.entries(selectedAnimal)
                .filter(([key]) =>
                  !["_id", "__v", "createdAt", "updatedAt", "createdBy", "registerNo"].includes(key))
                .map(([key, value]) => (
                  <div key={key} className="border p-1 rounded bg-gray-50">
                    <strong>{key}:</strong>{" "}
                    {["date", "DOB"].includes(key)
                      ? formatDate(value)
                      : typeof value === "boolean"
                      ? value ? "Yes" : "No"
                      : String(value)}
                  </div>
              ))}

            </div>
          </div>
        </div>
      )}

      {/* Add Tag Popup */}
      {showTagForm && animalForTagging && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 w-11/12 max-w-md relative">
            <button
              className="absolute top-2 right-2 text-xl"
              onClick={() => {
                setShowTagForm(false);
                setAnimalForTagging(null);
              }}
            >
              ✖
            </button>
            <h3 className="text-lg text-black font-bold mb-4">Add Tag to Animal</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  setLoading(true);
                  await axios.put(`/api/Docter/updateTagAnimal/${animalForTagging._id}`, {
                    tagId: tagIdInput,
                    tagStatus: "tagged",
                    require: false,
                  });
                  alert("Tag added successfully");
                  setShowTagForm(false);
                  setAnimalForTagging(null);
                  // Refresh data
                  const res = await axios.get("/api/Docter/getReqTagAnimal");
                  const data = res.data.data || [];
                  setAnimals(data);
                  setFilteredAnimals(data);
                } catch (err) {
                  console.error("Failed to update tag", err);
                  alert("Failed to update tag.");
                } finally {
                  setLoading(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">Tag ID:</label>
                <input
                  type="text"
                  value={tagIdInput}
                  onChange={(e) => setTagIdInput(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
