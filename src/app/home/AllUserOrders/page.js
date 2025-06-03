"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/app/components/Loading/Loading";

const UserOrdersBillKapat = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    axios
      .get("/api/orders/AllUserOrders")
      .then((response) => {
        setData(response.data.data);
      })
      .catch(() => {
        setError("Failed to fetch data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const totalRemainingAmount = data.reduce((sum, user) => sum + user.remainingAmount, 0);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="gradient-bg flex flex-col min-h-screen p-4 sm:p-8">
      <h1 className="text-xl sm:text-4xl mb-6 text-center font-semibold">
        सर्व उत्पादक बाकी पाहणे (संपूर्ण डेटा)
      </h1>

      {loading && <p className="text-center"><Loading /></p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Responsive Table Container */}
      <div className="w-full overflow-x-auto bg-white shadow-md rounded-md">
        {currentData.length > 0 ? (
          <table className="min-w-[450px] w-full table-auto border-collapse text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-300 text-black">
                <th className="border px-4 text-black py-2">उत्पादक नं</th>
                <th className="border px-4 text-black py-2">उत्पादक</th>
                <th className="border px-4 text-black py-2">रक्कम</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((user) => (
                <tr key={user.userId} className="text-center">
                  <td className="border text-black border-gray-400 px-4 py-2">{user.registerNo}</td>
                  <td className="border text-black border-gray-400 px-4 py-2">{user.username}</td>
                  <td className="border text-black border-gray-400 px-4 py-2">{user.remainingAmount}</td>
                </tr>
              ))}
              <tr className="bg-gray-200 font-bold">
                <td colSpan="2" className="text-blue-950 border border-gray-400 px-4 py-2 text-center">एकूण बाकी</td>
                <td className="text-blue-950 border border-gray-400 px-4 py-2 text-center">{totalRemainingAmount}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          !loading && <p className="text-center text-gray-700 mt-4">डेटा उपलब्ध नाही</p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center mt-6 gap-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded transition-all text-sm ${
              currentPage === 1
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            मागील पृष्ठ
          </button>
          <span className="text-black text-sm sm:text-base">
            पृष्ठ {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded transition-all text-sm ${
              currentPage === totalPages
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            पुढील पृष्ठ
          </button>
        </div>
      )}
    </div>
  );
};

export default UserOrdersBillKapat;
