// /api/Docter/updateTagAnimal/[id].js
import { NextResponse } from "next/server";
import Animal from "@/models/AnimalDetails"; // adjust model path
import { connect } from "@/dbconfig/dbconfig";
import { getDataFromToken } from "@/helpers/getDataFromDrToken";

connect();

export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();
    const doctorId = await getDataFromToken(req);

    if (!doctorId) {
        return NextResponse.json(
            { error: "Unauthorized access" },
            { status: 401 }
        );
    }

  try {
    const updated = await Animal.findByIdAndUpdate(
      id,
      {
        tagId: body.tagId,
        tagStatus: body.tagStatus,
        require: body.require,
      },
      { new: true }
    );

    return NextResponse.json({ message: "Updated successfully", data: updated });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
