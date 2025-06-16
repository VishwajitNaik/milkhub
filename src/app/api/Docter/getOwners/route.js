import { getDataFromToken } from "@/helpers/getDataFromDrToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Address from "@/models/AddAddress";
import Owner from "@/models/ownerModel";
import Doctor from "@/models/AddDocter";
import GetDocterVisit from "@/models/GetDocterVisit";

connect();

export async function GET(request) {
  try {
    const doctorId = await getDataFromToken(request);
    if (!doctorId) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const doctor = await Doctor.findById(doctorId).select("sangh");
    if (!doctor) {
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 404 }
      );
    }

    const owners = await Owner.find({ sangh: doctor.sangh }).select(
      "-password -verifyToken -verifyTokenExpiry"
    );

    if (!owners || owners.length === 0) {
      return NextResponse.json(
        { error: "No owners found for this sangh" },
        { status: 404 }
      );
    }

    const ownerIds = owners.map((owner) => owner._id);

    const addresses = await Address.find({
      createdBy: { $in: ownerIds },
    });

    // === Today's date range ===
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    

const visitCounts = await GetDocterVisit.aggregate([
  {
    $match: {
      createdBy: { $in: ownerIds },
      date: {
        $gte: todayStart,
        $lte: todayEnd,
      },
      status: "Pending", // ✅ filter by status if needed
    },
  },
  {
    $group: {
      _id: "$createdBy",  // ✅ use createdBy instead of ownerId
      visitCount: { $sum: 1 },
    },
  },
]);

    console.log("Visit Counts:", visitCounts);
    

const visitCountMap = visitCounts.reduce((acc, visit) => {
  acc[visit._id.toString()] = visit.visitCount;
  return acc;
}, {});


    return NextResponse.json({
      success: true,
      data: owners,
      addresses: addresses.reduce((acc, address) => {
        acc[address.createdBy.toString()] = address;
        return acc;
      }, {}),
      visitCounts: visitCountMap, // Could be empty — handle on frontend
    });
  } catch (error) {
    console.error("Failed to fetch owners:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
