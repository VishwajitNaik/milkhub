'use client';
import { useParams } from 'next/navigation';
import Loading from '@/app/components/Loading/Loading';
import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';

const Page = () => {
  const { id } = useParams();
  const [animalDetails, setAnimalDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimalDetails = async () => {
      try {
        const response = await axios.get(`/api/AnimalDetails/getAnimalDetails`, {
          params: { userId: id },
        });
        setAnimalDetails(response.data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAnimalDetails();
  }, [id]);

  const handleDelete = async (animalId) => {
    const confirmDelete = confirm("Are you sure you want to delete this animal?");
    if (!confirmDelete) return;
  
    try {
      const response = await axios.delete(`/api/AnimalDetails/DeleteAnimal`, {
        params: { id: animalId },
      });
  
      if (response.data.success) {
        setAnimalDetails(prev => prev.filter(animal => animal._id !== animalId));
        alert("Animal deleted successfully");
      } else {
        alert("Failed to delete animal: " + response.data.message);
      }
    } catch (error) {
      console.error("Error deleting animal:", error.message);
      alert("Error deleting animal");
    }
  };
  

  if (loading) return <Loading />;
  if (error) return <p className="text-red-600 text-center">Error fetching animal details</p>;

  return (
    <div className="gradient-bg flex flex-col min-h-screen p-4">
      <div className='bg-blue-50 rounded-lg shadow-md p-4'>
        <h1 className="text-2xl font-bold text-black text-center py-4">Animal Details</h1>
        {animalDetails.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-400">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border text-center border-gray-300 text-black px-2 py-1">R. No</th>
                  <th className="border text-center border-gray-300 text-black px-2 py-1">Username</th>
                  <th className="border text-center border-gray-300 text-black px-2 py-1">Species</th>
                  <th className="border text-center border-gray-300 text-black px-2 py-1">Breed</th>
                  <th className="border text-center border-gray-300 text-black px-2 py-1">Tag ID</th>
                  <th className="border text-center border-gray-300 text-black px-2 py-1">Tag Status</th>
                  <th className="border text-center border-gray-300 text-black px-2 py-1">Purpose</th>
                  <th className="border text-center border-gray-300 text-black px-2 py-1">Health</th>
                  <th className="border text-center border-gray-300 text-black px-2 py-1">Disease</th>
                  <th className="border text-center border-gray-300 text-black px-2 py-1">Age (months)</th>
                  <th className="border text-center border-gray-300 text-black px-2 py-1">Action</th>
                </tr>
              </thead>
              <tbody>
                {animalDetails.map((animal) => (
                  <tr key={animal._id} className="hover:bg-gray-50">
                    <td className="border text-center border-gray-300 text-black px-2 py-1">{animal.registerNo}</td>
                    <td className="border text-center border-gray-300 text-black px-2 py-1">{animal.username}</td>
                    <td className="border text-center border-gray-300 text-black px-2 py-1">{animal.species}</td>
                    <td className="border text-center border-gray-300 text-black px-2 py-1">{animal.breed}</td>
                    <td className="border text-center border-gray-300 text-black px-2 py-1">{animal.tagId || 'N/A'}</td>
                    <td className="border text-center border-gray-300 text-black px-2 py-1">{animal.tagStatus}</td>
                    <td className="border text-center border-gray-300 text-black px-2 py-1">{animal.purpose}</td>
                    <td className="border text-center border-gray-300 text-black px-2 py-1">{animal.healthStatus}</td>
                    <td className="border text-center border-gray-300 text-black px-2 py-1">{animal.typeOfDisease || 'N/A'}</td>
                    <td className="border text-center border-gray-300 text-black px-2 py-1">{animal.age}</td>
                    <td className="border text-center border-gray-300 px-2 py-1">
                      <button
                        onClick={() => handleDelete(animal._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-4">No animal data found.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
