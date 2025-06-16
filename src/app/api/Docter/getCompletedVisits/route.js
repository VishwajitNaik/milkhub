import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import DocterVisit from "@/models/GetDocterVisit";
import Owner from "@/models/ownerModel";
import { getDataFromToken } from "@/helpers/getSanghFormToken";

connect();

export async function GET(request) {
  try {
    const sanghId = await getDataFromToken(request);
    if (!sanghId) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const startDate = request.nextUrl.searchParams.get("startDate");
    const endDate = request.nextUrl.searchParams.get("endDate");
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Start date and end date are required" },
        { status: 400 }
      );
    }

    // Get all owners under the sangh
    const owners = await Owner.find({ sangh: sanghId }).select("_id ownerName dairyName");
    if (!owners || owners.length === 0) {
      return NextResponse.json({ error: "No owners found for this Sangh" }, { status: 404 });
    }

    const ownerIds = owners.map((owner) => owner._id);
    console.log("Owner IDs:", ownerIds);
    

    // Fetch completed visits for all owners
    const completedVisits = await DocterVisit.find({
      createdBy: { $in: ownerIds },
      status: "completed",
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).populate({
      path: "createdBy",
      select: "registerNo ownerName"
    }).lean();

    if (!completedVisits || completedVisits.length === 0) {
      return NextResponse.json({ message: "No completed visits found" }, { status: 404 });
    }

    const totalEarnings = completedVisits.reduce((total, visit) => {
      return total + (visit.visitRate || 0);
    }, 0);

    return NextResponse.json({ data: completedVisits, totalEarnings }, { status: 200 });

  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
