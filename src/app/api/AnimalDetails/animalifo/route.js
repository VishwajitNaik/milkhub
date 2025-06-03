import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig.js";
import Owner from "@/models/ownerModel";
import User from "@/models/userModel";
import AddAddress from '@/models/AddAddress';
import Animal from "@/models/AnimalDetails.js";

connect();

export async function POST(request) {
    try {
        console.log("=== STARTING ANIMAL CREATION ===");
        
        // 1. Authentication Check
        console.log("[1/8] Checking authentication...");
        const ownerId = getDataFromToken(request);
        if (!ownerId) {
            console.error("Authentication failed - no ownerId");
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }
        console.log("✓ Authenticated as owner:", ownerId);

        // 2. Parse Request Body
        console.log("[2/8] Parsing request body...");
        const reqBody = await request.json();
        console.debug("Request body received:", JSON.stringify(reqBody, null, 2));

        const owner = await Owner.findById(ownerId);
        console.log("dairyname:", owner.dairyName);

        const user = await User.findOne({ registerNo: reqBody.registerNo, createdBy: ownerId });
        if (!user) {
            console.error("User not found for registerNo:", reqBody.registerNo);
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }
        
        const address = await AddAddress.find({ createdBy: ownerId });

        // 3. Field Extraction with Debugging
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
            age,
            purpose,
            quantityOfMilk,
            runningMonth,
            healthStatus = "healthy",
            typeOfDisease
        } = reqBody;


        const missingFields = Object.entries(requiredFields)
            .filter(([key]) => !reqBody[key])
            .map(([_, name]) => name);

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

        if (!owner) {
            console.error("Owner not found for ID:", ownerId);
            return NextResponse.json(
                { error: "Owner not found" },
                { status: 404 }
            );
        }

        // 6. Conditional Field Validation
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

        // 7. Create Animal Record
        console.log("[7/8] Creating animal record...");
        const animalData = {
            date: date ? new Date(date) : new Date(),
            village,
            tahasil,
            district,
            dairyName: owner.dairyName,
            registerNo,
            username,
            species,
            animalGender,
            tagStatus,
            ...(tagStatus === "tagged" && { tagType, tagId }),
            breed,
            age: Number(age),
            purpose,
            ...(purpose === "inMilk" && { quantityOfMilk: Number(quantityOfMilk) }),
            ...(purpose === "pregnant" && { runningMonth: Number(runningMonth) }),
            healthStatus,
            ...(healthStatus === "sick" && { typeOfDisease }),
            createdBy: user._id,
            createdAt: new Date()
        };

        console.debug("Prepared animal data:", JSON.stringify(animalData, null, 2));

        const newAnimal = new Animal(animalData);

        // 8. Save to Database
        console.log("[8/8] Saving to database...");
        const savedAnimal = await newAnimal.save();
        console.log("✓ Animal created successfully:", savedAnimal._id);

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
        console.error("Full error object:", error);
        
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

  