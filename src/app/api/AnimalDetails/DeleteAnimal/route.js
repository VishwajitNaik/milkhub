import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Animal from "@/models/AnimalDetails.js";

connect();

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Animal ID is required' },
                { status: 400 }
            );
        }
        // Find and delete the animal by ID
        const deletedAnimal = await Animal.findByIdAndDelete(id);

        if(!deletedAnimal) {
            return NextResponse.json(
                { success: false, message: 'Animal not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Animal deleted successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error("Failed to delete animal:", error.message);
        return NextResponse.json(
            { success: false, message: 'Failed to delete animal' },
            { status: 500 }
        );
        
    }
}