import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import DocterVisit from "@/models/GetDocterVisit";
import Owner from "@/models/ownerModel";
import { getDataFromToken } from "@/helpers/getSanghFormToken";

connect();

export async function GET(request) {
    try {
        await connect();

        const url = new URL(request.url);
        const ownerId = url.pathname.split("/").pop(); // Get owner ID from the URL

        if (!ownerId) {
            return NextResponse.json({ error: "Owner ID is required" }, { status: 400 });
        }
        
        const sanghId = await getDataFromToken(request);
        if (!sanghId) {
            return NextResponse.json({ error: "Invalid or missing token" }, { status: 401 });
        }

        const owner = await Owner.findOne({ sangh: sanghId });
        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 444 });
        }

        // Get today's date at midnight (start of day)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Get tomorrow's date at midnight (end of today)
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const visits = await DocterVisit.find({ 
            createdBy: owner._id,
            date: {
                $gte: today,  // Greater than or equal to today's midnight
                $lt: tomorrow // Less than tomorrow's midnight
            }
        }).populate({ path: "createdBy", select: "dairyName" });

        if (!visits || visits.length === 0) {
            return NextResponse.json({ 
                message: "No visits found for today.",
                data: [] 
            }, { status: 200 });
        }

        const visitsWithDairyName = visits.map(visit => ({
            ...visit._doc,
            dairyName: visit.createdBy?.dairyName || "Unknown Dairy",
        }));

        return NextResponse.json({ data: visitsWithDairyName }, { status: 200 });
    } catch (error) {
        console.error("Error fetching doctor visits:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}