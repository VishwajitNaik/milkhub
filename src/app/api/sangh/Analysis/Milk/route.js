import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import { getDataFromToken } from "@/helpers/getSanghFormToken";
import Milk from "@/models/MakeMilk";
import Owner from "@/models/ownerModel";
import * as d3 from "d3";

connect();

export async function GET(request) {
    try {
        const sanghId = await getDataFromToken(request);

        if (!sanghId) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        let owners = [];

        owners = await Owner.find({ sangh: sanghId });
        const ownerIds = owners.map((owner) => owner._id);
try {
    owners = await Owner.find({ sangh: sanghId });
} catch (err) {
    console.error("❌ DB fetch error for owners:", err);
    return NextResponse.json({ error: "Database fetch failed" }, { status: 500 });
}
        

        const { searchParams } = new URL(request.url);
        const filter = searchParams.get("filter") || "daily";

        const milkRecords = await Milk.find({ createdBy: { $in: ownerIds } }).lean();

        // Separate cow and buff records
        const cowRecords = milkRecords.filter((record) => record.milkType === "cow");
        const buffRecords = milkRecords.filter((record) => record.milkType === "buff");
   

        let groupFunction;
        if (filter === "daily") {
            groupFunction = (d) => d3.timeFormat("%Y-%m-%d")(new Date(d.date));
        } else if (filter === "weekly") {
            groupFunction = (d) => d3.timeFormat("%Y-%W")(new Date(d.date)); // Week of the year
        } else if (filter === "monthly") {
            groupFunction = (d) => d3.timeFormat("%Y-%m")(new Date(d.date));
        } else if (filter === "yearly") {
            groupFunction = (d) => d3.timeFormat("%Y")(new Date(d.date));
        }

        // Group data separately for cow and buff
        const groupedCowData = d3.groups(cowRecords, groupFunction);
        const groupedBuffData = d3.groups(buffRecords, groupFunction);
        // Function to compute trend data
        const computeTrendData = (groupedData) => {
            let trendData = [];

            groupedData.forEach(([period, records], index) => {
                const totalLiters = d3.sum(records, (d) => d.milkLiter);
                const totalAmount = d3.sum(records, (d) => d.amount);

                let growthRateLiters = 0;
                let growthRateAmount = 0;

                if (index > 0) {
                    const prev = trendData[index - 1];
                    growthRateLiters = ((totalLiters - prev.totalLiters) / prev.totalLiters) * 100;
                    growthRateAmount = ((totalAmount - prev.totalAmount) / prev.totalAmount) * 100;
                }

                trendData.push({
                    period,
                    totalLiters,
                    totalAmount,
                    growthRateLiters: index > 0 ? growthRateLiters.toFixed(2) : null,
                    growthRateAmount: index > 0 ? growthRateAmount.toFixed(2) : null,
                });
            });

            return trendData;
        };

        // Compute trend data separately
        const cowTrendData = computeTrendData(groupedCowData);
        const buffTrendData = computeTrendData(groupedBuffData);

        return NextResponse.json({ cowTrendData, buffTrendData }, { status: 200 });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
