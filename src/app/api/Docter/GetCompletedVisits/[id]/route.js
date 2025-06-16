import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import DocterVisit from '@/models/GetDocterVisit';
import Owner from '@/models/ownerModel';
import Doctor from '@/models/AddDocter'; // Added missing import
import { getDataFromToken } from '@/helpers/getDataFromDrToken';

connect();

export async function GET(request) {
    try {
        await connect();

        const url = new URL(request.url);
        const ownerId = url.pathname.split('/').pop(); // Get visit ID from the URL

        if (!ownerId) {
            return NextResponse.json({ error: 'Owner ID is required' }, { status: 400 });
        }

        const doctorId = await getDataFromToken(request);
        if (!doctorId) {
            return NextResponse.json(
                { error: 'Unauthorized access' },
                { status: 401 }
            );
        }
        console.log('Doctor ID from token:', doctorId);

        const doctor = await Doctor.findById(doctorId).select('sangh');
        if (!doctor) {
            return NextResponse.json(
                { error: 'Doctor not found' },
                { status: 404 }
            );
        }
        // Find owner that belongs to same sangh AND matches the ownerId
        const owner = await Owner.findOne({
            _id: ownerId,
            sangh: doctor.sangh
        });
        if (!owner) {
            return NextResponse.json(
                { error: 'Owner not found or not in your sangh' },
                { status: 404 }
            );
        }
        // const today = new Date();
        // today.setHours(0, 0, 0, 0);
        // const tomorrow = new Date(today);
        // tomorrow.setDate(tomorrow.getDate() + 1);

        const visits = await DocterVisit.find({
            createdBy: owner._id,
            status: 'completed'
        }).populate({
            path: "createdBy",
            select: "dairyName ownerName"
        }).lean();

//         const visits = await DocterVisit.find({
//     createdBy: owner._id,
//     date: {
//         $gte: today,
//         $lt: tomorrow
//     },
//     status: 'completed'
// })

        if (!visits || visits.length === 0) {
            return NextResponse.json(
                { message: 'No completed visits found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Completed visits fetched successfully',
            data: visits
        });

    } catch (error) {
        console.error("Error in GET request:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );

    }
}