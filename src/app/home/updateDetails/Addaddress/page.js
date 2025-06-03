// app/dashboard/address/page.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddressForm = () => {
    const [addresses, setAddresses] = useState([]);
    const [formData, setFormData] = useState({
        village: '',
        tahasil: '',
        district: '',
        PinCode: ''
    });

    // Fetch existing addresses
    const fetchAddresses = async () => {
        try {
            const response = await fetch('/api/address/add');
            const data = await response.json();
            if (data.success) {
                setAddresses(data.addresses);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.village || !formData.tahasil || !formData.district || !formData.PinCode) {
            toast.error('All fields are required');
            return;
        }

        try {
            const response = await fetch('/api/owner/AddAddress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Address added successfully');
                setFormData({ village: '', tahasil: '', district: '', PinCode: '' });
                fetchAddresses(); // Refresh list
            } else {
                toast.error(data.error || 'Failed to add address');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to add address');
        }
    };

    return (
        <div className="gradient-bg p-12"> 
          <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-black">Add New Address</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm text-black font-medium mb-1">Village</label>
                    <input
                        type="text"
                        value={formData.village}
                        onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                        className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm text-black font-medium mb-1">Tahasil</label>
                    <input
                        type="text"
                        value={formData.tahasil}
                        onChange={(e) => setFormData({ ...formData, tahasil: e.target.value })}
                        className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm text-black font-medium mb-1">District</label>
                    <input
                        type="text"
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm text-black font-medium mb-1">PIN Code</label>
                    <input
                        type="number"
                        value={formData.PinCode}
                        onChange={(e) => setFormData({ ...formData, PinCode: e.target.value })}
                        className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                        pattern="\d{6}"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                >
                    Add Address
                </button>
            </form>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Saved Addresses</h3>
                {addresses.map((address) => (
                    <div key={address._id} className="p-4 mb-4 border rounded-md">
                        <p><strong>Village:</strong> {address.village}</p>
                        <p><strong>Tahasil:</strong> {address.tahasil}</p>
                        <p><strong>District:</strong> {address.district}</p>
                        <p><strong>PIN Code:</strong> {address.PinCode}</p>
                    </div>
                ))}
            </div>

            <ToastContainer position="bottom-right" />
        </div>
        </div>
    );
};

export default AddressForm;