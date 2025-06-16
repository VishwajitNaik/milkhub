"use client";
import { ToastContainer, toast as Toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useState } from 'react';

const PopUp = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [vikriUsers, setVikriUsers] = useState({
    registerNo: '',
    name: '',
    milk: '',
    phone: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVikriUsers((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddVikriUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/user/sthanikVikri', vikriUsers);
      console.log(res.data.data);
      
      setVikriUsers({
        registerNo: '',
        name: '',
        milk: '',
        phone: '',
        email: '',
        password: '',
      });
  
      Toast.success("Vikri User added successfully!");
    } catch (error) {
      console.error(error);
      Toast.error("Error adding Vikri User!");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-0">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      
      {/* Popup Container */}
      <div className="relative bg-white p-4 sm:p-6 w-full sm:w-[90%] md:w-[80%] lg:w-[60%] xl:w-[40%] max-h-[90vh] overflow-y-auto rounded-lg shadow-lg">
        {/* Close Button */}
        <button 
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-xl sm:text-2xl text-black font-bold mb-4">विक्रेता भरणे</h2>

        <form className="text-black grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleAddVikriUser}>
          {/* Register No */}
          <div className="w-full">
            <label className="block text-sm sm:text-base text-black mb-1">विक्रेता नं.</label>
            <input 
              className="w-full p-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md bg-gray-50"
              type="number" 
              name="registerNo"
              value={vikriUsers.registerNo}
              onChange={handleChange}
              placeholder="Enter Register No"
              required
            />
          </div>

          {/* Name */}
          <div className="w-full">
            <label className="block text-sm sm:text-base text-black mb-1">विक्रेताचे नाव</label>
            <input 
              type="text" 
              name="name"
              value={vikriUsers.name}
              onChange={handleChange}
              placeholder="Enter Name" 
              className="w-full p-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md bg-gray-50"
              required
            />
          </div>

          {/* Milk Type */}
          <div className="w-full">
            <label className="block text-sm sm:text-base text-black mb-1">दूध प्रकार</label>
            <select 
              className="w-full p-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md bg-gray-50"
              name="milk"
              value={vikriUsers.milk}
              onChange={handleChange}
              required
            >
              <option value="">Select Milk Type</option>
              <option value="गाय">गाय</option>
              <option value="म्हैस">म्हैस</option>
            </select>
          </div>

          {/* Phone */}
          <div className="w-full">
            <label className="block text-sm sm:text-base text-black mb-1">फोन नंबर</label>
            <input 
              type="number"
              name="phone"
              value={vikriUsers.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full p-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md bg-gray-50"
              required
            />
          </div>

          {/* Email */}
          <div className="w-full sm:col-span-2">
            <label className="block text-sm sm:text-base text-black mb-1">ईमेल</label>
            <input 
              type="email" 
              name="email"
              value={vikriUsers.email}
              onChange={handleChange}
              placeholder="abc@gmail.com"
              className="w-full p-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md bg-gray-50"
              required
            />
          </div>

          {/* Password */}
          <div className="w-full sm:col-span-2">
            <label className="block text-sm sm:text-base text-black mb-1">पासवर्ड</label>
            <input 
              type="password" 
              name="password"
              value={vikriUsers.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md bg-gray-50"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="w-full sm:col-span-2 mt-2">
            <button 
              type="submit" 
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition duration-200 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : 'Submit'}
            </button>
          </div>
        </form>

        <ToastContainer 
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
};

export default PopUp;