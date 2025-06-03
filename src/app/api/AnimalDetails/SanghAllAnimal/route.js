import { getDataFromToken } from "@/helpers/getSanghFormToken";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig.js";
import Owner from "@/models/ownerModel";
import User from "@/models/userModel";
import Animal from "@/models/AnimalDetails.js";

connect();

export async function POST(request) {
    try {
        const sanghId = getDataFromToken(request);
        if (!sanghId) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const owners = await Owner.find({ sangh: sanghId });
        if (!owners.length) {
            return NextResponse.json(
                { error: "No owners found for this sangh" },
                { status: 404 }
            );
        }

        const ownerIds = owners.map(owner => owner._id);
        const users = await User.find({ createdBy: { $in: ownerIds } });
        if (!users.length) {
            return NextResponse.json(
                { error: "No users found for these owners" },
                { status: 404 }
            );
        }

        const userIds = users.map(user => user._id);

        const animalDetails = await Animal.find({ createdBy: { $in: userIds } })
            .populate({
                path: "createdBy",
                select: "registerNo name village tahasil district createdBy",
                populate: {
                    path: "createdBy",
                    model: "Owner",
                    select: "dairyName"
                }
            });

        if (!animalDetails.length) {
            return NextResponse.json(
                { error: "No animal details found" },
                { status: 404 }
            );
        }

        // 7. Format the response data
        const responseData = animalDetails.map(animal => ({
            _id: animal._id,
            date: animal.date || null,
            village: animal.village || "N/A",
            tahasil: animal.tahasil || "N/A",
            district: animal.district || "N/A",
            dairyName: animal.dairyName || "N/A",
            username: animal.username || "N/A",
            species: animal.species || "N/A",
            animalGender: animal.animalGender || "N/A",
            tagStatus: animal.tagStatus || "untagged",
            tagType: animal.tagType || "N/A",
            tagId: animal.tagId || "N/A",
            breed: animal.breed || "N/A",
            age: animal.age || "N/A",
            purpose: animal.purpose || "N/A",
            quantityOfMilk: animal.quantityOfMilk || 0,
            runningMonth: animal.runningMonth || "N/A",
            healthStatus: animal.healthStatus || "healthy",
            typeOfDisease: animal.typeOfDisease || "None"
        }));


        return NextResponse.json({
            success: true,
            count: responseData.length,
            data: responseData
        });

    } catch (error) {
        console.error("Error in POST request:", error);
        return NextResponse.json(
            { error: "Failed to process request", details: error.message },
            { status: 500 }
        );
    }
}
