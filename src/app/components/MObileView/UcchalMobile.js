'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const UcchalMobile = () => {
    const { id } = useParams();
    const [ucchal, setUcchal] = useState([]);
    const [currentDate, setCurrentDate] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [rakkam, setRakkam] = useState('');
    const [users, setUsers] = useState([]);
    const inputRefs = useRef([]);
    const registerNoRef = useRef(null);

    useEffect(() => {
        async function getOwnerUsers() {
            try {
                const res = await axios.get('/api/user/getUserList');
                setUsers(res.data.data);
                console.log("user List", res.data.data);

            } catch (error) {
                console.log("Failed to fetch users:", error.message);
                toast.error("सर्वर डाउन आहे ");
            }
        }
        getOwnerUsers();
    }, []);

    // ✅ Set Current Date
    useEffect(() => {
        const date = new Date().toISOString().split('T')[0];
        setCurrentDate(date);
    }, []);

    // ✅ Handle User Selection by Register No
    const handleUserChange = (event) => {
        const selectedRegisterNo = event.target.value;
        setSelectedOption(selectedRegisterNo);

        const user = users.find(user => user.registerNo === parseInt(selectedRegisterNo, 10));
        setSelectedUser(user);
    };

    // ✅ Handle Blur on Register No Input
    const handleRegisterNoBlur = (event) => {
        const registerNo = event.target.value;
        const user = users.find(user => user.registerNo === parseInt(registerNo, 10));
        if (user) {
            setSelectedUser(user);
            setSelectedOption(registerNo);
        } else {
            toast.error("Invalid Register Number");
            setSelectedOption('');
            setSelectedUser(null);
        }
    };

    // ✅ Handle Focus on Register No Input
    const handleRegisterNoFocus = () => {
        setSelectedOption('');
        setSelectedUser(null);
        setRakkam('');
        inputRefs.current.forEach(ref => {
            if (ref) ref.value = '';
        });
    };

    // ✅ Handle Rakkam Change
    const handleRakkamChange = (event) => {
        setRakkam(event.target.value);
    };

    // ✅ Handle Form Submit
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedUser) {
            toast.error('Please select a valid user');
            return;
        }

        const payload = {
            registerNo: selectedOption,
            username: selectedUser?.name,
            date: currentDate,
            rakkam: parseFloat(rakkam), // Ensure proper number type
        };

        try {
            const res = await axios.post('/api/user/ucchal/add', payload);
            toast.success(res.data.message);
            setSelectedOption('');
            setSelectedUser(null);
            setRakkam('');
            inputRefs.current.forEach(ref => {
                if (ref) ref.value = '';
            });
        } catch (error) {
            console.error('Error storing ucchal information:', error.message);
            toast.error(error.response?.data?.error || 'Failed to store ucchal information');
        }
    };

    return (
        <div className="bg-blue-300 sm:bg-gray-500 w-4/5 sm:w-7/12 mx-auto h-auto py-1 px-1 rounded-lg mt-4">
            <h1 className="text-xl md:text-2xl font-semibold text-black mb-4 flex flex-wrap items-center justify-center md:justify-start">उच्चल भरा</h1>
            <form onSubmit={handleSubmit}
                className='bg-gray-400 p-2 rounded-lg'
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center">
                        <input
                            type="date"
                            id="startDate"
                            value={currentDate}
                            onChange={(e) => setCurrentDate(e.target.value)}
                            max={new Date().toISOString().split("T")[0]}
                            className="border rounded-md p-1 text-gray-700 text-sm w-1/2 sm:w-auto"
                        />
                    </div>
                    <div className="flex items-center gap-2 mt-3 flex-nowrap overflow-x-auto">
                        <input
                            type="number"
                            inputMode="numeric"
                            id="code"
                            ref={registerNoRef}  // Add this line
                            placeholder="रजि. नं."
                            className="border rounded-md p-1 text-gray-700 text-sm w-1/6"
                            value={selectedOption}
                            onChange={(e) => setSelectedOption(e.target.value)}
                            onBlur={handleRegisterNoBlur}
                            onFocus={handleRegisterNoFocus}
                            onInput={(e) => {
                                // Allow only numbers and a single decimal point
                                const value = e.target.value;
                                e.target.value = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
                            }}
                            required
                        />
                        <select
                            id="user-select"
                            className="border rounded-md p-1 text-gray-700 text-sm"
                            value={selectedOption}
                            onChange={handleUserChange}
                        >
                            <option value="">उत्पादकाचे नाव</option>
                            {users.map((user) => (
                                <option key={user.registerNo} value={user.registerNo}>
                                    {user.name}
                                </option>
                            ))}
                        </select>

                    </div>
                    <div className="flex items-center gap-2 mt-3 flex-nowrap overflow-x-auto">
                        <input
                            type="number"
                            inputMode="numeric"
                            id="amount"
                            placeholder="रक्कम"
                            className="border rounded-md p-1 text-gray-700 text-sm w-1/2"
                            value={rakkam}
                            onChange={(e) => setRakkam(e.target.value)}
                            onInput={(e) => {
                                // Allow only numbers and a single decimal point
                                const value = e.target.value;
                                e.target.value = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
                            }}
                            required
                        />
                        <button
                            type="submit"
                            className="bg-red-400 border rounded-md p-1 text-gray-700 text-sm w-1/3"
                        >
                            Submit
                        </button>
                    </div>

                </div>
            </form>
        </div>
    );
}

export default UcchalMobile;