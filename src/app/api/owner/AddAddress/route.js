// app/api/address/add/route.js
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig.js";
import AddAddress from "@/models/AddAddress";
import Owner from "@/models/ownerModel";

connect();

export async function POST(request) {
    try {
        // Verify owner authentication
        const ownerId = getDataFromToken(request);
        if (!ownerId) {
            return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
        }

        const reqBody = await request.json();
        const { village, tahasil, district, PinCode } = reqBody;

        // Validate required fields
        if (!village || !tahasil || !district || !PinCode) {
            return NextResponse.json(
                { error: "All address fields are required" },
                { status: 400 }
            );
        }

        // Validate PIN code format
        if (!/^\d{6}$/.test(PinCode)) {
            return NextResponse.json(
                { error: "Invalid PIN code format (must be 6 digits)" },
                { status: 400 }
            );
        }

        // Create new address
        const newAddress = new AddAddress({
            village,
            tahasil,
            district,
            PinCode,
            createdBy: ownerId
        });

        const savedAddress = await newAddress.save();

        // Update owner's addresses array
        await Owner.findByIdAndUpdate(
            ownerId,
            { $push: { addresses: savedAddress._id } }
        );

        return NextResponse.json({
            success: true,
            message: "Address added successfully",
            address: savedAddress
        }, { status: 201 });

    } catch (error) {
        console.error("Address creation error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// GET endpoint to fetch addresses
export async function GET(request) {
    try {
        const ownerId = getDataFromToken(request);
        if (!ownerId) {
            return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
        }

        const addresses = await AddAddress.find({ createdBy: ownerId });
        
        return NextResponse.json({
            success: true,
            addresses
        });

    } catch (error) {
        console.error("Error fetching addresses:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}