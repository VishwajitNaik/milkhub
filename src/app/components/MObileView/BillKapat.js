'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

const BillKapat = () => {
    const [totalAmount, setTotalAmount] = useState(0);
    const { id } = useParams();
    const [orders, setOrders] = useState([]);
    const [currentDate, setCurrentDate] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedOptionOrder, setSelectedOptionOrder] = useState('');
    const [rakkam, setRakkam] = useState('');
    const [users, setUsers] = useState([]);
    const inputRefs = useRef([]);
    const [userDetails, setUserDetails] = useState(null);
    const [totalLiters, setTotalLiters] = useState(0);
    const [totalRakkam, setTotalRakkam] = useState(0);
    const [netPayment, setNetPayment] = useState(0);
    const [literKapat, setLiterKapat] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [milkRecords, setMilkRecords] = useState([]);
    const [kapat, setKapat] = useState([]);
   const registerNoRef = useRef(null); // Create a ref for registerNo input field
    const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

    // Fetch उच्चल data
    useEffect(() => {
      async function fetchUcchalData() {
        try {
          const response = await axios.post(`/api/user/ucchal/getUchhal/${id}`);
          setData(response.data.data);
          console.log('Response:', response.data.data);
          setTotal(response.data.total); // Set total for उच्चल
          console.log('Response:', response.data.total);
        } catch (err) {
          console.error("Failed to fetch data:", err.message);
          toast.error("Failed to fetch data.");
        }
      }
  
      if (id) fetchUcchalData();
    }, [id]);


     // Fetch Kapat options
  useEffect(() => {
    async function getKapatOptions() {
      try {
        const res = await axios.get('/api/kapat/getKapat');
        const sthirKapat = res.data.data.filter(item => item.KapatType === 'Kapat');
        setKapat(sthirKapat);
      } catch (error) {
        console.log("Failed to fetch kapat options:", error.message);
      }
    }
    getKapatOptions();
  }, [totalLiters, totalRakkam]);

  // Fetch users
  useEffect(() => {
    async function getOwnerUsers() {
      try {
        const res = await axios.get('/api/user/getUserList');
        setUsers(res.data.data);
      } catch (error) {
        console.log("Failed to fetch users:", error.message);
      }
    }
    getOwnerUsers();
  }, []);

  // Set current date
  useEffect(() => {
    const date = new Date().toISOString().split('T')[0];
    setCurrentDate(date);
  }, []);

  // Handle user selection change
  const handleUserChange = (event) => {
    const selectedRegisterNo = event.target.value;
    setSelectedOption(selectedRegisterNo);
    const user = users.find(user => user.registerNo === parseInt(selectedRegisterNo, 10));
    setSelectedUser(user);
    if (user) {
      fetchUserDetails(user._id); // Fetch user details on selection
    }
  };

  const handleRegisterNoBlur = (event) => {
    const registerNo = event.target.value;
    const user = users.find(user => user.registerNo === parseInt(registerNo, 10));
    setSelectedUser(user);
    setSelectedOption(registerNo);
    if (user) {
      fetchUserDetails(user._id); // Fetch user details on selection
    }
  };

  const handleRegisterNoFocus = () => {
    setSelectedOption('');
    setSelectedUser(null);
    inputRefs.current.forEach(ref => {
      if (ref) ref.value = '';
    });
  };

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOptionOrder(selectedValue);

    // If "उच्चल" is selected, fetch the user-specific total
    if (selectedValue === "उच्चल" && selectedUser) {
      fetchUcchalDataForUser(selectedUser._id);
    } else {
      setTotal(totalRakkam); // Use the total from getKapatOptions
    }
  };

  const fetchUcchalDataForUser = async (userId) => {
    try {
      const response = await axios.post(`/api/user/ucchal/getUchhal/${userId}`);
      setTotal(response.data.total); // Set total for the selected user
    } catch (err) {
      console.error("Failed to fetch उच्चल data for user:", err.message);
      toast.error("Failed to fetch उच्चल data for user.");
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      date: currentDate,
      username: selectedUser?.name,
      registerNo: selectedOption,
      milktype: selectedUser?.milk,
      orderData: selectedOptionOrder,
      rate: parseFloat(rakkam),
    };

    try {
      const res = await axios.post('/api/billkapat/addBillkapat', payload);
      console.log('Response:', res.data);
      setSelectedOption('');
      setSelectedUser(null);
      setRakkam('');
      setMilkRecords([]); // Clear milk records if needed
      setUserDetails(null); // Reset user details

      inputRefs.current.forEach(ref => {
        if (ref) ref.value = '';
      });

      // Set focus back to Register No input field
      if (registerNoRef.current) {
        registerNoRef.current.focus();
      }

    } catch (error) {
      console.error('Failed to add bill kapat:', error.message);
    }
  };

  // Fetch milk records based on selected user
  const fetchMilkRecords = async () => {
    if (!selectedUser?._id || !startDate || !endDate) {
      alert('Please select a user and date range');
      return;
    }

    try {
      const response = await axios.get(`/api/milk/getMilkRecords`, {
        params: {
          userId: selectedUser._id,
          startDate,
          endDate,
        },
      });
      setMilkRecords(response.data.data);
    } catch (error) {
      console.error("Error fetching milk records:", error.message);
    }
  };

  const totalMilkRakkam = milkRecords.reduce((total, record) => total + (record.rakkam || 0), 0).toFixed(2);

  // Fetch orders for the selected user
  useEffect(() => {
    if (selectedOption) {
      const fetchUserOrders = async () => {
        try {
          const response = await axios.get(`/api/orders/getOrders/${selectedOption}`);
          if (response.data.error) {
            throw new Error(response.data.error);
          }
          const fetchedOrders = response.data.data;
          setOrders(fetchedOrders);

          // Calculate the total amount from the fetched orders
          const total = fetchedOrders.reduce((sum, order) => sum + (order.rakkam || 0), 0);
          setTotalAmount(total); // Update the totalAmount state
        } catch (error) {
          console.error(error.message);
        }
      };

      fetchUserOrders();
    } else {
      setOrders([]); // Clear orders if no user is selected
      setTotalAmount(0); // Reset total amount if no user is selected
    }
  }, [selectedOption]); // Re-run when selectedUserId changes

  // Fetch user details based on selected user
  const fetchUserDetails = async (userId) => {
    if (!userId) {
      alert("Please select a user");
      return;
    }

    try {
      const response = await axios.post(`/api/orders/afterKapatOrders/${userId}`);
      setUserDetails(response.data);
      setNetPayment(response.data.netPayment);
    } catch (error) {
      console.error("Failed to fetch user details:", error.message);
      toast.error("Failed to fetch user details.");
    }
  };

  return (
          <div className="bg-blue-300 sm:bg-gray-500 w-4/4 sm:w-7/12 mx-auto h-auto py-1 px-1 rounded-lg mt-4">
              <h1 className="text-xl md:text-2xl font-semibold text-black mb-4 flex flex-wrap items-center justify-center md:justify-start">
               बिल कपात
              </h1>
              <form onSubmit={handleSubmit}
              className='bg-gray-400 p-2 rounded-lg'
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  {/* Date and Time Selection */}
                  <div className="flex items-center">
                    <input
                      type="date"
                      id="startDate" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="border rounded-md p-1 text-gray-700 text-sm w-1/2 sm:w-auto"
                    />
                    <input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="border rounded-md ml-2 p-1 text-gray-700 text-sm w-1/2 sm:w-auto"
                    />

                  </div>
                  <div className="flex items-center gap-2 mt-3 flex-nowrap overflow-x-auto">
                    <input
            type="number"
            inputMode="numeric"
            id="code"
            ref={registerNoRef} // Add this line
            placeholder="रजि. नं."
                      className="border rounded-md p-1 text-gray-700 text-sm w-1/6"
                      value={selectedOption}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      onBlur={handleRegisterNoBlur}
                      onFocus={handleRegisterNoFocus}
                      onInput={(e) => {
                        // Allow only numbers and a single decimal point
                        const value = e.target.value;
                        e.target.value = value
                          .replace(/[^0-9.]/g, "")
                          .replace(/(\..*?)\..*/g, "$1");
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
                    <div className="flex justify-center items-center">
                    <button
                      type="button"
                      onClick={fetchMilkRecords}
                      className="bg-red-400 border rounded-md p-1 text-gray-700 text-sm w-1/1"
                    >
                      एकूण बिल
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 flex-nowrap overflow-x-auto">
                <div className="flex items-center space-x-2">
                  <span className="font-bold">बील</span>
                  <span className="px-2 py-1 bg-gray-800 border border-gray-400 rounded-md text-lg">
                    {totalMilkRakkam}
                  </span>
                </div>
                {userDetails && (
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">बाकी</span>
                    <span className="px-2 py-1 bg-gray-800 border border-gray-400 rounded-md text-lg">
                    {selectedOptionOrder === "उच्चल" ? total.toFixed(2) : netPayment.toFixed(2)}
                    </span>
                  </div>
                )}
                </div>
                <div className="flex items-center gap-2 mt-3 flex-nowrap overflow-x-auto">
                <select
                  id="order-select"
                  value={selectedOptionOrder}
                  onChange={handleChange}
                  className="border rounded-md p-1 text-gray-700 text-sm w-1/2"
                >
                  <option value="">पर्याय निवडा...</option>
                  <option value="उच्चल">उच्चल</option>
                  {kapat.map((k) => (
                    <option key={k._id} value={k.kapatName}>
                      {k.kapatName}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Enter Rate"
                  value={rakkam}
                  onChange={(e) => setRakkam(e.target.value)}
                  className='border rounded-md p-1 text-gray-700 text-sm w-1/3'
                />
                </div>
                <div className="flex justify-center items-center">
                    <button
                      type="submit"
                      className="bg-red-400 border rounded-md p-1 text-gray-700 text-sm w-1/1"
                    >
                      सबमिट
                    </button>
                  </div>
                </div>
              </form>
          </div>
  )
}

export default BillKapat
