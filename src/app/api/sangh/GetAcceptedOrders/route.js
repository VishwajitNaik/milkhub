import { getDataFromToken } from "@/helpers/getSanghFormToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Orders from "@/models/OwnerOrders";
import Owner from "@/models/ownerModel";

connect();

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const ownerId = searchParams.get("ownerId"); // ✅ Get ownerId from query

        const SanghId = await getDataFromToken(request);
        if (!SanghId) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        if (!ownerId) {
            return NextResponse.json({ error: "Missing ownerId" }, { status: 400 });
        }

        // ✅ Find specific owner by ID and verify it belongs to the Sangh
        const owner = await Owner.findById(ownerId);
        if (!owner || owner.sangh.toString() !== SanghId) {
            return NextResponse.json({ error: "Owner not found or unauthorized" }, { status: 404 });
        }

        // Fetch Accepted Orders
        const AcceptedOrders = await Orders.find({
            createdBy: owner._id,
            status: { $in: ["Accepted", "Completed"] },
        }).sort({ createdAt: 1 });

        const totalAmount = AcceptedOrders.reduce((acc, order) => acc + (order.rate || 0), 0);

        return NextResponse.json(
            { data: AcceptedOrders, totalAmount },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching AcceptedOrders:", error.message);
        return NextResponse.json(
            { error: "Error fetching AcceptedOrders", details: error.message },
            { status: 500 }
        );
    }
}
