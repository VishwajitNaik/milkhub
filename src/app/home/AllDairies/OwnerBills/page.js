"use client";

import { ToastContainer, toast as Toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from "react";
import axios from "axios";
import SendMoney from '../../../components/sendMoney';

const BillSummary = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [billData, setBillData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [billsGenerated, setBillsGenerated] = useState(false);
  const [error, setError] = useState("");
  const [selectedBill, setSelectedBill] = useState(null);

  const handleFetchBills = async () => {
    setLoading(true);
    setError("");
    setBillsGenerated(false);

    try {
      const response = await axios.post("/api/sangh/OwnerBills", {
        startDate,
        endDate,
      });

      if (response.data && Array.isArray(response.data.data)) {
        setBillData(response.data.data);
        setBillsGenerated(true);
      } else {
        Toast.error("Invalid response format from server.");
      }
    } catch (error) {
      Toast.error("This Date range Bills Are Allready Exist Please Check Again");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleMoreInfo = (bill) => {
    setSelectedBill(bill);
  };

  const closeModal = () => {
    setSelectedBill(null);
  };

  useEffect(() => { }, [billData]);

  const handleSaveBills = async () => {
    if (billData.length === 0) {
      setError("No bills to save.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.post("/api/sangh/Store", { bills: billData, startDate, endDate });
      console.log("Bills saved successfully:", response.data);
      Toast.success("Bills saved successfully!");
    } catch (error) {
      Toast.error("This Date range Bills Are Allready Exist Please Check Again");
    } finally {
      setLoading(false);
    }
  };

  const totalLiters = billData.reduce((total, bill) => total + parseFloat(bill.totalLiters || 0), 0).toFixed(1);
  const totalBuffLiter = billData.reduce((total, bill) => total + parseFloat(bill.buffTotalLiters || 0), 0).toFixed(1);
  const totalCowLiter = billData.reduce((total, bill) => total + parseFloat(bill.cowTotalLiters || 0), 0).toFixed(1);
  const totalRakkam = billData.reduce((total, bill) => total + parseFloat(bill.totalRakkam || 0), 0).toFixed(1);
  const totalBuffRakkam = billData.reduce((total, bill) => total + parseFloat(bill.buffTotalRakkam || 0), 0).toFixed(1);
  const totalCowRakkam = billData.reduce((total, bill) => total + parseFloat(bill.cowTotalRakkam || 0), 0).toFixed(1);
  const totalKapat = billData.reduce((total, bill) => total + parseFloat(bill.totalKapat || 0), 0).toFixed(1);
  const totalKapatRate = billData.reduce((total, bill) => total + parseFloat(bill.totalKapatRateMultiplybyTotalLiter || 0), 0).toFixed(1);
  const totalBuffBillKapat = billData.reduce((total, bill) => total + parseFloat(bill.totalBuffBillKapat || 0), 0).toFixed(1);
  const totalCowBillKapat = billData.reduce((total, bill) => total + parseFloat(bill.totalCowBillKapat || 0), 0).toFixed(1);
  const totalBillKapat = billData.reduce((total, bill) => total + parseFloat(bill.totalBillKapat || 0), 0).toFixed(1);
  const totalNetPayment = billData.reduce((total, bill) => total + parseFloat(bill.netPayment || 0), 0).toFixed(1);
  const totalBuffExtraRate = billData.reduce((total, bill) => total + parseFloat(bill.totalBuffExtraRate || 0), 0).toFixed(1);
  const totalCowExtraRate = billData.reduce((total, bill) => total + parseFloat(bill.totalCowExtraRate || 0), 0).toFixed(1);
  const totalEarningsFromVisits = billData.reduce((total, bill) => total + parseFloat(bill.totalEarningsFromVisits || 0), 0).toFixed(1);
  console.log("totalEarningsFromVisits",totalEarningsFromVisits);
  console.log("totalCowExtraRate",totalCowExtraRate);
  

  

  return (
    <>
      <style>
        {`
    @media print {
      @page {
        size: A4 landscape;
        margin: 10mm;
      }

      .gradient-bg {
        transform: scale(0.95);
        transform-origin: top left;
        padding: 0;
      }

      table {
        width: 100%;
        table-layout: fixed;
        border-collapse: collapse;
      }

      th, td {
        border: 1px solid #000;
        padding: 15px !important;
        text-align: center;
        font-size: 16px !important;
        height: 40px !important;
        word-wrap: break-word;
      }

      .p-3, .py-2, .px-4 {
        padding: 5px !important;
      }

      .gradient-bg button, 
      .gradient-bg form {
        display: none;
      }

      body {
        font-size: 16px;
        color: #000;
      }

      /* Ensure summary report starts on a new page */
      .summary-report {
        margin-top: -20px;
        page-break-before: always; /* For older browsers */
        break-before: page; /* Modern browsers */
      }
    }
  `}
      </style>

      <div className="gradient-bg flex flex-col min-h-screen p-4">
        <h1 className="text-2xl font-bold text-center mb-4">Bill Summary</h1>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
          <div className="w-full md:w-auto">
            <label htmlFor="startDate" className="block mb-1 font-medium">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-black border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="w-full md:w-auto">
            <label htmlFor="endDate" className="block mb-1 font-medium">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-black border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <button
            onClick={handleFetchBills}
            disabled={loading}
            className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            {loading ? "Fetching..." : "Generate Bills"}
          </button>
        </div>

        {error && <p className="text-red-600 text-center">{error}</p>}

        {billsGenerated && billData.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-200 text-center border-collapse border border-gray-200 mb-6">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-black border border-gray-200 px-4 py-2">Register No</th>
                  <th className="text-black border border-gray-200 px-4 py-2">Owner Name</th>
                  <th className="text-black border border-gray-200 px-4 py-2">Total Liters</th>
                  <th className="text-black border border-gray-200 px-4 py-2">Total Rakkam</th>
                  <th className="text-black border border-gray-200 px-4 py-2">Extra Rate</th>
                  <th className="text-black border border-gray-200 px-4 py-2">Total Kapat</th>
                  <th className="text-black border border-gray-200 px-4 py-2">Net Payment</th>
                  <th className="text-black border border-gray-200 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {billData.map((bill, index) => (
                  <tr key={index} className="even:bg-gray-50">
                    <td className="text-black border border-gray-200 px-4 py-2">
                      {bill.registerNo}
                    </td>
                    <td className="text-black border border-gray-200 px-4 py-2">
                      {bill.ownerName}
                    </td>
                    <td className="text-black border border-gray-200 px-4 py-2">
                      {bill.totalLiters}
                    </td>
                    <td className="text-black border border-gray-200 px-4 py-2">
                      {bill.totalRakkam}
                    </td>
                    <td className="text-black border border-gray-200 px-4 py-2">
                      {bill.totalExtraRate}
                    </td>
                    <td className="text-black border border-gray-200 px-4 py-2">
                      {bill.totalKapat}
                    </td>
                    <td className="text-black border border-gray-200 px-4 py-2">
                      {bill.netPayment}
                    </td>
                    <td className="text-black border border-gray-200 px-4 py-2">
                      <button
                        onClick={() => handleMoreInfo(bill)}
                        className="bg-gray-600 text-white px-2 py-1 rounded-md hover:bg-gray-700 transition"
                      >
                        More Info
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        )}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={handleSaveBills}
            className="w-full md:w-auto py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md"
          >
            Save Bills
          </button>
          <button
            onClick={handlePrint}
            className="w-full md:w-auto bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Print Summary
          </button>
        </div>

        {billsGenerated && billData.length === 0 && (
          <p className="text-center text-gray-500">
            No bills found for the selected date range.
          </p>
        )}

        {selectedBill && (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-white/10 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md shadow-md max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-black text-xl font-bold mb-4 text-center">Additional Details</h2>

              {/* Buffalo Table */}
              <h3 className="text-black text-lg font-bold mb-2">Buffalo Details</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 mb-4">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-black border border-gray-200 px-4 py-2">Detail</th>
                      <th className="text-black border border-gray-200 px-4 py-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-black font-medium border border-gray-200 px-4 py-2">
                        Total Liters
                      </td>
                      <td className="text-black border border-gray-200 px-4 py-2">
                        {selectedBill.buffTotalLiters}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-black font-medium border border-gray-200 px-4 py-2">
                        Total Rakkam
                      </td>
                      <td className="text-black border border-gray-200 px-4 py-2">
                        {selectedBill.buffTotalRakkam}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-black font-medium border border-gray-200 px-4 py-2">
                        Extra Rate
                      </td>
                      <td className="text-black border border-gray-200 px-4 py-2">
                        {selectedBill.totalBuffExtraRate || "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Cow Table */}
              <h3 className="text-black text-lg font-bold mb-2">Cow Details</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 mb-4">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-black border border-gray-200 px-4 py-2">Detail</th>
                      <th className="text-black border border-gray-200 px-4 py-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-black font-medium border border-gray-200 px-4 py-2">
                        Total Liters
                      </td>
                      <td className="text-black border border-gray-200 px-4 py-2">
                        {selectedBill.cowTotalLiters}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-black font-medium border border-gray-200 px-4 py-2">
                        Total Rakkam
                      </td>
                      <td className="text-black border border-gray-200 px-4 py-2">
                        {selectedBill.cowTotalRakkam}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-black font-medium border border-gray-200 px-4 py-2">
                        Extra Rate
                      </td>
                      <td className="text-black border border-gray-200 px-4 py-2">
                        {selectedBill.totalCowExtraRate || "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Summary Details */}
              <h3 className="text-lg font-bold mb-2 text-black">Summary</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <tbody>
                    <tr className="bg-gray-100">
                      <td className="text-black font-medium border border-gray-200 px-4 py-2">
                        Total Rakkam
                      </td>
                      <td className="text-black border border-gray-200 px-4 py-2">
                        {selectedBill.totalRakkam}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-black font-medium border border-gray-200 px-4 py-2">
                        Extra Rate
                      </td>
                      <td className="text-black border border-gray-200 px-4 py-2">
                        {selectedBill.totalExtraRate}
                      </td>
                    </tr>
                    <tr className="bg-gray-100">
                      <td className="text-black font-medium border border-gray-200 px-4 py-2">
                        Total Kapat
                      </td>
                      <td className="text-black border border-gray-200 px-4 py-2">
                        {selectedBill.totalKapat}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-black font-medium border border-gray-200 px-4 py-2">
                        Sthir Kapat
                      </td>
                      <td className="text-black border border-gray-200 px-4 py-2">
                        {(selectedBill.totalKapatRateMultiplybyTotalLiter).toFixed(2)}
                      </td>
                    </tr>

                    <tr>
                      <td className="text-black font-medium border border-gray-200 px-4 py-2">
                        Net Payment
                      </td>
                      <td className="text-black border border-gray-200 px-4 py-2">
                        {selectedBill.netPayment}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="text-center mt-4">
                <button
                  onClick={closeModal}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className='mt-24 bg-gray-100 p-4 rounded-lg summary-report'>
          <h3 className='text-lg font-semibold text-black bg-green-300 p-2 shadow-md w-fit rounded-md'>समरी रीपोर्ट</h3>
          <div className='mt-2'>
            {/* Buffalo Table */}
            <div className='flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4'>
              {/* Buffalo Table */}
              <div className='w-full md:w-1/2 bg-blue-100 p-4 rounded-lg shadow-md'>
                <h2 className='text-blue-600 text-lg font-bold mb-2 sm:p-2 w-fit'>म्हैस तपशील</h2>
                <table className='w-full table-auto border-collapse border border-gray-200'>
                  <thead>
                    <tr>
                      <th className='text-black px-4 py-2 text-left font-semibold'>प्रकार</th>
                      <th className='text-black px-4 py-2 text-left font-semibold'>रक्कम</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className='text-black px-4 py-2 border border-gray-500 bg-gray-300'><strong>लिटर</strong></td>
                      <td className='text-black px-4 py-2 border border-gray-500 bg-gray-300'>{Number(totalBuffLiter).toLocaleString("mr-IN")}</td>
                    </tr>
                    <tr>
                      <td className='text-black px-4 py-2 border border-gray-500'><strong>रक्कम</strong></td>
                      <td className='text-black px-4 py-2 border border-gray-500'>{Number(totalBuffRakkam).toLocaleString("mr-IN")}</td>
                    </tr>
                    <tr>
                      <td className='text-black px-4 py-2 border border-gray-500 bg-gray-300'><strong>ज्यादा दर</strong></td>
                      <td className='text-black px-4 py-2 border border-gray-500 bg-gray-300'>{Number(totalBuffExtraRate).toLocaleString("mr-IN")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Cow Table */}
              <div className='w-full md:w-1/2 bg-blue-100 p-4 rounded-lg shadow-md'>
                <h2 className='text-blue-600 text-lg font-bold mb-2 sm:p-2 w-fit'>गाय तपशील</h2>
                <table className='w-full table-auto border-collapse border border-gray-200'>
                  <thead>
                    <tr>
                      <th className='text-black px-4 py-2 text-left font-semibold'>प्रकार</th>
                      <th className='text-black px-4 py-2 text-left font-semibold'>रक्कम</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className='text-black px-4 py-2 border border-gray-500 bg-gray-300'><strong>लिटर</strong></td>
                      <td className='text-black px-4 py-2 border border-gray-500 bg-gray-300'>{Number(totalCowLiter).toLocaleString("mr-IN")}</td>
                    </tr>
                    <tr>
                      <td className='text-black px-4 py-2 border border-gray-500'><strong>रक्कम</strong></td>
                      <td className='text-black px-4 py-2 border border-gray-500'>{Number(totalCowRakkam).toLocaleString("mr-IN")}</td>
                    </tr>
                    <tr>
                      <td className='text-black px-4 py-2 border border-gray-500 bg-gray-300'><strong>ज्यादा दर</strong></td>
                      <td className='text-black px-4 py-2 border border-gray-500 bg-gray-300'>{Number(totalCowExtraRate).toLocaleString("mr-IN")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>


            {/* Final Total Table */}
            <h2 className='text-lg font-bold mt-4 text-black bg-green-300 p-2 shadow-md w-fit rounded-md'>टोटल </h2>
            <table className='min-w-full table-auto border-collapse border border-gray-200 mt-2'>
              <thead>
                <tr>
                  <th className='border border-gray-500 bg-gray-300 text-black px-4 py-2 font-semibold text-center'>प्रकार </th>
                  <th className='border border-gray-500 bg-gray-300 text-black px-4 py-2 font-semibold text-center'>रक्कम </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='text-black px-4 py-2 border border-gray-500 text-center'><strong>एकूण लिटर </strong></td>
                  <td className='text-black px-4 py-2 border border-gray-500 text-center'>{Number(totalLiters).toLocaleString("mr-IN")}</td>
                </tr>
                <tr>
                  <td className='text-green-800 px-4 py-2 border border-gray-500 text-center'><strong>एकूण रक्कम </strong></td>
                  <td className='text-green-800 px-4 py-2 border border-gray-500 text-center'>{Number(totalRakkam).toLocaleString("mr-IN")}</td>
                </tr>
                <tr>
                  <td className='text-black px-4 py-2 border border-gray-500 text-center'><strong>एकूण स्थिर कपात </strong></td>
                  <td className='text-black px-4 py-2 border border-gray-500 text-center'>{Number(totalKapatRate).toLocaleString("mr-IN")}</td>
                </tr>
                <tr>
                  <td className='text-blue-700 px-4 py-2 border border-gray-500 text-center'><strong> एकूण बिल कपात </strong></td>
                  <td className='text-blue-900 px-4 py-2 border border-gray-500 text-center'>{Number(totalKapat).toLocaleString("mr-IN")}</td>
                </tr>
                <tr>
                  <td className='text-black px-4 py-2 border border-gray-500 text-center'><strong>एकूण कपात </strong></td>
                  <td className='text-black px-4 py-2 border border-gray-500 text-center'>{Number(totalBillKapat).toLocaleString("mr-IN")}</td>
                </tr>
                <tr>
                  <td className='bg-gray-200 text-red-600 px-4 py-2 border border-gray-500 text-center'><strong>निव्वळ रक्कम </strong></td>
                  <td className='bg-gray-200 text-red-600 px-4 py-2 border border-gray-500 text-center'>{Number(totalNetPayment).toLocaleString("mr-IN")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {billsGenerated && <SendMoney billData={billData} loading={loading} setLoading={setLoading} />}

        <ToastContainer />
      </div>
    </>
  );
};

export default BillSummary;
