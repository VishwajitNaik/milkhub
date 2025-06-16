"use client";
import Script from 'next/script';
import React, { useState } from 'react';

const Page = () => {
    const [amount, setAmount] = useState(0);

    const handlePayment = async () => {
        const res = await fetch('/api/RaszorPay', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ amount }) // Convert to smallest currency unit in backend
        });

        const data = await res.json();

        if (!data.orderId) {
            alert("Failed to create order. Try again.");
            return;
        }

        const options = {
            key: data.key, // Razorpay key from backend
            amount: amount * 100, 
            currency: "INR",
            order_id: data.orderId, 
            handler: function (response) {
                alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
            },
            theme: {
                height: "50px", // Add a fixed height
            }
        };

        const payment = new window.Razorpay(options);
        payment.open();
    };

    return (
        <div className='gradient-bg flex flex-col min-h-screen'>
        <div className='flex items-center justify-center min-h-screen flex-col gap-4'>
            <Script type='text/javascript' src='https://checkout.razorpay.com/v1/checkout.js' strategy='afterInteractive'/>
            <h1 className='text-2xl font-bold'>RazorPay Payment</h1>
            <input 
                type="number"
                className='border-2 text-black border-gray-300 rounded-md p-2'
                placeholder='Enter amount'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={handlePayment} className='bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition duration-300'>
                Pay Now
            </button>
        </div>
        </div>
    );
};

export default Page;
