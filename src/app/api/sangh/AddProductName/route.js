import { getDataFromToken } from "@/helpers/getSanghFormToken";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../dbconfig/dbconfig.js";
import Product from "@/models/ProductModel"

connect()

export async function POST(request) {
    try {
        
        const sanghId = await getDataFromToken(request);

        if (!sanghId) {
            return NextResponse.json({ error: 'Invalid or missing token' }, { status: 401 });
        }

        const reqBody = await request.json()
        const { ProductName, ProductNo, ProductRate } = reqBody;
        
        if (!ProductName || !ProductNo || !ProductRate) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if the product already exists
        const existingProduct = await Product.findOne({ ProductName, createdBy: sanghId });
        if (existingProduct) {
            return NextResponse.json({ error: "Product already exists" }, { status: 400 });
        }

        const newProduct = new Product({
            ProductName,
            ProductNo,
            ProductRate,
            createdBy: sanghId,
        });

        const savedProduct = await newProduct.save();

        return NextResponse.json({
            message: "Product Name added sucessfully",
            data: savedProduct
        });

    } catch (error) {
        console.error("Error to Add Product Name:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });    
    }
}