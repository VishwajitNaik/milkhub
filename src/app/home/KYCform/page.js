"use client";
import { useState, useRef } from 'react';
import axios from 'axios';

export default function KYCForm({ userId }) {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    ifsc: '',
    bankName: ''
  });
  const [status, setStatus] = useState('');
  const fileInputRef = useRef(null); // ✅ Create ref for file input

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('aadhaarNumber', aadhaarNumber);
    formData.append('aadhaarFile', aadhaarFile);
    formData.append('bankDetails', JSON.stringify(bankDetails));
    formData.append('userId', userId);

    try {
      const response = await axios.post('/api/owner/KYCVerify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus({ text: response.data.message, type: 'success' });

      // ✅ Clear the form
      setAadhaarNumber('');
      setAadhaarFile(null);
      setBankDetails({ accountNumber: '', ifsc: '', bankName: '' });
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      setStatus({ text: 'Verification failed: ' + (error.response?.data?.error || error.message), type: 'error' });
    }
  };

  return (
    <div className="gradient-bg flex flex-col min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h2 className="text-2xl font-bold text-center">KYC Verification</h2>
          <p className="text-center text-blue-100 mt-1">
            Complete your verification to receive payments
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Aadhaar Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Aadhaar Details
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aadhaar Number
              </label>
              <input
                type="text"
                value={aadhaarNumber}
                onChange={(e) =>
                  setAadhaarNumber(e.target.value.replace(/\D/g, '').slice(0, 12))
                }
                pattern="\d{12}"
                className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter 12-digit Aadhaar"
                required
              />
              {aadhaarNumber.length > 0 && aadhaarNumber.length < 12 && (
                <p className="mt-1 text-sm text-red-500">Must be 12 digits</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aadhaar Document
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col w-full border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      {aadhaarFile ? (
                        <span className="font-semibold">{aadhaarFile.name}</span>
                      ) : (
                        <>
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">PDF, JPG or PNG (Max 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.png"
                    onChange={(e) => setAadhaarFile(e.target.files[0])}
                    required
                    ref={fileInputRef}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Bank Account Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Bank Account Details
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                placeholder="Enter account number"
                value={bankDetails.accountNumber}
                onChange={(e) =>
                  setBankDetails({ ...bankDetails, accountNumber: e.target.value.replace(/\D/g, '') })
                }
                className="w-full text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  placeholder="Enter IFSC code"
                  value={bankDetails.ifsc}
                  onChange={(e) =>
                    setBankDetails({ ...bankDetails, ifsc: e.target.value.toUpperCase() })
                  }
                  className="w-full text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  placeholder="Enter bank name"
                  value={bankDetails.bankName}
                  onChange={(e) =>
                    setBankDetails({ ...bankDetails, bankName: e.target.value })
                  }
                  className="w-full p-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Status Message */}
          {status && (
            <div
              className={`p-3 rounded-lg ${
                status.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {status.text}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition duration-200"
            >
              Submit Verification
            </button>
            <p className="mt-3 text-xs text-gray-500 text-center">
              By submitting, you agree to our{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
