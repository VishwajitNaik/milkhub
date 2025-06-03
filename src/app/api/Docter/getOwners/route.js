import { getDataFromToken } from "@/helpers/getDataFromDrToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Owner from "@/models/ownerModel";
import Doctor from "@/models/AddDocter";

connect();

export async function GET(request) {
    try {
        // Verify doctor token and get doctor ID
        const doctorId = await getDataFromToken(request);
        if (!doctorId) {
            return NextResponse.json(
                { error: "Unauthorized access" },
                { status: 401 }
            );
        }

        // Get doctor's details including sangh reference
        const doctor = await Doctor.findById(doctorId).select('sangh');
        if (!doctor) {
            return NextResponse.json(
                { error: "Doctor not found" },
                { status: 404 }
            );
        }

        // Find all owners with the same sangh as the doctor
        const owners = await Owner.find({ sangh: doctor.sangh })
            .select('-password -verifyToken -verifyTokenExpiry'); // Exclude sensitive fields

        return NextResponse.json({
            success: true,
            data: owners
        });

    } catch (error) {
        console.error("Failed to fetch owners:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}