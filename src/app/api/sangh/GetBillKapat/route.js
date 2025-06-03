import { getDataFromToken } from "@/helpers/getSanghFormToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import BillKapat from "@/models/OwnerKapat";
import Owner from "@/models/ownerModel";

connect();

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const ownerId = searchParams.get("ownerId"); // ✅ Receive ownerId from frontend

        const SanghId = await getDataFromToken(request);
        if (!SanghId) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        if (!ownerId) {
            return NextResponse.json({ error: "Missing ownerId" }, { status: 400 });
        }

        // ✅ Find the specific owner
        const owner = await Owner.findById(ownerId).populate("ownerBillKapat");
        if (!owner || owner.sangh.toString() !== SanghId) {
            return NextResponse.json({ error: "Owner not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json(
            { data: owner.ownerBillKapat },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching BillKapat:", error.message);
        return NextResponse.json(
            { error: "Error fetching BillKapat", details: error.message },
            { status: 500 }
        );
    }
}
