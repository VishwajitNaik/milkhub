"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import OrderDetailsModal from "@/app/components/Models/OrderDetailsModal";
import Link from "next/link";

const DisplayDairiesWithOrders = () => {
    const [dairies, setDairies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [expandedDairy, setExpandedDairy] = useState(null);

    useEffect(() => {
        const fetchDairies = async () => {
            try {
                const response = await axios.get("/api/sangh/AllOrders");
                const orders = response.data.data?.orders || [];
                setDairies(orders);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching dairies and orders:", error.message);
                setError("Error fetching dairies and orders");
                setLoading(false);
            }
        };
        fetchDairies();
    }, []);

    const handleSendButtonClick = (orderId) => {
        setSelectedOrderId(orderId);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async ({ truckNo, driverMobNo }) => {
        try {
            await axios.post("/api/sangh/orderAcptStatus", {
                orderId: selectedOrderId,
                truckNo,
                driverMobNo,
            });
            await handleOrderAccept(selectedOrderId);
            alert("Order details sent and accepted successfully!");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error processing order:", error.message);
            alert("Failed to process order");
        }
    };

    const handleOrderAccept = async (orderId) => {
        try {
            await axios.patch("/api/sangh/patchOrders", { orderId });
            setDairies((prevDairies) =>
                prevDairies.map((dairy) => ({
                    ...dairy,
                    orders: Array.isArray(dairy.orders)
                        ? dairy.orders.map((order) =>
                              order._id === orderId ? { ...order, status: "Accepted" } : order
                          )
                        : [],
                }))
            );
        } catch (error) {
            console.error("Error accepting order:", error.message);
            throw new Error("Failed to accept order");
        }
    };

    const calculateProgress = (status) => {
        switch (status) {
            case "Completed":
                return 100;
            case "Accepted":
                return 50;
            case "Order Placed":
            case "Pending":
            default:
                return 0;
        }
    };

    const groupedOrders = dairies.reduce((acc, order) => {
        const { dairyName, orderType, quantity, _id, status, rate, createdAt } = order;
        if (!acc[dairyName]) acc[dairyName] = { orders: [], dairyName };

        acc[dairyName].orders.push({ orderType, quantity, _id, status, rate, createdAt });
        return acc;
    }, {});

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="flex flex-col w-full items-center min-h-screen bg-gray-300 p-4 gradient-bg">
            <h1 className="text-3xl font-bold mb-8 text-gray-700">Dairies and Their Orders</h1>
            <div className="flex flex-row w-full justify-center space-x-4 mb-6">
                <Link href="/home/AllDairies/Orders/AcceptedOrders">
                    <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                        Check Accepted Orders
                    </button>
                </Link>
                <Link href="/home/AllDairies/Orders/CompletedOrders">
                    <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                        Check Completed Orders
                    </button>
                </Link>
            </div>
            
            {/* Dairy Names in Horizontal Row */}
{/* Dairy Names with Pending Order Count */}
<div className="flex flex-row w-full overflow-x-auto pb-4 space-x-4 mt-12">
    {Object.values(groupedOrders).map((dairy) => {
        const pendingOrders = dairy.orders.filter(order => order.status === "Pending");

        return (
            <button
                key={dairy.dairyName}
                className={`relative px-6 py-3 mt-10 rounded-lg font-semibold ${
                    expandedDairy === dairy.dairyName
                        ? "bg-green-500 text-white"
                        : "bg-white text-gray-800 hover:bg-gray-100"
                }`}
                onClick={() =>
                    setExpandedDairy(
                        expandedDairy === dairy.dairyName ? null : dairy.dairyName
                    )
                }
            >
                {dairy.dairyName}

                {/* ✅ Pending Orders Badge */}
                {pendingOrders.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {pendingOrders.length}
                    </span>
                )}
            </button>
        );
    })}
</div>

            
            {/* Expanded Dairy Orders (Horizontal Layout) */}
            {expandedDairy && groupedOrders[expandedDairy] && (
                <div className="w-full bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">{expandedDairy} - Pending Orders</h2>
                    <div className="flex flex-row overflow-x-auto pb-4 space-x-4">
                        {groupedOrders[expandedDairy].orders
                            .filter((order) => order.status === "Pending")
                            .map((order) => (
                                <OrderComponent
                                    key={order._id}
                                    order={order}
                                    onAccept={handleOrderAccept}
                                    onSend={handleSendButtonClick}
                                    calculateProgress={calculateProgress}
                                />
                            ))}
                    </div>
                </div>
            )}

            <OrderDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
            />
        </div>
    );
};

const OrderComponent = ({ order, onAccept, onSend, calculateProgress }) => (
    <div className="min-w-[280px] p-4 bg-blue-100 rounded-lg border border-blue-300 flex-shrink-0">
        <p className="text-black font-bold">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
        <p className="text-black font-bold">Order Type: {order.orderType}</p>
        <p className="text-black">Quantity: {order.quantity}</p>
        <p className="text-black">Total Amount: {order.rate}</p>

        {order.status !== "Completed" && (
            <button
                className={`${
                    order.status === "Accepted"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600"
                } text-white font-bold py-2 px-4 rounded mt-2 w-full`}
                onClick={() => onSend(order._id)}
                disabled={order.status === "Accepted"}
            >
                {order.status === "Accepted" ? "Order Accepted" : "Accept Order"}
            </button>
        )}

        <div className="relative pt-1 mt-4">
            <div className="flex mb-2 items-center justify-between">
                <span className="text-xs font-semibold inline-block text-teal-600 uppercase px-2 py-1 rounded-full">
                    {calculateProgress(order.status)}%
                </span>
            </div>
            <div className="flex h-2 mb-2 overflow-hidden text-xs bg-gray-200 rounded">
                <div
                    style={{ width: `${calculateProgress(order.status)}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-600"
                />
            </div>
        </div>
    </div>
);

export default DisplayDairiesWithOrders;