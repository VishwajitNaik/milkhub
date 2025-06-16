import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Animal from "@/models/AnimalDetails";
import User from "@/models/userModel";
import Owner from "@/models/ownerModel";
import Doctor from "@/models/AddDocter"; // 🩺 Make sure this is imported
import { getDataFromToken } from "@/helpers/getDataFromDrToken";

connect();

export async function GET(request) {
    try {
        const DrId = await getDataFromToken(request);
        if (!DrId) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const doctor = await Doctor.findById(DrId).select('sangh');
        if (!doctor) {
            return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
        }

        const owners = await Owner.find({ sangh: doctor.sangh });
        if (!owners.length) {
            return NextResponse.json({ error: "No owners found for this sangh" }, { status: 404 });
        }

        const ownerIds = owners.map(owner => owner._id);
        const users = await User.find({ createdBy: { $in: ownerIds } });
        if (!users.length) {
            return NextResponse.json({ error: "No users found for these owners" }, { status: 404 });
        }

        const userIds = users.map(user => user._id);
        const animalDetails = await Animal.find({ createdBy: { $in: userIds }, require: true })
            .populate({ path: 'createdBy', select: 'dairyName' });

        if (!animalDetails.length) {
            return NextResponse.json({ message: "No animal records found." }, { status: 404 });
        }

        return NextResponse.json({ data: animalDetails }, { status: 200 });

    } catch (error) {
        console.error("Error fetching animal details:", error);
        return NextResponse.json(
            { error: "Failed to fetch animal details", details: error.message },
            { status: 500 }
        );
    }
}
