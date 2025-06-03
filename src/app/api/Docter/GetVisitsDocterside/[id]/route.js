import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import DocterVisit from "@/models/GetDocterVisit";
import Owner from "@/models/ownerModel";
import Doctor from "@/models/AddDocter"; // Added missing import
import { getDataFromToken } from "@/helpers/getDataFromDrToken";

export async function GET(request) {
    try {
        await connect();
        
        const url = new URL(request.url);
        const ownerId = url.pathname.split("/").pop(); // Get owner ID from the URL

        if (!ownerId) {
            return NextResponse.json({ error: "Owner ID is required" }, { status: 400 });
        }
        const doctorId = await getDataFromToken(request);
        if (!doctorId) {
            return NextResponse.json(
                { error: "Unauthorized access" },
                { status: 401 }
            );
        }

        console.log("Doctor ID from token:", doctorId);
        

        // Get doctor's details including sangh reference
        const doctor = await Doctor.findById(doctorId).select('sangh');
        if (!doctor) {
            return NextResponse.json(
                { error: "Doctor not found" },
                { status: 404 }
            );
        }

        // Find owner that belongs to same sangh AND matches the ownerId
        const owner = await Owner.findOne({ 
            _id: ownerId,
            sangh: doctor.sangh 
        });
        
        if (!owner) {
            return NextResponse.json(
                { error: "Owner not found or not in your sangh" },
                { status: 404 }
            );
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const visits = await DocterVisit.find({
            createdBy: owner._id,
            date: {
                $gte: today,
                $lt: tomorrow
            },
            status: { $in: ["Pending", "Accepted"] } // Only fetch pending or accepted visits
        }).populate({ 
            path: "createdBy", 
            select: "dairyName ownerName" // Added ownerName for more context
        }).lean(); // Using lean() for better performance

        if (!visits || visits.length === 0) {
            return NextResponse.json({
                message: "No visits found for today.",
                data: []
            }, { status: 200 });
        }

        // Format response data
        const formattedVisits = visits.map(visit => ({
            ...visit,
            dairyName: visit.createdBy?.dairyName || "Unknown Dairy",
            ownerName: visit.createdBy?.ownerName || "Unknown Owner"
        }));

        return NextResponse.json({ 
            success: true,
            data: formattedVisits 
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching doctor visits:", error);
        return NextResponse.json(
            { 
                error: "Internal server error",
                details: process.env.NODE_ENV === "development" ? error.message : undefined
            }, 
            { status: 500 }
        );
    }
}

