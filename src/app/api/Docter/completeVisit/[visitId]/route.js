import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import DocterVisit from "@/models/GetDocterVisit";
import { getDataFromToken } from "@/helpers/getDataFromDrToken";

connect();

export async function POST(request, { params }) {
    try {
        const { visitId } = params;
        console.log("visitId: -", visitId);
        
        const requestData = await request.json();
        const doctorId = await getDataFromToken(request);

        if (!doctorId) {
            return NextResponse.json(
                { error: "Unauthorized access" },
                { status: 401 }
            );
        }

        // Validate required fields
        if (!requestData.diseasesOccurred || !requestData.treatmentFollowed) {
            return NextResponse.json(
                { error: "Required fields are missing" },
                { status: 400 }
            );
        }

        // Validate visit exists
        const visit = await DocterVisit.findById(visitId);
        if (!visit) {
            return NextResponse.json(
                { error: "Visit not found" },
                { status: 404 }
            );
        }

        // Update visit with completion data
        const updatedVisit = await DocterVisit.findByIdAndUpdate(
            visitId,
            {
                status: "completed",
                completedAt: new Date(),
                diseasesOccurred: requestData.diseasesOccurred,
                treatmentFollowed: requestData.treatmentFollowed,
                medicinesUsed: requestData.medicinesUsed || [],
                visitType: requestData.visitType,          // ✅ Add this
                visitRate: requestData.visitRate, 
                completedBy: doctorId
            },
            { new: true }
        );

        console.log("Updated Visit:", updatedVisit);
        

        return NextResponse.json({
            success: true,
            message: "Visit completed successfully",
            data: {
                id: updatedVisit._id,
                status: updatedVisit.status,
                completedAt: updatedVisit.completedAt
            }
        });

    } catch (error) {
        console.error("Error completing visit:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}