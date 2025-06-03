import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig.js";
import Owner from "@/models/ownerModel";
import User from "@/models/userModel";
import AddAddress from '@/models/AddAddress';
import Animal from "@/models/AnimalDetails.js";

connect();

export async function POST(request) {}
