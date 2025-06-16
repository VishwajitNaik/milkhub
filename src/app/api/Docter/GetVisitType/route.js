import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import VisitType from '@/models/VisitTypes';
import Doctor from '@/models/AddDocter';
import { getDataFromToken } from '@/helpers/getDataFromDrToken';

connect();

export async function GET(request) {
  try {
        const doctorId = await getDataFromToken(request);
        if (!doctorId) {
            return NextResponse.json(
                { error: "Unauthorized access" },
                { status: 401 }
            );
        }

        console.log("Doctor ID from token:", doctorId);

        // Get doctor's details including sangh reference
        const doctor = await Doctor.findById(doctorId).select('sangh');
        if (!doctor) {
            return NextResponse.json(
                { error: "Doctor not found" },
                { status: 404 }
            );
        }

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 403 });
    }

    const visitTypes = await VisitType.find({ createdBy: doctor.sangh }).sort({ createdAt: -1 });

    if (!visitTypes.length) {
      return NextResponse.json({ error: "No Visit Types found" }, { status: 404 });
    }

    return NextResponse.json({ data: visitTypes }, { status: 200 });

  } catch (error) {
    console.error("Error fetching Visit Types:", error);
    return NextResponse.json({ error: "Failed to fetch Visit Types" }, { status: 500 });
  }
}
