import { ToastContainer, toast as Toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

const SigninForm = () => {
  const router = useRouter();
  const [owner, setOwner] = useState({
    loginId: "", // Combined field for phone or email
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Determine if loginId is phone or email
      const isEmail = owner.loginId.includes('@');
      const loginData = {
        password: owner.password,
        [isEmail ? 'email' : 'phone']: owner.loginId
      };

      const response = await axios.post("/api/owner/login", loginData, {
        withCredentials: true,
      });
  
      if (response.data.success) {
        window.location.href = "/home";
      } else {
        Toast.error("Server is not responding. Please check your internet connection.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.error === "Invalid email or phone") {
          Toast.error("ईमेल किंवा फोन नंबर चुकीचा आहे");
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
  };

  useEffect(() => {
    setButtonDisabled(!(owner.loginId.length > 0 && owner.password.length > 0));
  }, [owner]);

  return (
    <div className=''>
      <form className="flex flex-col space-y-4" onSubmit={onLogin}>
        <h2 className="text-2xl font-bold text-black text-center">Sign In</h2>
        
        <input 
          className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
          type="text" 
          placeholder="Phone Number or Email"
          value={owner.loginId}
          onChange={(e) => setOwner({ ...owner, loginId: e.target.value })}
        />
        
        <input 
          className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
          type="password" 
          placeholder="Password" 
          value={owner.password}
          onChange={(e) => setOwner({ ...owner, password: e.target.value })}
          required
        />
        
        <button 
          className={`w-full py-2 px-4 bg-blue-400 text-white rounded-md text-sm font-semibold hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 ${buttonDisabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
          type="submit" 
          disabled={buttonDisabled || loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
        
        <Link href="/home/reset" className='text-black'>
          पासवर्ड विसरला असेल तर <span className='text-blue-500'> पासवर्ड बदला </span>
        </Link>
      </form>

      <ToastContainer />
    </div>
  );
};

export default SigninForm;