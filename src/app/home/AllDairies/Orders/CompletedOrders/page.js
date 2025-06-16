"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const CompletedOrders = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dairies, setDairies] = useState([]);
    const [expandedDairy, setExpandedDairy] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("/api/sangh/AllOrders");
                const orders = response.data.data?.orders || [];
                setDairies(orders);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching orders:", error.message);
                setError("Error fetching orders");
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const groupedOrders = dairies.reduce((acc, order) => {
        const { dairyName, orderType, quantity, _id, status, rate, createdAt, truckNo, driverMobNo } = order;
        if (!acc[dairyName]) acc[dairyName] = { orders: [], dairyName };
        acc[dairyName].orders.push({ orderType, quantity, _id, status, rate, createdAt, truckNo, driverMobNo });
        return acc;
    }, {});

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center text-red-600">{error}</div>;

    return (
        <div className="min-h-screen p-6 bg-gray-100 gradient-bg">
            <h1 className="text-3xl font-bold mb-8 text-gray-700">Completed Orders</h1>

            {/* Horizontal Button Row */}
            <div className="flex overflow-x-auto space-x-4 mb-6 pb-2">
                {Object.values(groupedOrders).map((dairy) => {
                    const completedCount = dairy.orders.filter(o => o.status === "Completed").length;
                    return (
                        <button
                            key={dairy.dairyName}
                            className={`relative whitespace-nowrap px-6 py-3 mt-10 rounded-lg font-semibold transition ${
                                expandedDairy === dairy.dairyName
                                    ? "bg-green-500 text-white"
                                    : "bg-white text-gray-800 hover:bg-gray-200"
                            }`}
                            onClick={() => setExpandedDairy(dairy.dairyName)}
                        >
                            {dairy.dairyName}
                            {completedCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    {completedCount}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Orders Card Row */}
            {expandedDairy && groupedOrders[expandedDairy] && (
                <div className="w-full bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        {expandedDairy} - Completed Orders
                    </h2>
                    <div className="flex flex-row overflow-x-auto space-x-4">
                        {groupedOrders[expandedDairy].orders
                            .filter((order) => order.status === "Completed")
                            .map((order) => (
                                <OrderCard key={order._id} order={order} />
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const OrderCard = ({ order }) => (
    <div className="min-w-[280px] p-5 bg-gradient-to-br from-blue-100 to-blue-300 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <p className="text-gray-800 font-semibold mb-1">
            📅 <span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}
        </p>
        <p className="text-gray-900 font-bold text-lg mb-1">📦 {order.orderType}</p>
        <p className="text-gray-800 mb-1">🔢 Quantity: {order.quantity}</p>
        <p className="text-gray-800 mb-1">💰 Amount: ₹{order.rate}</p>
        <p className="text-gray-800 mb-1">🚛 Truck No: {order.truckNo}</p>
        <p className="text-gray-800 mb-1">📱 Driver: {order.driverMobNo}</p>
        <p className="text-green-700 font-semibold mt-2">✅ {order.status}</p>
    </div>
);

export default CompletedOrders;
