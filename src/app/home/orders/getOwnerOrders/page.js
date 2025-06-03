"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import CompleteOrderButton from '../../../components/CompleteOrderButton.js';
import Loading from '../../../components/Loading/Loading';

const DisplayOrders = () => {
    const [orders, setOrders] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [filter, setFilter] = useState("Pending");
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('/api/owner/GetOreders');
                setOrders(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching orders:", error.message);
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const calculateProgress = (order) => {
        if (order.status === 'Completed') return 100;
        let progress = 0;
        if (order.status === 'Accepted') progress += 30;
        if (order.truckNo && order.driverMobNo) progress += 30;
        return progress;
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    const filteredOrders = orders.filter((order) => {
        if (filter === "Pending") return order.status === "Pending";
        if (filter === "Accepted") return order.status === "Accepted";
        if (filter === "Completed") return order.status === "Completed";
        return true;
    });

    if (loading) {
        return <div className="text-center"><Loading /></div>;
    }

    return (
        <div className="banner flex flex-col items-center bg-gray-100">
            <video autoPlay loop muted className="opacity-50">
                <source src="/assets/milk.mp4" type="video/mp4" /> 
            </video>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-white shadow-md z-10 shadow-black bg-slate-600 p-2 rounded-lg">
                Order List
            </h1>
            
            {/* Filter Buttons - Responsive */}
            <div className="z-10 flex flex-wrap justify-center gap-2 mb-6 md:mb-8">
                {["Pending", "Accepted", "Completed"].map((filterOption) => (
                    <button 
                        key={filterOption}
                        onClick={() => handleFilterChange(filterOption)} 
                        className={`px-3 py-1 md:px-4 md:py-2 rounded-lg text-sm md:text-base ${
                            filter === filterOption ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                        }`}
                    >
                        {filterOption} Orders
                    </button>
                ))}
            </div>

            {/* Orders Display */}
            {isMobile ? (
                // Mobile View - Horizontal Scroll
                <div className="w-full px-4 z-20">
                    <div className="flex overflow-x-auto pb-4 space-x-4">
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order, index) => {
                                const progress = calculateProgress(order);
                                return (
                                    <div key={index} className="flex-shrink-0 w-64 bg-white shadow-md rounded-lg p-4">
                                        <div className='flex flex-row items-right justify-between'> 
                                        <h2 className="text-lg font-bold text-gray-800 truncate">{order.orderType}</h2>
                                        <p className="text-sm text-gray-600 mt-1"><span className="font-medium">Qty:</span> {order.quantity}</p>
                                        </div>

                                        <p className="text-sm text-gray-600 truncate">
                                            <span className="font-medium">Truck:</span> {order.truckNo || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-600 truncate">
                                            <span className="font-medium">Driver Mobile:</span> {order.driverMobNo || 'N/A'}
                                        </p>
                                        <div className="mt-2">
                                            <div className="flex justify-between text-xs text-teal-600 mb-1">
                                                <span>Progress</span>
                                                <span>{progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    style={{ width: `${progress}%` }}
                                                    className="bg-teal-600 h-full rounded-full"
                                                />
                                            </div>
                                        </div>
                                        {order.status === "Accepted" && (
                                            <div className="mt-3">
                                                <CompleteOrderButton orderId={order._id} size="small" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-gray-600 text-center w-full">No orders found</div>
                        )}
                    </div>
                </div>
            ) : (
                // Desktop View - Grid Layout
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-6xl z-50 px-4">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order, index) => {
                            const progress = calculateProgress(order);
                            return (
                                <div key={index} className="bg-blue-200 shadow-md rounded-lg p-4">
                                    <h2 className="text-lg font-bold text-gray-800 mb-1">{order.orderType}</h2>
                                    <p className=" text-gray-600"><span className="font-medium">Quantity:</span> {order.quantity}</p>
                                    <p className=" text-gray-600 truncate">
                                        <span className="font-medium">Truck:</span> {order.truckNo || 'Not assigned'}
                                    </p>
                                    <p className=" text-gray-600 truncate">
                                        <span className="font-medium">Driver:</span> {order.driverMobNo || 'Not assigned'}
                                    </p>
                                    <div className="mt-2">
                                        <div className="flex justify-between text-xs text-teal-600 mb-1">
                                            <span>Progress</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                style={{ width: `${progress}%` }}
                                                className="bg-teal-600 h-full rounded-full"
                                            />
                                        </div>
                                    </div>
                                    {order.status === "Accepted" && (
                                        <div className="mt-3">
                                            <CompleteOrderButton orderId={order._id} />
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-gray-600 text-center col-span-full">No orders found in this category.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DisplayOrders;