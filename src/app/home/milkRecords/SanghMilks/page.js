"use client";
import { useEffect, useState } from "react";

const MilkRecords = () => {
  const [milkRecords, setMilkRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [startDate, setStartDate] = useState(""); // for start date
  const [endDate, setEndDate] = useState(""); // for end date
  const [filteredRecords, setFilteredRecords] = useState([]); // for overall filtered records

  // Separated record states for each category
  const [cowMorningMilkRecords, setCowMorningMilkRecords] = useState([]);
  const [buffaloMorningMilkRecords, setBuffaloMorningMilkRecords] = useState([]);
  const [cowEveningMilkRecords, setCowEveningMilkRecords] = useState([]);
  const [buffaloEveningMilkRecords, setBuffaloEveningMilkRecords] = useState([]);

  useEffect(() => {
    const fetchMilkRecords = async () => {
      try {
        const response = await fetch("/api/owner/Sanghdata/ownerMilk");
        const data = await response.json();

        if (response.ok) {
          let records = [];
          if (Array.isArray(data)) {
            records = data;
          } else if (data?.data && Array.isArray(data.data)) {
            records = data.data;
          } else {
            setError("No valid records found in the response.");
          }
          setMilkRecords(records);
          // Default filter: filter by today's date
          filterByToday(records);
        } else {
          setError(data.message || "Failed to fetch records");
        }
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchMilkRecords();
  }, []);

  // Default filter by today's date
  const filterByToday = (data) => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const todayRecords = data.filter((record) => {
      const recordDate = new Date(record.date);
      const recordStr = recordDate.toISOString().split("T")[0];
      return recordStr === todayStr;
    });

    setFilteredRecords(todayRecords);
    categorizeRecords(todayRecords);
  };

  // Filtering based on user-selected date range
  const filterByDateRange = (data) => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    // Adjust end date to include the whole day
    end.setHours(23, 59, 59, 999);

    const filtered = data.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate >= start && recordDate <= end;
    });

    setFilteredRecords(filtered);
    categorizeRecords(filtered);
  };

  // Separate the data into specific categories (morning/evening, cow/buffalo)
  const categorizeRecords = (records) => {
    const cowMorning = records.filter(
      (record) => record.milkType === "cow" && record.session === "morning"
    );
    const buffaloMorning = records.filter(
      (record) => record.milkType === "buff" && record.session === "morning"
    );
    const cowEvening = records.filter(
      (record) => record.milkType === "cow" && record.session === "evening"
    );
    const buffaloEvening = records.filter(
      (record) => record.milkType === "buff" && record.session === "evening"
    );

    setCowMorningMilkRecords(cowMorning);
    setBuffaloMorningMilkRecords(buffaloMorning);
    setCowEveningMilkRecords(cowEvening);
    setBuffaloEveningMilkRecords(buffaloEvening);
  };

  const handlePop = (record) => {
    setSelectedRecord(record);
  };

  const closeModal = () => {
    setSelectedRecord(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="gradient-bg flex flex-col min-h-screen">
      <h1 className="text-lg sm:text-xl font-bold mb-4">Milk Records</h1>

<div className="flex flex-col sm:flex-row sm:space-x-6 mx-[20%] p-6 bg-white rounded-lg shadow-lg border border-gray-200 mb-2">
  <div className="flex-1">
    <label className="block text-sm font-medium text-gray-700">Start Date</label>
    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      className="text-black p-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base"
    />
  </div>
  
  <div className="flex-1 mt-4 sm:mt-0">
    <label className="block text-sm font-medium text-gray-700">End Date</label>
    <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      className="text-black p-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base"
    />
  </div>
  
  <button
    onClick={() => filterByDateRange(milkRecords)}
    className="mt-6 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
    Apply Filters
  </button>
</div>

      {/* Milk Records Table: Morning Section */}
        <div className="flex flex-row flex-wrap gap-4 mb-8">
        {/* Cow Morning Milk Records Table */}
        <div className="w-full md:w-[48%] p-4 bg-white shadow-md rounded-lg overflow-hidden">
          <h2 className="text-center text-xl font-semibold bg-gray-700 text-white py-3 rounded-t-lg">
            🐄 Cow Morning Milk Records
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-200 text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-100 text-black">
                  <th className="border border-gray-300 px-4 py-2">तारीख</th>
                  <th className="border border-gray-300 px-4 py-2">स्याम्पल नं</th>
                  <th className="border border-gray-300 px-4 py-2">मिल्क प्रकार</th>
                  <th className="border border-gray-300 px-4 py-2">मिल्क लिटर</th>
                  <th className="border border-gray-300 px-4 py-2">फॅट</th>
                  <th className="border border-gray-300 px-4 py-2">एसएनफ</th>
                  <th className="border border-gray-300 px-4 py-2">रेट</th>
                  <th className="border border-gray-300 px-4 py-2">रक्कम</th>
                </tr>
              </thead>
              <tbody>
                {cowMorningMilkRecords.map((record) => (
                  <tr key={record._id} className="border-b bg-gray-200">
                    <td className="text-black px-2 sm:px-4 py-2">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="text-black px-2 sm:px-4 py-2">{record.sampleNo}</td>
                    <td className="text-black px-2 sm:px-4 py-2">गाय</td>
                    <td className="text-black px-2 sm:px-4 py-2">{record.milkLiter}</td>
                    <td className="text-black px-2 sm:px-4 py-2">{record.fat}</td>
                    <td className="text-black px-2 sm:px-4 py-2">{record.snf}</td>
                    <td className="text-black px-2 sm:px-4 py-2">₹{record.rate}</td>
                    <td className="text-black px-2 sm:px-4 py-2">₹{record.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Buffalo Morning Milk Records Table */}
        <div className="w-full md:w-[48%] p-4 bg-white shadow-md rounded-lg overflow-hidden">
          <h2 className="text-center text-xl font-semibold bg-gray-700 text-white py-3 rounded-t-lg">
            🐃 Buffalo Morning Milk Records
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-200 text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-100 text-black">
                  <th className="border border-gray-300 px-4 py-2 text-black">तारीख</th>
                  <th className="border border-gray-300 px-4 py-2 text-black">स्याम्पल नं</th>
                  <th className="border border-gray-300 px-4 py-2 text-black">मिल्क प्रकार</th>
                  <th className="border border-gray-300 px-4 py-2 text-black">मिल्क लिटर</th>
                  <th className="border border-gray-300 px-4 py-2 text-black">फॅट</th>
                  <th className="border border-gray-300 px-4 py-2 text-black">एसएनफ</th>
                  <th className="border border-gray-300 px-4 py-2 text-black">रेट</th>
                  <th className="border border-gray-300 px-4 py-2 text-black">रक्कम</th>
                </tr>
              </thead>
              <tbody>
                {buffaloMorningMilkRecords.map((record) => (
                  <tr key={record._id} className="border-b bg-gray-200">
                    <td className="text-black px-2 sm:px-4 py-2">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="text-black px-2 sm:px-4 py-2">{record.sampleNo}</td>
                    <td className="text-black px-2 sm:px-4 py-2">भैंस</td>
                    <td className="text-black px-2 sm:px-4 py-2">{record.milkLiter}</td>
                    <td className="text-black px-2 sm:px-4 py-2">{record.fat}</td>
                    <td className="text-black px-2 sm:px-4 py-2">{record.snf}</td>
                    <td className="text-black px-2 sm:px-4 py-2">₹{record.rate}</td>
                    <td className="text-black px-2 sm:px-4 py-2">₹{record.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Milk Records Table: Evening Section */}
      <div className="flex flex-row flex-wrap gap-4 mb-8">
        {/* Cow Evening Milk Records Table */}
        <div className="w-full md:w-[48%] p-4 bg-white shadow-md rounded-lg overflow-hidden">
          <h2 className="text-center text-xl font-semibold bg-gray-700 text-white py-3 rounded-t-lg">
            Cow Evening Milk Records
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-200 text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-100 text-black">
                  <th className="border border-gray-300 px-4 py-2">तारीख</th>
                  <th className="border border-gray-300 px-4 py-2">स्याम्पल नं</th>
                  <th className="border border-gray-300 px-4 py-2">मिल्क प्रकार</th>
                  <th className="border border-gray-300 px-4 py-2">मिल्क लिटर</th>
                  <th className="border border-gray-300 px-4 py-2">फॅट</th>
                  <th className="border border-gray-300 px-4 py-2">एसएनफ</th>
                  <th className="border border-gray-300 px-4 py-2">रेट</th>
                  <th className="border border-gray-300 px-4 py-2">रक्कम</th>
                </tr>
              </thead>
              <tbody>
                {cowEveningMilkRecords.map((record) => (
                  <tr key={record._id} className="border-b bg-gray-200">
                    <td className="text-black px-2 sm:px-4 py-2">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-black">{record.sampleNo}</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">गाय</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">{record.milkLiter}</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">{record.fat}</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">{record.snf}</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">₹{record.rate}</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">₹{record.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Buffalo Evening Milk Records Table */}
        <div className="w-full md:w-[48%] p-4 bg-white shadow-md rounded-lg overflow-hidden">
          <h2 className="text-center text-xl font-semibold bg-gray-700 text-white py-3 rounded-t-lg">
            🐃 Buffalo Evening Milk Records
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-200 text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-100 text-black">
                  <th className="border border-gray-300 px-4 py-2">तारीख</th>
                  <th className="border border-gray-300 px-4 py-2">स्याम्पल नं</th>
                  <th className="border border-gray-300 px-4 py-2">मिल्क प्रकार</th>
                  <th className="border border-gray-300 px-4 py-2">मिल्क लिटर</th>
                  <th className="border border-gray-300 px-4 py-2">फॅट</th>
                  <th className="border border-gray-300 px-4 py-2">एसएनफ</th>
                  <th className="border border-gray-300 px-4 py-2">रेट</th>
                  <th className="border border-gray-300 px-4 py-2">रक्कम</th>
                </tr>
              </thead>
              <tbody>
                {buffaloEveningMilkRecords.map((record) => (
                  <tr key={record._id} className="border-b bg-gray-200">
                    <td className="text-black px-2 sm:px-4 py-2">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-black">{record.sampleNo}</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">भैंस</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">{record.milkLiter}</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">{record.fat}</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">{record.snf}</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">₹{record.rate}</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">₹{record.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilkRecords;
