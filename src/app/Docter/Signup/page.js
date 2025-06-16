"use client";
import { ToastContainer, toast as Toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const DrSignUp = () => {
    const router = useRouter();
    const [docter, setDocter] = useState({
        name: "",
        phone: "",
        address: "",
        specialization: "",
        center: "", // Assuming 'center' is a field you want to include
        sangh: "", 
        password: "",
    });
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [sanghList, setSanghList] = useState([]);

    const onSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post("/api/Docter/Signup", docter);

            const clearFields = {
                name: "",
                phone: "",
                address: "",
                specialization: "",
                center: "",
                sangh: "",
                password: "",
            };
            setDocter(clearFields);

            Toast.success("Signup successful! Redirecting...");
            console.log("SignUp Success", res.data);
        } catch (error) {
            console.error("SignUp Error", error);
            Toast.error(error.response?.data?.message || "Sign up failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
        if (value.length <= 10) {
            setDocter({ ...docter, phone: value });
        }
    };

    useEffect(() => {
        const allFieldsFilled = Object.values(docter).every(field => field.length > 0);
        setButtonDisabled(!allFieldsFilled);
    }, [docter]);

    useEffect(() => {
        async function fetchSanghDetails() {
            try {
                const res = await axios.get("/api/sangh/getSangh");
                setSanghList(res.data.data);
            } catch (error) {
                console.log("Failed to fetch sangh details:", error.message);
                Toast.error("Failed to load sangh list");
            }
        }
        fetchSanghDetails();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDocter({ ...docter, [name]: value });
    };

    return (
        <div className="gradient-bg pt-10">
        <div className="max-w-lg h-[80vh] mx-auto p-6 bg-white/80 backdrop-blur-md rounded-lg shadow-md overflow-x-auto overflow-y-auto">
            <style jsx>{`
                .max-w-lg::-webkit-scrollbar {
                    height: 8px;
                }
                .max-w-lg::-webkit-scrollbar-track {
                    background: transparent;
                }
                .max-w-lg::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom right, #4a90e2, #9013fe);
                    border-radius: 10px;
                }
            `}</style>
            
            
            
            <h2 className='text-black text-2xl font-bold text-center mb-6'>Doctor Sign Up</h2>
            
            <form onSubmit={onSignup} className="space-y-4 text-black">
                <div className="grid grid-cols-1 gap-4">
                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={docter.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Phone Field */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={docter.phone}
                            onChange={handlePhoneChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            maxLength={10}
                            pattern="[0-9]{10}"
                            required
                        />
                    </div>

                    {/* Address Field */}
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            Address
                        </label>
                        <textarea
                            id="address"
                            name="address"
                            value={docter.address}
                            onChange={handleChange}
                            className="w-full px-4 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={2}
                            required
                        />
                    </div>

                    {/* Specialization Field */}
                    <div>
                        <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                            Specialization
                        </label>
                        <input
                            type="text"
                            id="specialization"
                            name="specialization"
                            value={docter.specialization}
                            onChange={handleChange}
                            className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Center Field */}
                    <div>
                        <label htmlFor="center" className="block text-sm font-medium text-gray-700 mb-1">
                            Center
                        </label>
                        <input
                            type="text"
                            id="center"
                            name="center"
                            value={docter.center}
                            onChange={handleChange}
                            className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Sangh Selection */}
                    <div>
                        <label htmlFor="sangh" className="block text-sm font-medium text-gray-700 mb-1">
                            Select Sangh
                        </label>
                        <select
                            id="sangh"
                            name="sangh"
                            value={docter.sangh}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">-- Select Sangh --</option>
                            {sanghList.map((sangh, index) => (
                                <option key={index} value={sangh.SanghName}>
                                    {sangh.SanghName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={docter.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            minLength={6}
                            required
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={buttonDisabled || loading}
                        className={`w-full py-2 px-4 rounded-md text-white font-medium ${buttonDisabled || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            'Sign Up'
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <button 
                        onClick={() => router.push("/home/Signin")}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Sign In
                    </button>
                </p>
            </div>
        </div>
        <ToastContainer position="top-center" autoClose={3000} />
        </div>
    );
}

export default DrSignUp;