import moment from 'moment';
import { connect } from "@/dbconfig/dbconfig";
import MakeMilk from "@/models/MakeMilk";

export async function GET(req) {
    try {
        await connect();

        const { searchParams } = new URL(req.url);
        const session = searchParams.get("session");
        const milkType = searchParams.get("milkType");
        const date = searchParams.get("date"); // ISO string

        const currentDate = new Date(date);
        const dayStart = moment(currentDate).startOf("day").toDate();
        const dayEnd = moment(currentDate).endOf("day").toDate();

        const count = await MakeMilk.countDocuments({
            session,
            milkType,
            date: { $gte: dayStart, $lte: dayEnd },
        });

        const sampleNo = count + 1;
        console.log("Auto-generated Sample No:", sampleNo);
        

        return Response.json({ data:sampleNo });
    } catch (err) {
        return Response.json({ error: "Failed to get sampleNo" }, { status: 500 });
    }
}
