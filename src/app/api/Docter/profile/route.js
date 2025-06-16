import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Docter from "@/models/AddDocter";
import { getDataFromToken } from "@/helpers/getDataFromDrToken";


connect();

export async function GET(request) {
    try {
        const docterId = await getDataFromToken(request);

        const docter = await Docter.findById(docterId);
        if (!docter) {
            return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
        }
        const { password, ...docterProfile } = docter._doc; // Exclude password from the response
        return NextResponse.json({ data: docterProfile }, { status: 200 });
    } catch (error) {
        console.error("Error fetching doctor profile:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        
    }
}