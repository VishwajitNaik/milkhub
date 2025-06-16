import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Animal from '@/models/AnimalDetails.js';
import Owner from '@/models/ownerModel.js';
import User from '@/models/userModel.js';
import { getDataFromToken } from '@/helpers/getSanghFormToken.js';

connect();

export async function GET(request) {
  try {
    await connect();

    const url = new URL(request.url);
    const ownerId = url.pathname.split('/').pop();
    if (!ownerId) {
      return NextResponse.json({ error: 'Owner ID is required' }, { status: 400 });
    }

    const sanghId = await getDataFromToken(request);
    if (!sanghId) {
      return NextResponse.json({ error: 'Invalid or missing token' }, { status: 401 });
    }

    const owner = await Owner.findOne({ _id: ownerId, sangh: sanghId });
    if (!owner) {
      return NextResponse.json({ error: 'Owner not found' }, { status: 404 });
    }

    // Get all users created by this owner
    const users = await User.find({ createdBy: owner._id });
    const userIds = users.map(user => user._id);

    // Get all animals created by these users
    const animalRecord = await Animal.find({ createdBy: { $in: userIds } })
      .populate({ path: 'createdBy', select: 'dairyName' });

    if (!animalRecord || animalRecord.length === 0) {
      return NextResponse.json({ message: 'No animal records found.' }, { status: 404 });
    }

    const animalDetails = animalRecord.map(animal => ({
      ...animal._doc,
      dairyName: animal.createdBy?.dairyName || 'Unknown Dairy',
    }));

    return NextResponse.json({ data: animalDetails }, { status: 200 });

  } catch (error) {
    console.error('Error fetching animal details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

