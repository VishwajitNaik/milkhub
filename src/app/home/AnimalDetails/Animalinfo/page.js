"use client";
import { ToastContainer, toast as Toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Make sure to include the CSS
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import useUserStore from "@/app/store/useUserList.js"; // Import the user store
import Link from 'next/link';

const AnimalForm = () => {
  const [loading, setLoading] = useState(false);
  // const [users, setUsers] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [ownerData, setOwnerData] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [ownerName, setOwnerName] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const inputRefs = useRef([]);
  const [tagTypes, setTagTypes] = useState([]);
  const registerNoRef = useRef(null);
  const [lastChanged, setLastChanged] = useState(null); // 'DOB' or 'age'
  const [address, setAddress] = useState({
    village: '',
    tahasil: '',
    district: '',
    PinCode: ''
  });
  const [selectedOptionOrder, setSelectedOptionOrder] = useState('');
  const [formData, setFormData] = useState({
    date: '',
    registerNo: '',
    username: '',
    species: '',
    animalGender: '',
    tagStatus: 'untagged',
    tagType: '',
    tagId: '',
    breed: '',
    DOB: '',
    age: '',
    purpose: '',
    quantityOfMilk: '',
    runningMonth: '',
    healthStatus: 'healthy',
    typeOfDisease: '',
    require: false,
  });
  const { users, error, fetchUsers } = useUserStore();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileResponse, addressResponse] = await Promise.all([
          axios.get("/api/owner/OwnerDetails"),
          axios.get("/api/owner/GetAddress"),
        ]);

        setOwnerData(profileResponse.data.data);

        // Set address if available
        if (addressResponse.data.data && addressResponse.data.data.length > 0) {
          setAddress({
            village: addressResponse.data.data[0].village,
            tahasil: addressResponse.data.data[0].tahasil,
            district: addressResponse.data.data[0].district,
            PinCode: addressResponse.data.data[0].PinCode || ''
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  // Render the list of Tag Types
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("/api/owner/GetTagType"); // Adjust the API endpoint as needed
        if (res.status === 200) {
          setTagTypes(res.data.data);
          console.log("Tag Types fetched successfully:", res.data.data);

        } else {
          setError("Failed to fetch Tag Types");
        }
      } catch (error) {
        console.error("Error fetching Tag Types:", error);
        setError("Failed to fetch Tag Types");
      }
    }

    fetchData();
  }, []);

  // useEffect(() => {
  //   async function getOwnerUsers() {
  //     try {
  //       const res = await axios.get('/api/user/getUserList');
  //       setUsers(res.data.data);

  //     } catch (error) {
  //       console.log("Failed to fetch users:", error.message);
  //       toast.error("सर्वर डाउन आहे ");
  //     }
  //   }
  //   getOwnerUsers();
  // }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0]; // yyyy-mm-dd format
    setCurrentDate(formattedDate);
  }, []);

  const handleUserChange = (event) => {
    const selectedRegisterNo = event.target.value;
    setSelectedOption(selectedRegisterNo);

    const user = users.find(user => user.registerNo === parseInt(selectedRegisterNo, 10));
    setSelectedUser(user);
  };

  const handleRegisterNoBlur = (event) => {
    const registerNo = event.target.value;
    const user = users.find(user => user.registerNo === parseInt(registerNo, 10));
    setSelectedUser(user);
    setSelectedOption(registerNo);
  };

  const handleRegisterNoFocus = () => {
    setSelectedOption('');
    setSelectedUser(null);

    inputRefs.current.forEach(ref => {
      if (ref) ref.value = '';
    });
  };

  const [errors, setErrors] = useState({});

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear dependent fields when parent field changes
    if (name === 'tagStatus' && value === 'untagged') {
      setFormData(prev => ({ ...prev, tagId: '' }));
    }
    if (name === 'purpose' && value !== 'inMilk') {
      setFormData(prev => ({ ...prev, quantityOfMilk: '' }));
    }
    if (name === 'purpose' && value !== 'pregnant') {
      setFormData(prev => ({ ...prev, runningMonth: '' }));
    }
    if (name === 'healthStatus' && value === 'healthy') {
      setFormData(prev => ({ ...prev, typeOfDisease: '' }));
    }
  };

  // Validation function
  const validate = () => {
    const newErrors = {};

    // Address validation
    if (!address.village) newErrors.village = 'Village is ';
    if (!address.tahasil) newErrors.tahasil = 'Tahasil is ';
    if (!address.district) newErrors.district = 'District is ';

    // Existing validations
    if (!formData.species) newErrors.species = 'Species is ';
    if (!formData.animalGender) newErrors.animalGender = 'Gender is ';
    if (!formData.breed) newErrors.breed = 'Breed is required';
    if (!formData.DOB) newErrors.DOB = 'Date of Birth is required';
    if (!formData.age) newErrors.age = 'Age is required';
    if (!formData.purpose) newErrors.purpose = 'Purpose is required';
    if (!formData.healthStatus) newErrors.healthStatus = 'Health status is required';

    // Conditional validations
    if (formData.tagStatus === 'tagged') {
      if (!formData.tagType) newErrors.tagType = 'Tag type is required for tagged animals';
      if (!formData.tagId) newErrors.tagId = 'Tag ID is required for tagged animals';
    }

    if (formData.tagStatus === 'untagged' && require === true) {
      if (!formData.tagType) newErrors.tagType = 'Tag type is required';
    }

    if (formData.purpose === 'inMilk' && !formData.quantityOfMilk) {
      newErrors.quantityOfMilk = 'Milk quantity is required for animals in milk';
    }

    if (formData.purpose === 'pregnant' && !formData.runningMonth) {
      newErrors.runningMonth = 'Pregnancy month is required for pregnant animals';
    }

    if (formData.healthStatus === 'sick' && !formData.typeOfDisease) {
      newErrors.typeOfDisease = 'Disease type is required for sick animals';
    }

    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
  if (lastChanged === "DOB" && formData.DOB) {
    const dobDate = new Date(formData.DOB);
    const today = new Date();
    const months =
      (today.getFullYear() - dobDate.getFullYear()) * 12 +
      (today.getMonth() - dobDate.getMonth());

    setFormData((prev) => ({
      ...prev,
      age: months >= 0 ? months : 0,
    }));
  }

  if (lastChanged === "age" && formData.age) {
    const months = parseInt(formData.age);
    if (!isNaN(months) && months >= 0) {
      const today = new Date();
      const dobDate = new Date(
        today.getFullYear(),
        today.getMonth() - months,
        today.getDate()
      );
      const isoDob = dobDate.toISOString().split("T")[0];

      setFormData((prev) => ({
        ...prev,
        DOB: isoDob,
      }));
    }
  }
}, [formData.DOB, formData.age, lastChanged]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const payload = {
          ...formData,
          ...address, // Include all address fields
          registerNo: selectedUser?.registerNo,
          username: selectedUser?.name,
          dairyName: ownerName,
          date: currentDate
        };

        const res = await axios.post('/api/AnimalDetails/animalifo', payload);

        if (res.data.success) {
          Toast.success('Animal added successfully');
          // Reset form
          setFormData({
            species: '',
            animalGender: '',
            tagStatus: 'untagged',
            tagType: '',
            tagId: '',
            breed: '',
            DOB: '',
            age: '',
            purpose: '',
            quantityOfMilk: '',
            runningMonth: '',
            healthStatus: 'healthy',
            typeOfDisease: '',
            require: false,
          });
        } else {
          Toast.error(res.data.error || 'Failed to add animal');
        }
      } catch (error) {
        console.error("Failed to submit form:", error);
        Toast.error(error.response?.data?.error || 'Failed to add animal');
      }
    }
  };

  useEffect(() => {
    const fetchOwnerName = async () => {
      try {
        const response = await fetch("/api/owner/OwnerName"); // Call your API route
        const data = await response.json();

        if (response.ok) {
          setOwnerName(data.ownerName); // Set owner name in state
        } else {
          console.error(data.error); // Log error if any
        }
      } catch (error) {
        console.error("Error fetching owner name:", error);
      }
    };

    fetchOwnerName();
  }, []);


  return (
    <div className='gradient-bg flex flex-col min-h-screen'>
      <div className="fixed inset-0 flex items-center p-4 justify-center rounded-lg">
        {/* Overlay */}

        {/* Modal Content */}
        <div className="relative bg-blue-200 max-w-lg h-[80vh] mx-auto p-6 rounded-lg shadow-md overflow-x-auto overflow-y-auto m-2">
          <style jsx>{`
              .max-w-lg::-webkit-scrollbar {
                height: 8px;
                width: 6px
              }
              .max-w-lg::-webkit-scrollbar-track {
                background: white;
              }
              .max-w-lg::-webkit-scrollbar-thumb {
                background: linear-gradient(to bottom right, #4a90e2, #9013fe);
                border-radius: 10px;
                width: 8px;
              }
            `}</style>

          {/* Title */}
          <h2 className="text-2xl text-black font-bold mb-4 flex justify-center text-center">प्राणी तपशील भरणे</h2>
          {/* Form */}
          <form className="text-black flex flex-wrap -mx-2" onSubmit={handleSubmit}>

            <div className="flex flex-wrap md:space-x-4 mb-4">
              <span className="relative z-10 inline-block text-blue-900">
                {ownerName || "Guest"}
              </span>
              <div className="flex flex-col mb-4 w-full md:w-1/2">
                <input
                  type="date"
                  id="date"
                  className="text-black p-2 text-xl font-mono mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md shadow-sm"
                  value={currentDate}
                  onChange={(e) => setCurrentDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            <div className="flex flex-wrap md:space-x-4 mb-4">
              {/* Address Section */}
              <div className="w-full flex flex-wrap">
                <div className="w-full md:w-1/3 px-2 mb-4">
                  <label htmlFor="village" className="text-black">गाव</label>
                  <input
                    id="village"
                    name="village"
                    type="text"
                    value={address.village}
                    onChange={(e) => setAddress({ ...address, village: e.target.value })}
                    className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                    required
                  />
                  {errors.village && <span className="text-red-500 text-sm">{errors.village}</span>}
                </div>

                <div className="w-full md:w-1/3 px-2 mb-4">
                  <label htmlFor="tahasil" className="text-black">तहसील</label>
                  <input
                    id="tahasil"
                    name="tahasil"
                    type="text"
                    value={address.tahasil}
                    onChange={(e) => setAddress({ ...address, tahasil: e.target.value })}
                    className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                    required
                  />
                  {errors.tahasil && <span className="text-red-500 text-sm">{errors.tahasil}</span>}
                </div>

                <div className="w-full md:w-1/3 px-2 mb-4">
                  <label htmlFor="district" className="text-black">जिल्हा</label>
                  <input
                    id="district"
                    name="district"
                    type="text"
                    value={address.district}
                    onChange={(e) => setAddress({ ...address, district: e.target.value })}
                    className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                    required
                  />
                  {errors.district && <span className="text-red-500 text-sm">{errors.district}</span>}
                </div>
              </div>
              <div className="flex flex-col mb-4 w-full md:w-1/6">
                <input
                  type="number"
                  inputMode="numeric"
                  id="code"
                  ref={registerNoRef}  // Add this line
                  placeholder="रजि. नं."
                  className="text-black h-fit text-xl font-mono p-2 mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-16 bg-gray-200 rounded-md"
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
              </div>
              <div className="flex flex-col mb-4 w-full md:w-1/2">
                <select
                  id="user-select"
                  className="text-black h-fit text-xl font-mono p-2 mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none  bg-gray-200 rounded-md"
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
              <div className="flex flex-col w-full md:w-1/6">
                <select
                  id="milk-select"
                  className="text-black h-fit text-xl font-mono p-2 mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none bg-gray-200 rounded-md"
                  value={selectedUser?.milk || ""}
                  disabled
                >
                  <option value="">दूध प्रकार</option>
                  {users.map((user) => (
                    <option key={user.registerNo} value={user.milk}>
                      {user.milk}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Species */}
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label htmlFor="species" className="text-black">प्राण्याचा प्रकार</label>
              <select
                id="species"
                name="species"
                value={formData.species}
                onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                required
              >
                <option value="">Select Species</option>
                <option value="cow">गाय</option>
                <option value="buffalo">म्हैस</option>
                <option value="goat">शेळी</option>
                <option value="sheep">मेंढी</option>
                <option value="hen">कोंबडी</option>
                <option value="duck">बदक</option>
              </select>
              {errors.species && <span className="text-red-500 text-sm">{errors.species}</span>}
            </div>

            {/* Animal Gender */}
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label htmlFor="animalGender" className="text-black">लिंग</label>
              <select
                id="animalGender"
                name="animalGender"
                value={formData.animalGender}
                onChange={(e) => setFormData({ ...formData, animalGender: e.target.value })}
                className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">नर</option>
                <option value="Female">मादी</option>
              </select>
              {errors.animalGender && <span className="text-red-500 text-sm">{errors.animalGender}</span>}
            </div>

            {/* Tag Status */}
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label htmlFor="tagStatus" className="text-black">टॅग स्थिती</label>
              <select
                id="tagStatus"
                name="tagStatus"
                value={formData.tagStatus}
                onChange={(e) => setFormData({ ...formData, tagStatus: e.target.value })}
                className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
              >
                <option value="tagged">टॅग केलेले</option>
                <option value="untagged">टॅग न केलेले</option>
              </select>
            </div>
            {/* Tag Type (conditional) */}
            {formData.tagStatus === 'tagged' && (
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label htmlFor="tagType" className="text-black">टॅग प्रकार</label>
                <select
                  id="tagType"
                  name="tagType"
                  value={formData.tagType}
                  onChange={(e) => setFormData({ ...formData, tagType: e.target.value })}
                  className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                >
                  <option value="">Select Tag Type</option>
                  {tagTypes.map((tagType) => (
                    <option key={tagType._id} value={tagType.TagType}>
                      {tagType.TagType}
                    </option>
                  ))}
                </select>
                {errors.tagType && <span className="text-red-500 text-sm">{errors.tagType}</span>}
              </div>
            )}

            {/* Tag ID (conditional) */}
            {formData.tagStatus === 'tagged' && (
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label htmlFor="tagId" className="text-black">टॅग आयडी</label>
                <input
                  id="tagId"
                  type="text"
                  name="tagId"
                  value={formData.tagId}
                  onChange={(e) => setFormData({ ...formData, tagId: e.target.value })}
                  className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                />
                {errors.tagId && <span className="text-red-500 text-sm">{errors.tagId}</span>}
              </div>
            )}

            {/* Breed */}
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label htmlFor="breed" className="text-black">जात</label>
              <select
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                required
              >
                <option value="">Select Breed</option>
                <option value="sahiwal">साहिवाल</option>
                <option value="jersey">जर्सी</option>
                <option value="holstein">होल्स्टीन</option>
                <option value="murrah">मुर्रा</option>
                <option value="kankrej">कांकरेज</option>
                <option value="desi">देशी</option>
                <option value="other">इतर</option>
              </select>
              {errors.breed && <span className="text-red-500 text-sm">{errors.breed}</span>}
            </div>

            {/* Date of Birth */}
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label htmlFor="DOB" className="text-black">जन्म तारीख</label>
<input
  id="DOB"
  type="date"
  name="DOB"
  value={formData.DOB}
  onChange={(e) => {
    const dob = e.target.value;
    setFormData({ ...formData, DOB: dob });
    setLastChanged("DOB");
  }}
  className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
  max={currentDate}
  required
/>
              {errors.DOB && <span className="text-red-500 text-sm">{errors.DOB}</span>}
            </div>

            {/* Age */}
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label htmlFor="age" className="text-black">वय (महिने)</label>
<input
  id="age"
  type="number"
  name="age"
  value={formData.age}
  onChange={(e) => {
    const age = e.target.value;
    setFormData({ ...formData, age });
    setLastChanged("age");
  }}
  className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
  required
/>
              {errors.age && <span className="text-red-500 text-sm">{errors.age}</span>}
            </div>

            {/* Purpose */}
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label htmlFor="purpose" className="text-black">उद्देश</label>
              <select
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                required
              >
                <option value="">Select Purpose</option>
                <option value="inMilk">दुधारू</option>
                <option value="dry">कोरडे</option>
                <option value="calf">वासू</option>
                <option value="pregnant">गरोदर</option>
                <option value="other">इतर</option>
              </select>
              {errors.purpose && <span className="text-red-500 text-sm">{errors.purpose}</span>}
            </div>

            {/* Milk Quantity (conditional) */}
            {formData.purpose === 'inMilk' && (
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label htmlFor="quantityOfMilk" className="text-black">दुधाचे प्रमाण (लीटर/दिवस)</label>
                <input
                  id="quantityOfMilk"
                  type="number"
                  name="quantityOfMilk"
                  value={formData.quantityOfMilk}
                  onChange={(e) => setFormData({ ...formData, quantityOfMilk: e.target.value })}
                  step="0.1"
                  className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                />
                {errors.quantityOfMilk && <span className="text-red-500 text-sm">{errors.quantityOfMilk}</span>}
              </div>
            )}

            {/* Pregnancy Month (conditional) */}
            {formData.purpose === 'pregnant' && (
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label htmlFor="runningMonth" className="text-black">गरोदरपणाचा महिना</label>
                <input
                  id="runningMonth"
                  type="number"
                  name="runningMonth"
                  value={formData.runningMonth}
                  onChange={(e) => setFormData({ ...formData, runningMonth: e.target.value })}
                  min="1"
                  max="9"
                  className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                />
                {errors.runningMonth && <span className="text-red-500 text-sm">{errors.runningMonth}</span>}
              </div>
            )}

            {/* Health Status */}
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label htmlFor="healthStatus" className="text-black">आरोग्य स्थिती</label>
              <select
                id="healthStatus"
                name="healthStatus"
                value={formData.healthStatus}
                onChange={(e) => setFormData({ ...formData, healthStatus: e.target.value })}
                className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
              >
                <option value="healthy">निरोगी</option>
                <option value="sick">आजारी</option>
              </select>
            </div>

            {/* Disease Type (conditional) */}
            {formData.healthStatus === 'sick' && (
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label htmlFor="typeOfDisease" className="text-black">आजाराचा प्रकार</label>
                <input
                  id="typeOfDisease"
                  type="text"
                  name="typeOfDisease"
                  value={formData.typeOfDisease}
                  onChange={(e) => setFormData({ ...formData, typeOfDisease: e.target.value })}
                  className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                />
                {errors.typeOfDisease && <span className="text-red-500 text-sm">{errors.typeOfDisease}</span>}
              </div>
            )}

            {/* Tag Type (conditional) for untagged animals */}
            {formData.tagStatus === 'untagged' && (
              <div className="w-full px-2 mb-4">
                <label>
                  <input
                    type="checkbox"
                    name="require"
                    checked={formData.require}
                    onChange={(e) =>
                      setFormData({ ...formData, require: e.target.checked })}
                    className='w-4 h-4 m-2'
                  />
                  तुम्हाला टॅग सेवा हवी असेल तर समोरील बॉक्सवर क्लिक करून टॅगचा प्रकार निवडा. <Link href="/home/AllDairies/OwnerMilks"> <span className='text-blue-500'> टॅग संबंधित विस्तारित माहिती जाणून घ्या.</span></Link>
                </label>

              </div>)}

            {formData.tagStatus === 'untagged' && (
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label htmlFor="tagType" className="text-black">टॅग प्रकार</label>
                <select
                  id="tagType"
                  name="tagType"
                  value={formData.tagType}
                  onChange={(e) => setFormData({ ...formData, tagType: e.target.value })}
                  className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                >
                  <option value="">Select Tag Type</option>
                  {tagTypes.map((tagType) => (
                    <option key={tagType._id} value={tagType.TagType}>
                      {tagType.TagType}
                    </option>
                  ))}
                </select>
                {errors.tagType && <span className="text-red-500 text-sm">{errors.tagType}</span>}
              </div>
            )}

            {/* Submit Button */}
            <div className="w-full px-2">
              <div className="flex justify-center items-center mt-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white p-2 rounded w-36"
                  disabled={loading}
                >
                  {loading ? 'सबमिट करत आहे...' : 'सबमिट करा'}
                </button>
              </div>
            </div>


            {/* Toast Notifications */}

          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AnimalForm;