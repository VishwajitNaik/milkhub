// /models/SanghModel.js
import mongoose from "mongoose";

const sanghSchema = new mongoose.Schema({
    SanghName: {
        type: String,
        required: [true, "Please provide a Sangh Name"],
    },
    email: {
        type: String,
        required: [true, "Please provide an Email"],
        unique: true,
    },
    phone: {
        type: Number,
        required: [true, "Please provide a Phone Number"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please Enter Password"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    milkRecords: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Milkowner'
    }],
    storedBills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StoreBill'
    }],
    storeOnwerRegNo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SanghOnwer',
        default: [],
    }],
    Kapat: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OnwerKapat',
        default: [],
    }],
    
    isAdmin: {
        type: Boolean,
        default: true,
    },
    verifyToken: String,
    verifyTokenExpiry: Date,
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
});

const Sangh = mongoose.models.Sangh || mongoose.model("Sangh", sanghSchema);
export default Sangh;
