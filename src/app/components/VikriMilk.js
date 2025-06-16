"use client";
import { ToastContainer, toast as Toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const VikriMilk = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [vikriUsers, setVikriUsers] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedMilk, setSelectedMilk] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const inputRefs = useRef([]);
  const [vikriRates, setVikriRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buffRate, setBuffRate] = useState(0);
  const [cowRate, setCowRate] = useState(0);

  useEffect(() => {
    fetchVikriRates();
    fetchVikriUsers();
  }, []);

  const fetchVikriRates = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/user/getVikriRate");
      setVikriRates(response.data.data);
      setBuffRate(response.data.data[0].VikriRateBuff);
      console.log("Buffelow rate", response.data.data[0].VikriRateBuff);
      
      setCowRate(response.data.data[0].VikriRateCow);
      console.log("Cow Rate", response.data.data[0].VikriRateCow);
      
    } catch (error) {
      console.error("Error fetching VikriRates:", error);
      setError(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchVikriUsers = async () => {
    try {
      const response = await axios.get("/api/user/GetVikriUser");
      setVikriUsers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch vikri users:", error);
      Toast.error("Failed to fetch vikri users");
    }
  };
  const handleMilkChange = (event) => {
    setSelectedMilk(event.target.value);
  };
  

  const handleRegisterNoBlur = (event) => {
    const registerNo = event.target.value;

    // Find the user with the matching register number
    const user = vikriUsers.find(
      (user) => user.registerNo === parseInt(registerNo, 10)
    );

    if (user) {
      setSelectedUser(user);
      setSelectedOption(registerNo); // Set the selected register number
      setSelectedMilk(user.milk); // Set the milk type based on the user
    } else {
      setSelectedUser(null);
      setSelectedOption("");
      setSelectedMilk("");
      Toast.error("Invalid Register Number. Please try again.");
    }
  };

  const handleUserChange = (event) => {
    const selectedRegisterNo = event.target.value;
    setSelectedOption(selectedRegisterNo);

    // Find the user with the matching register number
    const user = vikriUsers.find(
      (user) => user.registerNo === parseInt(selectedRegisterNo, 10)
    );

    if (user) {
      setSelectedUser(user);
      setSelectedMilk(user.milk); // Set the milk type based on the user
    } else {
      setSelectedUser(null);
      setSelectedMilk("");
    }
  };

    useEffect(() => {
      const date = new Date();
      const formattedDate = date.toISOString().split("T")[0]; // yyyy-mm-dd format
      const formattedTime = date.getHours() < 12 ? "morning" : "evening";
  
      setCurrentDate(formattedDate);
      setCurrentTime(formattedTime);
    }, []);

    const calculateRates = () => {
      const liter = parseFloat(inputRefs.current[1]?.value || "0");
    
      if (isNaN(liter)) {
        Toast.error("Please enter a valid number for Liter.");
        return;
      }
    
      let rate = 0;
    
      // Fix rate calculation based on selected milk type
      if (selectedMilk === "गाय") {
        rate = cowRate; // Fixed rate for cow milk
      } else if (selectedMilk === "म्हैस") {
        rate = buffRate; // Fixed rate for buffalo milk
      }
    
      // Set only the rate directly
      inputRefs.current[2].value = rate.toFixed(2);
    
      // Calculate total (rakkam) based on fixed rate
      inputRefs.current[3].value = (rate * liter).toFixed(2);
    };  
  

    const handleSubmit = async () => {
      if (!selectedUser || !selectedMilk) {
        Toast.error("Please select a valid user and milk type.");
        return;
      }
    
      const liter = parseFloat(inputRefs.current[1]?.value || "0");
      const dar = parseFloat(inputRefs.current[2]?.value || "0");
      const rakkam = parseFloat(inputRefs.current[3]?.value || "0");
    
      if (isNaN(liter) || isNaN(dar) || isNaN(rakkam)) {
        Toast.error("Please enter valid numbers for Liter, Dar, and Rakkam.");
        return;
      }
    
      const payload = {
        registerNo: selectedOption, // Register number of selected user
        session: currentTime, // Session value (morning/evening)
        milk: selectedMilk, // Milk type (गाय/म्हैस)
        liter,
        dar,
        rakkam,
        date: currentDate, // Format date as 'YYYY-MM-DD'
      };
    
      console.log("Payload:", payload);
      

      try {
        const res = await axios.post("/api/user/addVikriMilk", payload);
    
        if (res.status === 200) {
          Toast.success("Vikri Milk record added successfully");
          // Optionally clear input fields after success
          inputRefs.current.forEach(ref => (ref.value = ""));
        }
      } catch (error) {
        console.error("Error adding Vikri Milk record:", error);
        if (error.response) {
          // Backend returned an error response
          Toast.error(error.response.data.error || "Failed to add record");
        } else {
          Toast.error("Network error. Please try again later.");
        }
      }
    };
    

  const clearForm = () => {
    setSelectedOption("");
    setSelectedMilk("");
    setSelectedUser(null);
    inputRefs.current.forEach((ref) => {
      if (ref) ref.value = "";
    });
  };

  const handleKeyPress = (event, index) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission on Enter key press
  
      if (index === 0) {
        // After entering register number, focus on liter input
        inputRefs.current[1]?.focus();
      } else if (index === 1) {
        // After entering liter, calculate rates and focus on save button
        calculateRates();
        inputRefs.current[1]?.focus(); // Focus on save button
      } else if (index === 4) {
        // If save button is focused, trigger the submit function
        handleSubmit();
      }
    }
  };
  

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (

<>
{/* MOBILE VIEW (Below 640px) */}
<div className="block sm:hidden bg-gray-300 p-3 rounded-xl shadow-xl w-full max-w-xl mx-auto space-y-3 text-sm">

  {/* Row 1: Date & Session */}
  <div className="flex gap-2">
    <input
      type="date"
      value={currentDate}
      onChange={(e) => setCurrentDate(e.target.value)}
      max={new Date().toISOString().split("T")[0]}
      className="w-1/2 p-2 rounded bg-gray-200 text-black"
    />
    <select
      value={currentTime}
      onChange={(e) => setCurrentTime(e.target.value)}
      className="w-1/2 p-2 rounded bg-gray-200 text-black"
    >
      <option value="morning">सकाळ</option>
      <option value="evening">संध्याकाळ</option>
    </select>
  </div>

  {/* Row 2: Register No, User, MilkType */}
  <div className="flex items-center gap-2 mt-3 flex-nowrap overflow-x-auto rounded-md pl-2">
    <input
      type="text"
      placeholder="रजि. नं."
      value={selectedOption}
      onChange={(e) => setSelectedOption(e.target.value)}
      onBlur={handleRegisterNoBlur}
      onKeyDown={(e) => handleKeyPress(e, 1)}
      className="border rounded-md p-1 text-gray-700 text-sm w-1/5"
    />
    <select
      value={selectedOption}
      onChange={handleUserChange}
      className="border rounded-md p-1 text-gray-700 text-sm w-1/2"
    >
      <option value="">उत्पादकाचे नाव</option>
      {vikriUsers.map((user) => (
        <option key={user.registerNo} value={user.registerNo}>
          {user.name}
        </option>
      ))}
    </select>
    <select
      value={selectedMilk}
      onChange={handleMilkChange}
      className="p-2 rounded bg-gray-200 text-black"
    >
      <option value="">दूध प्रकार</option>
      {[...new Set(vikriUsers.map((user) => user.milk))].map((milkType) => (
        <option key={milkType} value={milkType}>
          {milkType}
        </option>
      ))}
    </select>
  </div>

  {/* Row 3: Liter, Dar, Rakkam */}
  <div className="flex items-center gap-2 mt-3 flex-nowrap overflow-x-auto">
    <input
      type="text"
      placeholder="लिटर"
      ref={(el) => (inputRefs.current[1] = el)}
      onKeyDown={(e) => handleKeyPress(e, 1)}
      className="border rounded-md p-1 text-gray-700 text-sm w-1/4"
    />
    <input
      type="text"
      placeholder="दर"
      ref={(el) => (inputRefs.current[2] = el)}
      readOnly
      className="border rounded-md p-1 text-gray-700 text-sm w-1/4"
    />
    <input
      type="text"
      placeholder="रक्कम"
      ref={(el) => (inputRefs.current[3] = el)}
      readOnly
      className="border rounded-md p-1 text-gray-700 text-sm w-1/4"
    />
  </div>

  {/* Row 4: Buttons */}
  <div className="flex flex-col gap-2">
    <button
      onClick={calculateRates}
      className="bg-blue-500 text-white py-2 rounded"
    >
      दर व रक्कम काढा
    </button>
    <button
      onClick={handleSubmit}
      ref={(el) => (inputRefs.current[4] = el)}
      className="bg-green-500 text-white py-2 rounded"
    >
      सेव करा
    </button>
  </div>
</div>
{/* DESKTOP VIEW (640px and above) */}
<div className="hidden sm:block bg-gray-300 p-6 rounded-xl shadow-xl w-full max-w-4xl mx-auto">

  {/* Row 1: Date & Session */}
  <div className="flex gap-4 mb-4">
    <input
      type="date"
      value={currentDate}
      onChange={(e) => setCurrentDate(e.target.value)}
      max={new Date().toISOString().split("T")[0]}
      className="w-1/4 p-3 rounded bg-gray-200 text-black"
    />
    <select
      value={currentTime}
      onChange={(e) => setCurrentTime(e.target.value)}
      className="w-1/4 p-3 rounded bg-gray-200 text-black"
    >
      <option value="morning">सकाळ</option>
      <option value="evening">संध्याकाळ</option>
    </select>
  </div>

  {/* Row 2: Register No, User, MilkType */}
  <div className="flex gap-4 mb-4">
    <input
      type="text"
      placeholder="रजि. नं."
      value={selectedOption}
      onChange={(e) => setSelectedOption(e.target.value)}
      onBlur={handleRegisterNoBlur}
      onKeyDown={(e) => handleKeyPress(e, 1)}
      className="w-[100px] p-3 rounded bg-gray-200 text-black"
    />
    <select
      value={selectedOption}
      onChange={handleUserChange}
      className="w-1/2 p-3 rounded bg-gray-200 text-black"
    >
      <option value="">उत्पादकाचे नाव</option>
      {vikriUsers.map((user) => (
        <option key={user.registerNo} value={user.registerNo}>
          {user.name}
        </option>
      ))}
    </select>
    <select
      value={selectedMilk}
      onChange={handleMilkChange}
      className="w-1/4 p-3 rounded bg-gray-200 text-black"
    >
      <option value="">दूध प्रकार</option>
      {[...new Set(vikriUsers.map((user) => user.milk))].map((milkType) => (
        <option key={milkType} value={milkType}>
          {milkType}
        </option>
      ))}
    </select>
  </div>

  {/* Row 3: Liter, Dar, Rakkam */}
  <div className="flex gap-4 mb-4">
    <input
      type="text"
      placeholder="लिटर"
      ref={(el) => (inputRefs.current[1] = el)}
      onKeyDown={(e) => handleKeyPress(e, 1)}
      className="w-[90px] p-3 rounded bg-gray-200 text-black"
    />
    <input
      type="text"
      placeholder="दर"
      ref={(el) => (inputRefs.current[2] = el)}
      readOnly
      className="w-[90px] p-3 rounded bg-gray-200 text-black"
    />
    <input
      type="text"
      placeholder="रक्कम"
      ref={(el) => (inputRefs.current[3] = el)}
      readOnly
      className="w-[90px] p-3 rounded bg-gray-200 text-black"
    />
        <button
      onClick={calculateRates}
      className="bg-blue-500 text-white py-2 px-4 rounded w-1/2"
    >
      दर व रक्कम काढा
    </button>
    <button
      onClick={handleSubmit}
      ref={(el) => (inputRefs.current[4] = el)}
      className="bg-green-500 text-white py-2 px-4 rounded w-1/2"
    >
      सेव करा
    </button>
  </div>
</div>

</>
  );
};

export default VikriMilk;