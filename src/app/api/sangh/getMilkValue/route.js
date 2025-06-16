import { NextResponse } from 'next/server';
import Milk from '@/models/MakeMilk';
import Owner from '@/models/ownerModel';
import { getDataFromToken } from '@/helpers/getSanghFormToken';
import { getValue } from '@/dbconfig/redis';

export async function GET(request) {
  try {
    const sanghId = await getDataFromToken(request);
    const { searchParams } = new URL(request.url);

    const registerNo = searchParams.get('registerNo');
    const session = searchParams.get('session');
    const milkType = searchParams.get('milkType'); // changed from 'milk'
    const date = searchParams.get('date');
    const dairyName = searchParams.get('dairyName'); // optional but useful

    // Check if required query parameters are present
    if (!registerNo || !session || !milkType || !date) {
      return NextResponse.json({ error: 'Missing required query parameters' }, { status: 400 });
    }

    // Create cache key
    const cacheKey = `milk:${registerNo}:${session}:${milkType}:${date}`;
    const cachedData = await getValue(cacheKey);

    if (cachedData) {
      const milkRecord = JSON.parse(cachedData);
      return NextResponse.json({
        message: 'Milk data retrieved from cache',
        data: milkRecord,
      });
    }

    // Find the owner based on register number and sangh
    const owner = await Owner.findOne({ registerNo, sangh: sanghId });
    if (!owner) {
      return NextResponse.json({ error: 'Owner not found' }, { status: 404 });
    }

    // Find the milk record using the updated schema fields
    const milkRecord = await Milk.findOne({
      createdBy: owner._id,
      session,
      milkType,
      date: new Date(date),
      ...(dairyName && { dairyName }), // if dairyName is provided, include it in the filter
    });

    if (!milkRecord) {
      return NextResponse.json({ error: 'Milk data not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Milk data retrieved successfully',
      data: milkRecord,
    });

  } catch (error) {
    console.error('Error fetching milk value:', error);
    return NextResponse.json({ error: 'Failed to fetch milk value', details: error.message }, { status: 500 });
  }
}
