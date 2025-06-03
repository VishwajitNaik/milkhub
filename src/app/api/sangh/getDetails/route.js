import { getDataFromToken } from "@/helpers/getSanghFormToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Sangh from "@/models/SanghModel";
connect();

export async function GET(request) {
    try {
        const sanghId = await getDataFromToken(request);
        if (!sanghId) {
            return NextResponse.json({ error: "Sangh ID not found in token" }, { status: 400 });
        }
        
        const sangh = await Sangh.findById(sanghId);
        if (!sangh) {
            return NextResponse.json({ error: "Sangh not found" }, { status: 404 });
        }
        return NextResponse.json({ data: sangh }, { status: 200 });

    } catch ( error ) {
        console.error("Error fetching sangh details:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
        
    }
}