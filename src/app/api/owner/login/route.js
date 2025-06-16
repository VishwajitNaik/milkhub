import { connect } from "mongoose";
import Owner from "../../../../models/ownerModel";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { phone, email, password } = reqBody;

    // Validate that either phone or email is provided
    if (!phone && !email) {
      return NextResponse.json(
        { error: "Phone or email is required" },
        { status: 400 }
      );
    }

    // Validate password is provided
    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    // Find owner by phone or email
    const owner = await Owner.findOne({
      $or: [{ phone: phone || "" }, { email: email || "" }]
    });

    if (!owner) {
      return NextResponse.json(
        { error: "Invalid phone or email" },
        { status: 400 }
      );
    }

    // Check password
    const validPassword = await bcryptjs.compare(password, owner.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 400 }
      );
    }

    // Create token
    const tokenData = {
      id: owner._id,
      ownerName: owner.ownerName,
      phone: owner.phone,
      email: owner.email
    };

    const ownerToken = jwt.sign(
      tokenData,
      process.env.OWNER_TOKEN_SECRETE,
      { expiresIn: "1d" }
    );

    // Set cookie
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
      owner: {
        id: owner._id,
        ownerName: owner.ownerName,
        dairyName: owner.dairyName
      }
    });

    response.cookies.set("ownerToken", ownerToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60,
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}