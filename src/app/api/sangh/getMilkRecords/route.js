import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Milk from '@/models/MakeMilk';
import { getDataFromToken } from '@/helpers/getSanghFormToken';
import Owner from '@/models/ownerModel';

connect();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const ownerId = searchParams.get('ownerId'); // ✅ Get ownerId from query

    if (!ownerId) {
      return NextResponse.json({ error: 'Missing ownerId in query' }, { status: 400 });
    }

    // Parse dates
    const startDate = startDateParam ? new Date(startDateParam) : new Date();
    const endDate = endDateParam ? new Date(endDateParam) : new Date();
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // Fetch milk records for the specified ownerId
    const milkRecords = await Milk.find({
      createdBy: ownerId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .populate('createdBy', 'registerNo name')
      .sort({ date: 1 });

    const totalAmount = milkRecords.reduce((sum, record) => sum + (record.amount || 0), 0);

    return NextResponse.json({
      message: 'Milk records fetched successfully',
      data: milkRecords,
      totalAmount,
    });
  } catch (error) {
    console.error('Error fetching milk records:', error);
    return NextResponse.json({ error: 'Failed to fetch milk records' }, { status: 500 });
  }
}
