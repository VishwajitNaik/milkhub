// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function AnimalDetailsTable() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAnimalData = async () => {
//       try {
//         const response = await axios.post("/api/AnimalDetails/SanghAllAnimal"); // Adjust path if needed
//         setData(response.data.data);
//         console.log(response.data.data);
//       } catch (error) {
//         console.error("Error fetching animal details:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnimalData();
//   }, []);

//   if (loading) return <p className="text-center py-10">Loading...</p>;

//   return (
//     <div className="overflow-x-auto p-4">
//       <table className="min-w-full border bg-white border-gray-300 text-sm text-left">
//         <thead className="bg-gray-100 text-gray-700 uppercase">
//           <tr>
//             <th className="border px-4 py-2 text-black">Date</th>
//             <th className="border px-4 py-2 text-black">Village</th>
//             <th className="border px-4 py-2 text-black">Tahasil</th>
//             <th className="border px-4 py-2 text-black">District</th>
//             <th className="border px-4 py-2 text-black">Dairy Name</th>
//             <th className="border px-4 py-2 text-black">Username</th>
//             <th className="border px-4 py-2 text-black">Species</th>
//             <th className="border px-4 py-2 text-black">Gender</th>
//             <th className="border px-4 py-2 text-black">Breed</th>
//             <th className="border px-4 py-2 text-black">Age</th>
//             <th className="border px-4 py-2 text-black">Purpose</th>
//             <th className="border px-4 py-2 text-black">Milk Qty</th>
//             <th className="border px-4 py-2 text-black">Running Month</th>
//             <th className="border px-4 py-2 text-black">Tag Status</th>
//             <th className="border px-4 py-2 text-black">Tag Type</th>
//             <th className="border px-4 py-2 text-black">Tag ID</th>
//             <th className="border px-4 py-2 text-black">Health</th>
//             <th className="border px-4 py-2 text-black">Disease</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((animal, index) => (
//             <tr key={index} className="hover:bg-gray-50">
//               <td className="border px-4 py-2 text-black">{new Date(animal.date).toLocaleDateString()}</td>
//               <td className="border px-4 py-2 text-black">{animal.village}</td>
//               <td className="border px-4 py-2 text-black">{animal.tahasil}</td>
//               <td className="border px-4 py-2 text-black">{animal.district}</td>
//               <td className="border px-4 py-2 text-black">{animal.dairyName}</td>
//               <td className="border px-4 py-2 text-black">{animal.username}</td>
//               <td className="border px-4 py-2 text-black">{animal.species}</td>
//               <td className="border px-4 py-2 text-black">{animal.animalGender}</td>
//               <td className="border px-4 py-2 text-black">{animal.breed}</td>
//               <td className="border px-4 py-2 text-black">{animal.age}</td>
//               <td className="border px-4 py-2 text-black">{animal.purpose}</td>
//               <td className="border px-4 py-2 text-black">{animal.quantityOfMilk}</td>
//               <td className="border px-4 py-2 text-black">{animal.runningMonth}</td>
//               <td className="border px-4 py-2 text-black">{animal.tagStatus}</td>
//               <td className="border px-4 py-2 text-black">{animal.tagType}</td>
//               <td className="border px-4 py-2 text-black">{animal.tagId}</td>
//               <td className="border px-4 py-2 text-black">{animal.healthStatus}</td>
//               <td className="border px-4 py-2 text-black">{animal.typeOfDisease}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// pages/owners/index.js
"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const OwnersPage = () => {
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch owner data
    useEffect(() => {
        const getOwners = async () => {
            try {
                const res = await axios.get("/api/sangh/getOwners");
                console.log("Sangh Data:", res.data.data);
                setOwners(res.data.data);
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-8 text-gray-700">Owners List</h1>
            <div className="overflow-x-auto w-full max-w-6xl bg-white shadow-md rounded-lg">
                <table className="min-w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-gray-600">Reg No</th>
                            <th className="px-6 py-3 text-left text-gray-600">Dairy name</th>
                            <th className="px-6 py-3 text-left text-gray-600">Email</th>
                            <th className="px-6 py-3 text-left text-gray-600">Phone</th>
                            <th className="px-6 py-3 text-left text-gray-600">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {owners.map((owner) => (
                            <tr key={owner._id} className="border-b">
                                <td className="text-black px-6 py-4">{owner.registerNo}</td>
                                <td className="text-black px-6 py-4">{owner.dairyName}</td>
                                <td className="text-black px-6 py-4">{owner.email}</td>
                                <td className="text-black px-6 py-4">{owner.phone}</td>
                                <td className="text-black px-6 py-4">
                                    <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
                                        <Link href={`/home/AllDairies/AnimalDetals/${owner._id}`}>
                                            <span className="text-black">Details</span>
                                        </Link>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OwnersPage;

