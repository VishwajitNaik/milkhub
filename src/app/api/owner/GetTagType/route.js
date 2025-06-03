import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextResponse } from "next/server";
import { connect } from "../../../../dbconfig/dbconfig.js";
import Owner from "@/models/ownerModel.js";
import TagType from "@/models/TagType";
import mongoose from "mongoose";

connect();

export async function GET(req) {
    try {
        
        const ownerId = await getDataFromToken(req);
        const owner = await Owner.findById(ownerId);
        if (!ownerId) {
            return NextResponse.json({ error: 'Invalid or missing token' }, { status: 401 });
        }

        const sanghId = new mongoose.Types.ObjectId(owner.sangh); // Convert to Mongoose ObjectId
        const tagTypes = await TagType.find({ createdBy: sanghId });
        if (!tagTypes || tagTypes.length === 0) {
            return NextResponse.json({ message: "No Tag Types found" }, { status: 404 });
        }

        console.log("tagTypes", tagTypes);

        return NextResponse.json({
            message: "Tag Types fetched successfully",
            data: tagTypes
        });

    } catch (error) {
        console.error("Error fetching Tag Types:", error);
        return NextResponse.json({ error: "Error fetching Tag Types" }, { status: 500 });
    }
}