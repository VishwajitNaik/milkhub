// File: app/api/sangh/send-payment/route.js
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { beneId, amount, remarks = "Milk Payment", transferId } = body;

    console.log("Received payout request:", {
      beneId,
      amount,
      remarks,
      transferId
    });
    

    // Validation: make sure required fields are present
    if (!beneId || !amount || !transferId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const payload = {
      beneId,
      amount,
      transferId,
      transferMode: "banktransfer",
      remarks, // this is now always defined
    };

    const response = await axios.post(
      process.env.CASHFREE_PAYOUT_URL,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Id': process.env.CASHFREE_CLIENT_ID,
          'X-Client-Secret': process.env.CASHFREE_CLIENT_SECRET,
        },
      }
    );

    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    console.error("Cashfree payout error:", error.response?.data || error.message);
    return NextResponse.json({ error: "Cashfree payout failed" }, { status: 500 });
  }
}
