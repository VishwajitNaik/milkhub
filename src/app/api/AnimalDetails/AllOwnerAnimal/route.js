import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Animal from "@/models/AnimalDetails";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request) {
    try {
        const ownerId = getDataFromToken(request);

        if (!ownerId) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // 1. Get all users created by the owner
        const users = await User.find({ createdBy: ownerId });

        if (!users || users.length === 0) {
            return NextResponse.json(
                { error: "No users found for this owner" },
                { status: 404 }
            );
        }

        // 2. Get their IDs
        const userIds = users.map(user => user._id);

        // 3. Find all animal records where createdBy is in userIds
        const animalDetails = await Animal.find({ createdBy: { $in: userIds } })
            .populate("createdBy", "registerNo name")

        if (!animalDetails || animalDetails.length === 0) {
            return NextResponse.json(
                { error: "No animal details found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Animal details fetched successfully",
            data: animalDetails,
        });

    } catch (error) {
        console.error("Error fetching animal details:", error);
        return NextResponse.json(
            { error: "Failed to fetch animal details" },
            { status: 500 }
        );
    }
}
