import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Orders from "@/models/OwnerOrders";
import Owner from "@/models/ownerModel";
import { getDataFromToken } from "@/helpers/getSanghFormToken";

connect();

export async function GET(request) {
    try {
        // Get sangh ID from token
        const sanghId = await getDataFromToken(request);

        // Find all owners associated with this sangh
        const owners = await Owner.find({ sangh: sanghId }).select('_id dairyName');
        
        if (!owners || owners.length === 0) {
            return NextResponse.json({ error: "No owners found for this sangh" }, { status: 404 });
        }

        // Extract owner IDs
        const ownerIds = owners.map(owner => owner._id);

        // Fetch orders for all these owners and populate dairyName
        const orders = await Orders.find({ createdBy: { $in: ownerIds } })
            .populate({ 
                path: "createdBy", 
                select: "dairyName",
                model: Owner
            })
            .sort({ createdAt: -1 });

        // Get pending order counts per owner
        const pendingOrderCounts = await Orders.aggregate([
            {
                $match: {
                    createdBy: { $in: ownerIds },
                    status: "Pending"
                }
            },
            {
                $group: {
                    _id: "$createdBy",
                    pendingCount: { $sum: 1 }
                }
            }
        ]);

        // Create a map of ownerId to pending count
        const pendingCountMap = pendingOrderCounts.reduce((acc, item) => {
            acc[item._id.toString()] = item.pendingCount;
            return acc;
        }, {});

        // Create a map of ownerId to dairyName
        const ownerMap = owners.reduce((acc, owner) => {
            acc[owner._id.toString()] = {
                dairyName: owner.dairyName,
                pendingCount: pendingCountMap[owner._id.toString()] || 0
            };
            return acc;
        }, {});

        // Map orders with dairyName and include pending count
        const ordersWithDairyInfo = orders.map(order => {
            const ownerId = order.createdBy?._id?.toString() || order.createdBy?.toString();
            const ownerInfo = ownerMap[ownerId] || { 
                dairyName: "Unknown Dairy", 
                pendingCount: 0 
            };

            return {
                ...order._doc,
                dairyName: ownerInfo.dairyName,
                ownerId: order.createdBy,
                pendingOrdersCount: ownerInfo.pendingCount
            };
        });

        // Prepare owner statistics
        const ownerStatistics = owners.map(owner => ({
            _id: owner._id,
            dairyName: owner.dairyName,
            pendingOrdersCount: pendingCountMap[owner._id.toString()] || 0,
            totalOrders: orders.filter(o => 
                o.createdBy?._id?.toString() === owner._id.toString() || 
                o.createdBy?.toString() === owner._id.toString()
            ).length
        }));

        return NextResponse.json({ 
            data: {
                orders: ordersWithDairyInfo,
                ownerStatistics, // This gives you counts per dairy
                ownerCount: owners.length,
                orderCount: orders.length,
                totalPendingOrders: pendingOrderCounts.reduce((sum, item) => sum + item.pendingCount, 0)
            },
        }, { status: 200 });

    } catch (error) {
        console.error("Error in orders API:", error.message);
        return NextResponse.json({ 
            error: "Error fetching orders", 
            details: error.message 
        }, { status: 500 });
    }
}