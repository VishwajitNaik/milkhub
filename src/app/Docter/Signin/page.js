"use client";
import { ToastContainer, toast as Toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

const DrignIn = () => {
    const router = useRouter();
    const [docter, setDocter] = useState({
        phone: "",
        password: "",
    });

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const onLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post("/api/Docter/Signin", docter, {
                withCredentials: true,
            });

            if (response.data.success) {
                window.location.href = "/Docter";
            } else {
                Toast.error("Server is not responding. Please check your internet connection.");
            }
        } catch (error) {
            if (error.response && error.response.data) {
                if (error.response.data.error === "Invalid phone") {
                    Toast.error("फोन नंबर चुकीचा आहे");
                } else if (error.response.data.error === "Invalid password") {
                    Toast.error("पासवर्ड चुकीचा आहे");
                } else {
                    Toast.error("Server error. Please try again later.");
                }
            } else {
                Toast.error("Server is not responding. Please check your internet connection.");
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setButtonDisabled(!(docter.phone.length > 0 && docter.password.length > 0));
    }, [docter]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100 py-12 px-4 sm:px-6 lg:px-8">
            <ToastContainer 
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            
            <div className="w-full max-w-md">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="flex justify-center mb-6">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-10 w-10 text-blue-600" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                                />
                            </svg>
                        </div>
                    </div>
                    
                    <h2 className="text-center text-3xl font-bold text-gray-800 mb-2">
                        {loading ? "Processing..." : "Doctor Login"}
                    </h2>
                    <p className="text-center text-gray-600 mb-8">Enter your credentials to access your account</p>

                    <form className="space-y-5" onSubmit={onLogin}>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="text"
                                required
                                className="w-full px-4 py-3 text-black rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200"
                                placeholder="Enter phone number"
                                value={docter.phone}
                                onChange={(e) => setDocter({ ...docter, phone: e.target.value })}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-3 text-black rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200"
                                placeholder="Enter password"
                                value={docter.password}
                                onChange={(e) => setDocter({ ...docter, password: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={buttonDisabled || loading}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white ${buttonDisabled || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200`}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : "Sign in"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DrignIn;