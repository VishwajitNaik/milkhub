import { getDataFromToken } from "@/helpers/getDataFromDrToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Dr from "@/models/AddDocter";

connect();

export async function PUT(request) {
    try {
        const DrId = await getDataFromToken(request); // Retrieve the doctor ID from the token
        const updatedData = await request.json(); // Get updated data from request body

        const updatedDoctor = await Dr.findByIdAndUpdate(DrId, updatedData, { new: true });
        // Find the doctor by ID and update their information
        if (!updatedDoctor) {
            return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
            // If the doctor is not found, return a 404 error
        }
        return NextResponse.json({ data: updatedDoctor }, { status: 200 });

    } catch (error) {
        console.error("Failed to update doctor profile:", error); // Log the error for debugging
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}