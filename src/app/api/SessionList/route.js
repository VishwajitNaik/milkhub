import { getDataFromToken } from "../../../helpers/getDataFromToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Owner from "@/models/ownerModel";
import Milk from "@/models/MilkModel";

connect();

export async function GET(request) {
    try {
        // Get the owner ID from the token
        const ownerId = await getDataFromToken(request);
        if (!ownerId) {
            return NextResponse.json({ error: "Owner ID not found in token" }, { status: 400 });
        }

        // Find the owner and their users
        const owner = await Owner.findById(ownerId).populate('users');
        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        // Use server's local time
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // Determine the session
        let currentSession = null;

        if (currentHour >= 6 && currentHour < 12) {
            currentSession = "morning";
        } else if (currentHour >= 13 && currentHour < 21) {
            currentSession = "evening";
        } else {
            return NextResponse.json(
                { error: "Milk can only be taken between 6AM–12PM (Morning) or 1PM–9PM (Evening)." },
                { status: 403 }
            );
        }

        // Create today's date range
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

        // Find all milk records for today and session
        const allMilkRecords = await Milk.find({
            createdBy: { $in: owner.users.map(user => user._id) },
            date: { $gte: startOfDay, $lte: endOfDay },
            session: currentSession
        });

        // Get user IDs who already took milk
        const takenMilkUserIds = new Set(allMilkRecords.map(record => record.createdBy.toString()));

        // Filter users who have not taken milk
        const filteredUsers = owner.users
            .filter(user => !takenMilkUserIds.has(user._id.toString()))
            .sort((a, b) => a.registerNo - b.registerNo); // Sort by registerNo ascending

        return NextResponse.json({ data: filteredUsers }, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch users:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
