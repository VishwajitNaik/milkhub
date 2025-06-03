import { connect } from "mongoose";
import Docter from "@/models/AddDocter";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs"; // Import bcryptjs for password hashing
import jwt from "jsonwebtoken"; // Import jwt for token generation

connect(); // Ensure the database is connected

export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { phone, password } = reqBody;

        // Find Docter by phone first
        const docter = await Docter.findOne({ phone });
        if (!docter) {
            return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
        }
        // Check if password is correct
        const validPassword = await bcryptjs.compare(password, docter.password);
        if (!validPassword) {
            return NextResponse.json({ error: "Invalid password" }, { status: 400 });
        }
        // Create token data
        const tokenData = {
            id: docter._id,
            name: docter.name,
            phone: docter.phone,
        };

        // Create token
        const docterToken = jwt.sign(tokenData, process.env.DOCTER_TOKEN_SECRETE, { expiresIn: "1d" });

        const response = NextResponse.json({
            message: "Login Successful...",
            success: true,
        });

        // Set token in cookies
        response.cookies.set("docterToken", docterToken, { // Unique cookie name for docter token
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60, // 1 day
            path: "/",
        });
        return response;
        
    } catch (error) {
        console.error("Error in POST request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        
    }
}
