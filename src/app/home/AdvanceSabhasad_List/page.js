"use client";
import { ToastContainer, toast as Toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faTrash,
  faAngleDoubleLeft,
  faChevronLeft,
  faChevronRight,
  faAngleDoubleRight,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function Sabhasad() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [updatedUserData, setUpdatedUserData] = useState({});
  const [responseMessage, setResponseMessage] = useState("");
  const [userToDelete, setUserToDelete] = useState(null); // State for user to delete
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10); // Adjust per page count
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    async function getOwnerUsers() {
      try {
        const res = await axios.get(
          `/api/user/getUsers?page=${currentPage}&limit=${usersPerPage}`
        );
        setUsers(res.data.data);
        setTotalUsers(res.data.total);
        console.log("total users : ", res.data.total);
      } catch (error) {
        console.log("Failed to fetch users:", error.message);
      }
    }
    getOwnerUsers();
  }, [currentPage, usersPerPage]);

  const totalPages = Math.ceil(totalUsers / usersPerPage);
  console.log("Total Page", totalPages);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserData({ ...updatedUserData, [name]: value });
  };

  // Handle user deletion with confirmation
  const handleDeleteUser = async (userId) => {
    setUserToDelete(userId); // Set the user to be deleted
  };

  const confirmDeleteUser = async () => {
    try {
      await axios.delete(`/api/user/DeleteUser?id=${userToDelete}`);
      setUsers(users.filter((user) => user._id !== userToDelete));
      Toast.success("User Deleted Successfully");
      setUserToDelete(null); // Reset userToDelete state after deletion
    } catch (error) {
      setResponseMessage(
        `Failed to delete user: ${error.response?.data?.error || error.message}`
      );
    }
  };

  const cancelDelete = () => {
    setUserToDelete(null); // Cancel the deletion
  };

  // Handle the user update submission
  const handleUpdateSubmit = async () => {
    try {
      const response = await axios.put(`/api/user/UpdateUser`, {
        userId: editingUser._id,
        updatedData: updatedUserData,
      });
      Toast.success("User Updated Successfully");
      setUsers(
        users.map((user) =>
          user._id === editingUser._id ? response.data.data : user
        )
      );
      setEditingUser(null);
    } catch (error) {
      setResponseMessage(
        `Failed to update user: ${error.response?.data?.error || error.message}`
      );
    }
  };

  return (
    <div className="gradient-bg flex flex-col min-h-screen">
      <div className="container text-black mx-auto mt-6">
        <div className="flex justify-center items-center mb-6">
          <Image
            src="/assets/avatar.png"
            alt="Avatar"
            width={100}
            height={100}
            className="w-20 h-20 rounded-full mr-4"
          />
          <h1 className="text-4xl font-bold">सभासद लिस्ट</h1>
        </div>

        {responseMessage && (
          <p className="text-center my-4">{responseMessage}</p>
        )}

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto rounded-md">
          <table className="min-w-full bg-gray-300 border border-gray-200 rounded-md">
            <thead className="bg-gray-500">
              <tr>
                <th className="py-2 px-4 border-b">रजिस्टर नं. </th>
                <th className="py-2 px-4 border-b">उत्पादक नं. </th>
                <th className="py-2 px-4 border-b">दूध प्रकार </th>
                <th className="py-2 px-4 border-b">मोबाईल नं.</th>
                <th className="py-2 px-4 border-b">बँकेचे नाव</th>
                <th className="py-2 px-4 border-b">खाता नं. </th>
                <th className="py-2 px-4 border-b">आधार नं.</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-2 px-4 border-b text-center">
                    No users available
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b font-bold">
                      {user.registerNo}
                    </td>
                    <td className="py-2 px-4 border-b">{user.name}</td>
                    <td className="py-2 px-4 border-b">{user.milk}</td>
                    <td className="py-2 px-4 border-b">{user.phone}</td>
                    <td className="py-2 px-4 border-b">{user.bankName}</td>
                    <td className="py-2 px-4 border-b">{user.accountNo}</td>
                    <td className="py-2 px-4 border-b">{user.aadharNo}</td>
                    <td className="py-2 px-4 border-b flex items-center space-x-4">
                    <Link href={`/home/Sabhasad_List/${user._id}`}>
                      <button className="bg-blue-400 hover:bg-blue-700 text-white rounded-md p-2 flex items-center">
                        <span>User Details</span>
                        {user.status === "active" && (
                          <div className="bg-orange-900 hover:bg-orange-700 text-white rounded-full p-1 ml-4"></div>
                        )}
                      </button>
                    </Link>
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setUpdatedUserData({ ...user });
                        }}
                        className="bg-yellow-400 hover:bg-yellow-600 text-white rounded-md p-2"
                      >
                        Update
                      </button>
                      <Link href={`/home/OrdersSabhasad_List/${user._id}`}>
                        <FontAwesomeIcon
                          icon={faShoppingCart}
                          className="text-green-500 text-xl cursor-pointer"
                        />
                      </Link>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-500 hover:bg-red-700 text-white rounded-md p-2"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4 w-full px-4">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-4  py-2 bg-blue-500 text-white rounded-md flex items-center m-2 shadow-md box-content shadow-gray-700"
            >
              <FontAwesomeIcon icon={faAngleDoubleLeft} className="mr-2" />{" "}
              पहिले पृष्ठ
            </button>

            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white flex items-center m-2 shadow-md box-content rounded-md shadow-gray-700 "
            >
              <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
            </button>

            <span className="px-4 py-2 text-lg">Page {currentPage}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white flex items-center m-2 shadow-md rounded-md box-content shadow-gray-700 "
            >
              <FontAwesomeIcon icon={faChevronRight} className="mr-2" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center m-2 shadow-md box-content shadow-gray-700 "
            >
              
              शेवटचे पृष्ठ
              <FontAwesomeIcon icon={faAngleDoubleRight} className="ml-2" />{" "}
            </button>
          </div>
        </div>

        {/* Mobile View */}
        <div className="sm:hidden">
          {users.length === 0 ? (
            <p className="text-center my-4">No users available</p>
          ) : (
            users.map((user, index) => (
              <div
                key={index}
                className="bg-gray-200 p-4 mb-4 rounded-md shadow-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold">Register No:</span>
                  <span>{user.registerNo}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold">Name:</span>
                  <span>{user.name}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold">Milk:</span>
                  <span>{user.milk}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold">Phone:</span>
                  <span>{user.phone}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold">Actions:</span>
                  <div className="flex space-x-2">
                    <Link href={`/home/AdvanceSabhasad_List/${user._id}`}>
                      <button className="bg-blue-400 hover:bg-blue-700 text-white rounded-md p-2">
                        Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
          {/* Pagination Controls */}
<div className="flex flex-wrap justify-center items-center mt-4 w-full px-2 sm:px-4 gap-2 sm:gap-4">
  <button
    onClick={() => handlePageChange(1)}
    disabled={currentPage === 1}
    className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-md flex items-center shadow-md box-content shadow-gray-700 text-sm sm:text-base disabled:opacity-50"
  >
    <FontAwesomeIcon icon={faAngleDoubleLeft} className="mr-1 sm:mr-2" />
  </button>

  <button
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
    className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white flex items-center shadow-md box-content rounded-md shadow-gray-700 text-sm sm:text-base disabled:opacity-50"
  >
    <FontAwesomeIcon icon={faChevronLeft} className="mr-1 sm:mr-2" />
  </button>

  <span className="px-3 py-1 text-sm sm:text-lg">Page {currentPage}</span>

  <button
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages}
    className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white flex items-center shadow-md rounded-md box-content shadow-gray-700 text-sm sm:text-base disabled:opacity-50"
  >
    <FontAwesomeIcon icon={faChevronRight} className="mr-1 sm:mr-2" />
  </button>

  <button
    onClick={() => handlePageChange(totalPages)}
    disabled={currentPage === totalPages}
    className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-md flex items-center shadow-md box-content shadow-gray-700 text-sm sm:text-base disabled:opacity-50"
  >
     <FontAwesomeIcon icon={faAngleDoubleRight} className="ml-1 sm:ml-2" />
  </button>
</div>

        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
