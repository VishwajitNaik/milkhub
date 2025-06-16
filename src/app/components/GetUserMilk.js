"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const OwnerMilkRecords = () => {
    const [milkRecords, setMilkRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    const fetchMilkRecords = async () => {
        if (!startDate || !endDate) {
            alert("Please select both start and end dates.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`/api/milk/getOwnerAllMilk`, {
                params: { startDate, endDate },
                withCredentials: true,
            });

            setMilkRecords(response.data.data);
            setCurrentPage(1);
        } catch (err) {
            setError("Failed to fetch milk records");
            console.error("Error fetching milk records:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (recordId) => {
        try {
            await axios.delete(`/api/milk/deleteMilkRecord?id=${recordId}`);
            setMilkRecords(milkRecords.filter((record) => record._id !== recordId));
        } catch (error) {
            console.error('Error deleting milk record: ', error.message);
        }
    };

    const morningRecords = milkRecords.filter((record) => record.session === "morning");
    const eveningRecords = milkRecords.filter((record) => record.session === "evening");

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

    const paginate = (records) => {
        return records.slice(indexOfFirstRecord, indexOfLastRecord);
    };

    const totalPages = (records) => Math.ceil(records.length / recordsPerPage);

    const calculateTotals = (records) => {
        const totalLiters = records.reduce((sum, record) => sum + (record.liter || 0), 0);
        const totalbuffLiter = records.filter(record => record.milk === "म्हैस ").reduce((sum, record) => sum + (record.liter || 0), 0);
        const totalcowLiter = records.filter(record => record.milk === "गाय ").reduce((sum, record) => sum + (record.liter || 0), 0);

        const buffRecords = records.filter(record => record.milk === "म्हैस ");
        const cowRecords = records.filter(record => record.milk === "गाय ");

        const avgBuffFat = buffRecords.length ? (buffRecords.reduce((sum, record) => sum + (record.fat || 0), 0) / buffRecords.length).toFixed(2) : "N/A";
        const avgCowFat = cowRecords.length ? (cowRecords.reduce((sum, record) => sum + (record.fat || 0), 0) / cowRecords.length).toFixed(2) : "N/A";
        const avgBuffSNF = buffRecords.length ? (buffRecords.reduce((sum, record) => sum + (record.snf || 0), 0) / buffRecords.length).toFixed(2) : "N/A";
        const avgCowSNF = cowRecords.length ? (cowRecords.reduce((sum, record) => sum + (record.snf || 0), 0) / cowRecords.length).toFixed(2) : "N/A";

        const avgRate = records.length ? (records.reduce((sum, record) => sum + (record.dar || 0), 0) / records.length).toFixed(2) : "N/A";
        const totalRakkam = records.reduce((sum, record) => sum + (record.rakkam || 0), 0).toFixed(2);

        return { totalLiters, totalbuffLiter, totalcowLiter, avgBuffFat, avgCowFat, avgBuffSNF, avgCowSNF, avgRate, totalRakkam };
    };

    return (
        <>
<h2 className="text-xl font-semibold mb-4 text-center">सर्व उत्पादक दूध विवरण</h2>

<div className="mb-4 flex flex-col md:flex-row md:items-center gap-4">
    <div className="flex flex-col md:flex-row md:items-center w-full">
        <label className="text-sm md:mr-2">सुरवातिची दिनांक</label>
        <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            className="border p-2 rounded text-black w-full md:w-auto"
        />
    </div>

    <div className="flex flex-col md:flex-row md:items-center w-full">
        <label className="text-sm md:ml-4 md:mr-2">शेवटची दिनांक</label>
        <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            className="border p-2 rounded text-black w-full md:w-auto"
        />
    </div>

    <button 
        onClick={fetchMilkRecords} 
        className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto">
        पहा
    </button>
</div>

{loading && <p className="text-center text-gray-600">मिल्क रिकॉर्ड लोड होत आहे ...</p>}
{error && <p className="text-red-500 text-center">{error}</p>}

            <div className="w-full flex flex-col md:flex-row gap-6 p-4 bg-blue-400 text-black rounded-lg shadow-lg">
    {["Morning", "Evening"].map((session, index) => {
        const records = session === "Morning" ? morningRecords : eveningRecords;
        const totals = calculateTotals(records);
        return (
            <div key={index} className="w-full md:w-1/2 p-4 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-3 text-center">
                    {session === "Morning" ? "🌅 सकाळचे दूध" : "🌆 संध्याकाळचे दूध "}
                </h3>

                {/* Wrap the table in an overflow container for mobile scrolling */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 bg-white text-black rounded-md">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2 text-xs md:p-3">तारीख</th>
                                <th className="border p-2 text-xs md:p-3">रज. न.</th>
                                <th className="border p-2 text-xs md:p-3">लिटर</th>
                                <th className="border p-2 text-xs md:p-3">फॅट</th>
                                <th className="border p-2 text-xs md:p-3">SNF</th>
                                <th className="border p-2 text-xs md:p-3">दर</th>
                                <th className="border p-2 text-xs md:p-3">टोटल रक्कम</th>
                                <th className="border p-2 text-xs md:p-3">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginate(records).length > 0 ? (
                                paginate(records).map((record) => (
                                    <tr key={record._id} className="text-center border-b hover:bg-gray-100">
                                        <td className="border p-2 text-xs md:p-3">{new Date(record.date).toLocaleDateString()}</td>
                                        <td className="border p-2 text-xs md:p-3">{record.registerNo}</td>
                                        <td className="border p-2 text-xs md:p-3">{record.liter}</td>
                                        <td className="border p-2 text-xs md:p-3">{record.fat || 'N/A'}</td>
                                        <td className="border p-2 text-xs md:p-3">{record.snf || 'N/A'}</td>
                                        <td className="border p-2 text-xs md:p-3">{(record.dar || 0).toFixed(2)}</td>
                                        <td className="border p-2 text-xs md:p-3">{(record.rakkam || 0).toFixed(2)}</td>
                                        <td className="border p-2 text-xs md:p-3">
                                            <button
                                                onClick={() => handleDelete(record._id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded text-xs md:text-sm"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center p-4 text-xs"> {session.toLowerCase()} रेकॉर्ड मिळाले नाही .</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages(records) > 1 && (
                    <div className="flex flex-col md:flex-row justify-center items-center mt-4 space-y-2 md:space-y-0 md:space-x-4">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 text-xs md:text-sm"
                        >
                            मागील
                        </button>
                        <span className="text-xs md:text-sm">पान {currentPage} of {totalPages(records)}</span>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages(records)))}
                            disabled={currentPage === totalPages(records)}
                            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 text-xs md:text-sm"
                        >
                            पुढील
                        </button>
                    </div>
                )}

                {/* Summary Table with Responsive Layout */}
                <div className="overflow-x-auto">
                    <table className="mt-4 w-full border text-center border-collapse text-xs md:text-sm">
                        <tbody>
                            <tr>
                                <td className="border p-2 font-semibold">म्हैस लिटर</td>
                                <td className="border p-2">{(totals.totalbuffLiter).toFixed(2)}</td>
                                <td className="border p-2 font-semibold">गाय लिटर</td>
                                <td className="border p-2">{(totals.totalcowLiter).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className="border p-2 font-semibold">एकूण लिटर</td>
                                <td className="border p-2">{(totals.totalLiters).toFixed(2)}</td>
                                <td className="border p-2 font-semibold">एकूण रक्कम</td>
                                <td className="border p-2">{totals.totalRakkam}</td>
                            </tr>
                            <tr>
                                <td className="border p-2 font-semibold">सरासरी म्हैस फॅट</td>
                                <td className="border p-2">{totals.avgBuffFat}</td>
                                <td className="border p-2 font-semibold">सरासरी गाय फॅट</td>
                                <td className="border p-2">{totals.avgCowFat}</td>
                            </tr>
                            <tr>
                                <td className="border p-2 font-semibold">सरासरी म्हैस SNF</td>
                                <td className="border p-2">{totals.avgBuffSNF}</td>
                                <td className="border p-2 font-semibold">सरासरी गाय SNF</td>
                                <td className="border p-2">{totals.avgCowSNF}</td>
                            </tr>
                            <tr>
                                <td className="border p-2 font-semibold">सरासरी दर</td>
                                <td className="border p-2" colSpan="3">{totals.avgRate}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    })}
</div>

        </>
    );
};

export default OwnerMilkRecords;