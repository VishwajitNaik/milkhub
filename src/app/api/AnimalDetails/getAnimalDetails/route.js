import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Animal from "@/models/AnimalDetails";
import mongoose from "mongoose";

connect();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  console.log("userId:", userId);
  

  try {
    const animalDetails = await Animal.find({ createdBy: userId })
      .populate("createdBy", "registerNo name")

    console.log("animalDetails:", animalDetails);

    return NextResponse.json({
      message: "Animal details fetched successfully",
      data: animalDetails,
    });
  } catch (error) {
    console.error("Error fetching animal details:", error);
    return NextResponse.json(
      { error: "Failed to fetch animal details" },
      { status: 500 }
    );
  }
}
