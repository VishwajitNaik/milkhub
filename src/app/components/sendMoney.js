"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SendMoney = ({ billData }) => {
  const [loading, setLoading] = useState(null);
  const [sentPayments, setSentPayments] = useState([]);

  const handleSendMoney = async (owner) => {
    setLoading(owner.registerNo);
    try {
      await axios.post('/api/sangh/send-payment', {
        beneId: `owner${owner.registerNo}`,           // You must have this from Cashfree account
        amount: owner.netPayment,
        remarks: `Milk payment for register no ${owner.registerNo}`,
        transferId: `milkpay-${owner.registerNo}-${Date.now()}`
      });

      toast.success(`Payment sent to ${owner.ownerName}`);
      setSentPayments((prev) => [...prev, owner.registerNo]);
    } catch (err) {
      toast.error(`Failed to send pay: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(null);
    }
  };

  if (!billData || billData.length === 0) {
    return (
      <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
        <p className="text-yellow-800">No payment data available</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Send Payments</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {billData.map((owner) => (
          <div key={owner.registerNo} className="border p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">
                  <span className="text-blue-600">{owner.ownerName}</span>
                  <span className="text-gray-500 ml-2">(Reg: {owner.registerNo})</span>
                </p>
                <p className="text-gray-700 mt-1">
                  Net Payment: <span className="font-bold">₹{owner.netPayment}</span>
                </p>
              </div>
              <button
                onClick={() => handleSendMoney(owner)}
                disabled={loading === owner.registerNo || sentPayments.includes(owner.registerNo)}
                className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition disabled:bg-green-300"
              >
                {loading === owner.registerNo ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Money'
                )}
              </button>
            </div>
            {(owner.paymentStatus === 'sent' || sentPayments.includes(owner.registerNo)) && (
              <div className="mt-2 text-green-600 text-sm">
                ✓ Payment successfully sent
              </div>
            )}
          </div>
        ))}
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default SendMoney;
