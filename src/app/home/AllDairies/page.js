"use client"
import React from 'react'
import SanghNavbar from "../../components/Navebars/SanghNavBar"
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import axios from "axios";
import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  Line,
} from "recharts";
import { ScrollTrigger } from "gsap/ScrollTrigger"; // Import ScrollTrigger
gsap.registerPlugin(ScrollTrigger);


const AllderiesHome = () => {
  const videoRef = useRef(null);
    const containerRef = useRef(null);
    const textRef = useRef(null);

        const [cowData, setCowData] = useState([]);
        const [buffData, setBuffData] = useState([]);
        const [filter, setFilter] = useState("daily");
        const [selectedType, setSelectedType] = useState("cow"); // Default: Cow
    
        useEffect(() => {
            const fetchTrendData = async () => {
                try {
                    const response = await axios.get(`/api/sangh/Analysis/Milk?filter=${filter}`);
                    setCowData(response.data.cowTrendData || []);
                    setBuffData(response.data.buffTrendData || []);
                    console.log("Cow Data:", response.data.cowTrendData);
                    console.log("Buffalo Data:", response.data.buffTrendData);
                } catch (error) {
                    console.error("Error fetching trend data:", error);
                }
            };
    
            fetchTrendData();
        }, [filter]);
    

  useGSAP(() => {
  
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "50% 50%",
        scrub: true,
      },
    });
  
    tl.to(
      textRef.current, { y:-300
       }, 'a')
       .to(videoRef.current, {
        scale: 1.5
       }, 'a')
       .to(containerRef.current, {
        y:400
       }, 'a')
  
  });
  return (
    <>
 <div className="relative w-full h-screen sm:h-[70vh] lg:h-screen overflow-hidden">
  {/* Video background */}
  <video
    ref={videoRef}
    autoPlay
    loop
    muted
    className="w-full h-full object-cover absolute top-0 left-0 z-0 opacity-20"
  >
    <source src="/assets/milk.mp4" type="video/mp4" />
  </video>

  {/* Foreground content */}
  <div className="relative z-10 flex flex-col items-center justify-center px-4 py-10 space-y-6">
    <h1 className="text-4xl font-bold text-center">Milk Collection Analysis</h1>

    {/* Filter Selection */}
    <div className="flex items-center gap-4 flex-col sm:flex-row justify-center">
      <label className="font-semibold">Filter:</label>
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="p-2 border rounded-md text-black"
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>
    </div>

    {/* Type Selection */}
    <div className="flex space-x-4 flex-col sm:flex-row justify-center">
      <button
        className={`p-2 rounded-md font-semibold text-black ${
          selectedType === "cow" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => setSelectedType("cow")}
      >
        Cow Milk
      </button>
      <button
        className={`p-2 rounded-md font-semibold text-black ${
          selectedType === "buff" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => setSelectedType("buff")}
      >
        Buffalo Milk
      </button>
    </div>

    {/* Chart */}
    <ResponsiveContainer width="100%" height={400} className="bg-gray-300 rounded-lg shadow-md">
      <ComposedChart
        data={selectedType === "cow" ? cowData : buffData}
        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalLiters" barSize={20} fill="#8884d8" name="Total Liters" />
        <Area type="monotone" dataKey="totalAmount" fill="#82ca9d" stroke="#82ca9d" name="Total Amount" />
        <Line type="monotone" dataKey="growthRateLiters" stroke="#ff7300" name="Growth Rate (Liters)" />
        <Line type="monotone" dataKey="growthRateAmount" stroke="#ff0000" name="Growth Rate (Amount)" />
      </ComposedChart>
    </ResponsiveContainer>
  </div>
</div>

    </>
        
  )
}

export default AllderiesHome


