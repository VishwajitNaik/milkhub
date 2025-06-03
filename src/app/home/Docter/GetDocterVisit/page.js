"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import bgImage from "/public/assets/Docter.jpeg"; // Adjust path if necessary

const GetDocterVisit = () => {
    const [doctors, setDoctors] = useState([]);
    const [decisesList, setDecisesList] = useState([]);
    const [animalTypes] = useState(["गाय", "म्हैस", "शेळी", "मेंढी"]);
    const [username, setUsername] = useState("");
    const [decises, setDecises] = useState("");
      const [currentDate, setCurrentDate] = useState('');
    const [animalType, setAnimalType] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [address, setAddress] = useState({
        village: "",
        tahasil: "",
        district: "",
    });

    useEffect(() => {
        const tomorrow = new Date(Date.now() + 86400000); // 1 day ahead
        const formattedDate = tomorrow.toISOString().split("T")[0];
        setCurrentDate(formattedDate);
      }, []);
      
      

    // Fetch address
    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const res = await axios.get("/api/owner/GetAddress");
                if (res.data.data && res.data.data.length > 0) {
                    const data = res.data.data[0];
                    setAddress({
                        village: data.village || "",
                        tahasil: data.tahasil || "",
                        district: data.district || "",
                    });
                }
            } catch (error) {
                console.error("Failed to fetch address:", error.message);
                setError("Failed to fetch address");
            }
        };
        fetchAddress();
    }, []);

    // Fetch doctors
    useEffect(() => {
        async function fetchUsers() {
            try {
                setLoading(true);
                const res = await axios.get("/api/user/getUserList");
                setDoctors(res.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch users:", error.message);
                setError("Failed to fetch users");
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    // Fetch diseases
    useEffect(() => {
        async function fetchDecises() {
            try {
                const res = await axios.get("/api/Docter/getDeciesOwnerSide");
                if (res.status === 200) {
                    setDecisesList(res.data.data);
                } else {
                    setError(res.data.message || "Failed to fetch diseases");
                }
            } catch (error) {
                console.error("Failed to fetch diseases:", error.message);
                setError("Failed to fetch diseases");
            }
        }
        fetchDecises();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            username,
            Decises: decises,
            AnimalType: animalType,
            village: address.village,
            tahasil: address.tahasil,
            district: address.district,
            date: currentDate,
        };

        try {
            const res = await axios.post("/api/Docter/GetDocterVisit", payload);
            toast.success(res.data.message || "Doctor Visit recorded successfully!");
            setUsername("");
            setDecises("");
            setAnimalType("");
        } catch (error) {
            console.error("Error storing visit information:", error.message);
            toast.error(error.response?.data?.error || "Failed to store visit information");
        }
    };

    return (
        <div className="gradient-bg flex flex-col min-h-screen">
        <div className="mt-12">
            {/* Form Container */}
            <div className="relative z-10 bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-xl w-full mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-blue-800">Doctor Visit</h1>
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">

                <div className="flex flex-wrap md:space-x-4 mb-4">

              <div className="flex flex-col mb-4 w-full md:w-1/2">
              <input
                type="date"
                id="date"
                className="text-black p-2 text-xl font-mono mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md shadow-sm"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} // only dates AFTER today
                />


              </div>
            </div>

                    {/* Address Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="village" className="block text-sm text-black">गाव</label>
                            <input
                                id="village"
                                name="village"
                                type="text"
                                value={address.village}
                                onChange={(e) => setAddress({ ...address, village: e.target.value })}
                                className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="tahasil" className="block text-sm text-black">तालुका</label>
                            <input
                                id="tahasil"
                                name="tahasil"
                                type="text"
                                value={address.tahasil}
                                onChange={(e) => setAddress({ ...address, tahasil: e.target.value })}
                                className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="district" className="block text-sm text-black">जिल्हा</label>
                            <input
                                id="district"
                                name="district"
                                type="text"
                                value={address.district}
                                onChange={(e) => setAddress({ ...address, district: e.target.value })}
                                className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                                required
                            />
                        </div>
                    </div>

                    {/* Username Selection */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">उत्पादक</label>
                        <select
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full text-black p-2 border border-gray-300 rounded"
                            required
                        >
                            <option value="">उत्पादकाचे नाव</option>
                            {doctors.map((doctor) => (
                                <option key={doctor._id} value={doctor.name}>
                                    {doctor.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Disease Selection */}
                    <div>
                        <label htmlFor="decises" className="block text-sm font-medium text-gray-700">आजाराचा प्रकार</label>
                        <select
                            id="decises"
                            name="decises"
                            value={decises}
                            onChange={(e) => setDecises(e.target.value)}
                            className="w-full text-black p-2 border border-gray-300 rounded"
                            required
                        >
                            <option value="">आजाराचा प्रकार</option>
                            {decisesList.map((disease) => (
                                <option key={disease._id} value={disease.Decieses}>
                                    {disease.Decieses}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Animal Type Selection */}
                    <div>
                        <label htmlFor="animalType" className="block text-sm font-medium text-gray-700">जनावर प्रकार</label>
                        <select
                            id="animalType"
                            name="animalType"
                            value={animalType}
                            onChange={(e) => setAnimalType(e.target.value)}
                            className="w-full text-black p-2 border border-gray-300 rounded"
                            required
                        >
                            <option value="">जनावर प्रकार</option>
                            {animalTypes.map((type, index) => (
                                <option key={index} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full text-white p-3 bg-blue-500 rounded hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </form>
            </div>

            <ToastContainer />
        </div>
        </div>
    );
};

export default GetDocterVisit;
