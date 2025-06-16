import { getDataFromToken } from "@/helpers/getSanghFormToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Product from "@/models/ProductModel";
import Owner from "@/models/ownerModel.js";

connect();

export async function GET(request) {
    try {
        const SanghId = await getDataFromToken(request);
        if (!SanghId) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }

        // Fetch all products/orders from the database
        const orders = await Product.find({ createdBy: SanghId }); // Fetch only ProductName field

        // Return the list of products/orders
        return NextResponse.json({ data: orders });


    } catch (error) {
        console.error("Failed to fetch Products:", error); // Log the error for debugging
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}