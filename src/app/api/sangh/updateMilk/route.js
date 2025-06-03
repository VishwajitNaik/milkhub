import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Milk from '@/models/MakeMilk';
import Owner from '@/models/ownerModel';
import { getDataFromToken } from '@/helpers/getSanghFormToken';
import { setValue } from "@/dbconfig/redis"; // Adjust the path if needed

export async function PUT(req) {
    await connect();

    try {
        const sanghId = await getDataFromToken(req);
        const {
            registerNo,
            session,
            quality,
            milkType,
            date,
            milkKG,
            milkLiter,
            smelLiter,
            fat,
            snf,
            rate,
            amount,
            senedCen,
            acceptedCen,
            smeledCen,
            bhesalType,
            precotion
        } = await req.json();

        // Validate required fields
        if (
            !registerNo || !session || !quality || !date ||
            !milkKG || !milkLiter || !smelLiter || !fat || !snf ||
            !rate || !amount || !senedCen || !acceptedCen || !smeledCen ||
            !bhesalType || !precotion
        ) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Find the owner
        const owner = await Owner.findOne({ registerNo, sangh: sanghId });
        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        // Normalize date to match records in DB
        const currentDate = new Date(date);
        currentDate.setUTCHours(0, 0, 0, 0);

        // Find the milk record
        let milkRecord = await Milk.findOne({
            createdBy: owner._id,
            session,
            milkType, // Ensure milkType is included in the search
            date: currentDate
        });

        // If not found, return message
        if (!milkRecord) {
            return NextResponse.json({
                message: "Milk record for this session and date is not available.",
                alert: "Milk record for this session and date is not available.",
                data: milkRecord,
            });
        }

        // Update the milk record
        const updatedRecord = await Milk.findOneAndUpdate(
            {
                createdBy: owner._id,
                session,
                milkType, // Ensure milkType is included in the update
                date: currentDate
            },
            {
                quality,
                milkKG,
                milkLiter,
                smelLiter,
                fat,
                snf,
                rate,
                amount,
                senedCen,
                acceptedCen,
                smeledCen,
                bhesalType,
                precotion
            },
            { new: true }
        );

        console.log('Updated Milk Record:', updatedRecord);
        

        if (!updatedRecord) {
            return NextResponse.json({ message: 'Milk record not found' }, { status: 404 });
        }

        // Update Redis cache
const normalizedDate = new Date(currentDate).toISOString().split("T")[0];
const cacheKey = `milk:${registerNo}:${session}:${milkType}:${normalizedDate}`;
        await setValue(cacheKey, JSON.stringify(updatedRecord));

        return NextResponse.json({
            message: 'Milk record updated',
            record: updatedRecord
        });

    } catch (error) {
        console.error('Error in PUT /api/sangh/updateMilk:', error);
        return NextResponse.json(
            { error: 'Failed to update milk record', details: error.message },
            { status: 500 }
        );
    }
}
