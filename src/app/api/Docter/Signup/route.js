import { connect } from "../../../../dbconfig/dbconfig"; // Import the database configuration and connection setup
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs"; // Import bcryptjs for password hashing
import Docter from "@/models/AddDocter"; // Import the Docter model
import Sangh from "@/models/SanghModel"; // Import the Sangh model
import { getDataFromToken } from "@/helpers/getSanghFormToken"; // Import the helper function to get Sangh ID from token

connect(); // Ensure the database is connected

export async function POST(request) {
    try {
        const sanghId = await getDataFromToken(request);

        if (!sanghId) {
            return NextResponse.json({ error: "Authentication failed: No Sangh ID found." }, { status: 401 });
        }

        // Step 2: Fetch the Sangh document using the Sangh ID
        const sangh = await Sangh.findById(sanghId);
        if (!sangh) {
            return NextResponse.json({ error: "Sangh not found." }, { status: 404 });
        }
        console.log("Authenticated Sangh Name:", sangh.SanghName);

        const reqBody = await request.json();
        const { name, phone, address, specialization, password } = reqBody;

        // Check if the Docter already exists
        const existingDocter = await Docter.findOne({ phone });
        if (existingDocter) {
            return NextResponse.json({ error: "Docter already exists" }, { status: 400 });
        }

        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        // Create a new Docter
        const newDocter = new Docter({
            name,
            phone,
            address,
            specialization,
            sangh: sangh._id,
            password: hashPassword,
        });

        // Save the new Docter
        const savedDocter = await newDocter.save();

        return NextResponse.json({
            message: "Docter signed up successfully",
            success: true,
            savedDocter,
        });
    } catch (error) {
        console.error("Error in POST request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        
    }
}