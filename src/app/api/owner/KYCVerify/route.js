import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Owner from '@/models/ownerModel';
import address from '@/models/AddAddress';
import { putFile } from '@/app/lib/storage';
import { verifyAadhaar } from '@/app/lib/kycProviders';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import { addBeneficiaryToCashfree } from '@/helpers/cashfreeHelpers';

export async function POST(request) {
  await connect();
  const formData = await request.formData();

  try {
    // Extract form data
    const aadhaarNumber = formData.get('aadhaarNumber');
    const aadhaarFile = formData.get('aadhaarFile');
    const bankDetails = JSON.parse(formData.get('bankDetails'));
    const userId = await getDataFromToken(request);
    console.log("User ID:", userId);

    // Basic validation
    if (!aadhaarNumber || !aadhaarFile || !bankDetails.accountNumber) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Fetch current KYC status from DB
    const existingOwner = await Owner.findById(userId);
    if (existingOwner?.bankDetails?.verified && existingOwner?.kycStatus === "verified") {
      return NextResponse.json(
        { error: "KYC is already completed for this account." },
        { status: 400 }
      );
    }

    const addressDoc = await address.findOne({ createdBy: userId });
    if (!addressDoc) {
      return NextResponse.json(
        { error: "Address not found for this user." },
        { status: 404 }
      );
    }
    
    const formattedAddress = `${addressDoc.village}, ${addressDoc.tahasil}, ${addressDoc.district}, ${addressDoc.PinCode}`;
    

    // ✅ Store Aadhaar file securely
    const fileUrl = await putFile(aadhaarFile, `kyc/${userId}/aadhaar.pdf`);

    // ✅ Mock KYC verification
    const verification = await verifyAadhaar({
      aadhaarNumber,
      fileUrl,
      bankDetails
    });

    if (!verification.success) {
      return NextResponse.json(
        { error: verification.message || "KYC verification failed" },
        { status: 405 }
      );
    }


    // ✅ Update DB with masked Aadhaar and verified bank info
    await Owner.findByIdAndUpdate(userId, {
      $set: {
        kycStatus: "verified",
        bankDetails: {
          accountNumber: bankDetails.accountNumber,
          ifsc: bankDetails.ifsc,
          verified: true
        },
        aadhaarNumber: aadhaarNumber.slice(0, 8) + 'XXXX'
      }
    });

    // ✅ Add beneficiary to Cashfree

    // const UpdatedOwner = await Owner.findById(userId);
    const UpdatedOwner = await Owner.findById(userId).lean();
    UpdatedOwner.formattedAddress = formattedAddress;
      

    const cashfreeResponse = await addBeneficiaryToCashfree(UpdatedOwner);

    if (!cashfreeResponse.success) {
      return NextResponse.json(
        { error: cashfreeResponse.message || "Failed to add beneficiary" },
        { status: 400 }
      );
    }
    

    return NextResponse.json({
      message: "KYC verified successfully!",
      bankLinked: true
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}
