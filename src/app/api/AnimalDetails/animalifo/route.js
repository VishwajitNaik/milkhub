import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig.js";
import Owner from "@/models/ownerModel";
import User from "@/models/userModel";
import AddAddress from "@/models/AddAddress";
import Animal from "@/models/AnimalDetails.js";

connect();

export async function POST(request) {
    try {
        console.log("=== STARTING ANIMAL CREATION ===");

        // [1/8] Authentication Check
        console.log("[1/8] Checking authentication...");
        const ownerId = getDataFromToken(request);
        if (!ownerId) {
            console.error("Authentication failed - no ownerId");
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }
        console.log("✓ Authenticated as owner:", ownerId);

        // [2/8] Parse Request Body
        console.log("[2/8] Parsing request body...");
        const reqBody = await request.json();
        console.debug("Request body received:", JSON.stringify(reqBody, null, 2));

        const owner = await Owner.findById(ownerId);
        if (!owner) {
            console.error("Owner not found for ID:", ownerId);
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }
        console.log("dairyname:", owner.dairyName);

        const user = await User.findOne({ registerNo: reqBody.registerNo, createdBy: ownerId });
        if (!user) {
            console.error("User not found for registerNo:", reqBody.registerNo);
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        await AddAddress.find({ createdBy: ownerId }); // Optional, for future use

        // [3/8] Field Extraction
        console.log("[3/8] Extracting fields...");
        const {
            date,
            village,
            tahasil,
            district,
            dairyName = owner.dairyName,
            registerNo,
            username,
            species,
            animalGender,
            tagStatus = "untagged",
            tagType,
            tagId,
            breed,
            DOB,
            age,
            purpose,
            quantityOfMilk,
            runningMonth,
            healthStatus = "healthy",
            typeOfDisease,
            require,
        } = reqBody;

        // ✅ [4/8] Define Required Fields
        const requiredFields = {
            date: "Date",
            village: "Village",
            tahasil: "Tahasil",
            district: "District",
            registerNo: "Register Number",
            username: "Username",
            species: "Species",
            animalGender: "Animal Gender",
            tagStatus: "Tag Status",
            breed: "Breed",
            DOB: "Date of Birth",
            age: "Age",
            purpose: "Purpose",
            healthStatus: "Health Status"
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([key]) => !reqBody[key] && reqBody[key] !== 0)
            .map(([_, label]) => label);

        if (missingFields.length > 0) {
            console.error("Missing required fields:", missingFields);
            return NextResponse.json(
                { 
                    error: "Missing required fields",
                    missingFields,
                    debug: "Check these required fields in your request"
                },
                { status: 400 }
            );
        }

        // [5/8] Conditional Validation
        if (tagStatus === "tagged") {
            if (!tagType || !tagId) {
                const missingTagFields = [
                    ...(!tagType ? ['tagType'] : []),
                    ...(!tagId ? ['tagId'] : [])
                ];
                console.error("Missing tag fields:", missingTagFields);
                return NextResponse.json(
                    {
                        error: "Tag information incomplete",
                        missingFields: missingTagFields,
                        debug: "When tagStatus is 'tagged', both tagType and tagId are required"
                    },
                    { status: 400 }
                );
            }
        }

if (tagStatus === "untagged" && require === true) {
  if (!tagType) {
    const missingTagFields = ['tagType'];
    console.error("Missing tagType for untagged animal with require true:", missingTagFields);
    return NextResponse.json(
      {
        error: "Tag type required for untagged animal with require=true",
        missingFields: missingTagFields,
        debug: "When tagStatus is 'untagged' and require is true, tagType must be provided"
      },
      { status: 400 }
    );
  }
}


        if (purpose === "inMilk" && (quantityOfMilk === undefined || isNaN(quantityOfMilk))) {
            console.error("Invalid milk quantity:", quantityOfMilk);
            return NextResponse.json(
                {
                    error: "Invalid milk quantity",
                    debug: "Must provide a valid number for quantityOfMilk when purpose is 'inMilk'"
                },
                { status: 400 }
            );
        }

        if (purpose === "pregnant" && (runningMonth === undefined || isNaN(runningMonth))) {
            console.error("Invalid running month:", runningMonth);
            return NextResponse.json(
                {
                    error: "Invalid pregnancy month",
                    debug: "Must provide a valid number (1-9) for runningMonth when purpose is 'pregnant'"
                },
                { status: 400 }
            );
        }

        if (healthStatus === "sick" && !typeOfDisease) {
            console.error("Missing disease type for sick animal");
            return NextResponse.json(
                {
                    error: "Disease type required",
                    debug: "Must provide typeOfDisease when healthStatus is 'sick'"
                },
                { status: 400 }
            );
        }

        // [6/8] Create Animal Record
        console.log("[6/8] Creating animal record...");
        const animalData = {
            date: date ? new Date(date) : new Date(),
            village,
            tahasil,
            district,
            dairyName: owner.dairyName,
            registerNo,
            username,
            tagType,
            tagId,
            species,
            animalGender,
            tagStatus,
            ...(tagStatus === "tagged" && { tagType, tagId }),
            breed,
            DOB: DOB ? new Date(DOB) : new Date(),
            age: Number(age),
            purpose,
            ...(purpose === "inMilk" && { quantityOfMilk: Number(quantityOfMilk) }),
            ...(purpose === "pregnant" && { runningMonth: Number(runningMonth) }),
            healthStatus,
            ...(healthStatus === "sick" && { typeOfDisease }),
            createdBy: user._id,
            createdAt: new Date(),
            require: require || false
        };

        console.debug("Prepared animal data:", JSON.stringify(animalData, null, 2));

        // [7/8] Save to Database
        const newAnimal = new Animal(animalData);
        const savedAnimal = await newAnimal.save();
        console.log("[8/8] ✓ Animal created successfully:", savedAnimal._id);

        return NextResponse.json(
            {
                success: true,
                message: "Animal added successfully",
                animalId: savedAnimal._id,
                debug: {
                    receivedFields: Object.keys(reqBody),
                    processedFields: Object.keys(animalData)
                }
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("!!! ANIMAL CREATION FAILED !!!");
        console.error("Error:", error.message);
        console.error("Stack:", error.stack);

        return NextResponse.json(
            {
                error: "Internal server error",
                debug: {
                    message: error.message,
                    ...(process.env.NODE_ENV === 'development' && {
                        stack: error.stack,
                        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
                    })
                }
            },
            { status: 500 }
        );
    }
}
