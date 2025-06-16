import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import VisitTypes from '@/models/VisitTypes';
import Sangh from '@/models/SanghModel';
import { getDataFromToken } from '@/helpers/getSanghFormToken';
connect();

export async function POST(request) {
    try {
        const SanghId = await getDataFromToken(request);
        const reqBody = await request.json();

        const { visitType, visitCode, visitRate } = reqBody;

        if (!visitType || !visitCode || !visitRate) {
            return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 });
        }

        const sangh = await Sangh.findById(SanghId);
        if (!sangh) {
            return NextResponse.json({ error: "Sangh not found" }, { status: 404 });
        }
        // Check if visitCode already exists for the Sangh
        const existingVisitType = await VisitTypes.findOne({ visitCode, createdBy: SanghId });
        if (existingVisitType) {
            return NextResponse.json({ error: "Visit Code already exists for this Sangh" }, { status: 400 });
        }
        // Check if visitType already exists for the Sangh
        const existingVisitTypeName = await VisitTypes.findOne({ visitType, createdBy: SanghId });
        if (existingVisitTypeName) {
            return NextResponse.json({ error: "Visit Type already exists for this Sangh" }, { status: 400 });
        }
        const newVisitType = new VisitTypes({
            visitType,
            visitCode,
            visitRate,
            createdBy: SanghId,
        });
        const savedVisitType = await newVisitType.save();
        sangh.VisitTypes.push(savedVisitType._id);
        await sangh.save();
        return NextResponse.json({ 
            message: "Visit Type added successfully",
            data: savedVisitType
        }, { status: 200 });

    } catch (error) {
        console.error("Error adding Visit Type:", error);
        return NextResponse.json({ error: "Failed to add Visit Type" }, { status: 500 });
    }
}