import mongoose from "mongoose";
import userOrders from "./userOrders";
import SthanikVikri from "./sthanikVikri";
import VikriMilk from "./vikriMilk";

const ownerSchema = new mongoose.Schema({
  registerNo: {
    type: Number,
    required: [true, "Please provide an Register No"],
  },
  ownerName: {
    type: String,
    required: [true, "Please provide an Owner Name"],
  },
  dairyName: {
    type: String,
    unique: true,
  },
  sangh: { // Changed to reference Sangh model
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sangh',
    required: [true, "Please provide a Sangh reference"],
  },
  phone: {
    type: String, // Changed to String
    required: [true, "Please provide a Phone Number"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an Email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a Password"],
  },
  // models/ownerModel.js
  aadhaarNumber: { type: String, select: false }, // Masked in responses
  kycStatus: { 
    type: String, 
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  bankDetails: {
    accountNumber: { type: String },
    ifsc: { type: String },
    verified: Boolean
  },
  kycDocuments: [{
    type: { type: String }, // 'aadhaar_front', 'aadhaar_back'
    url: String,
    uploadedAt: Date
  }],
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: true,
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  Kapat: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sthirkapat'
  }],
  Order: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Orders',
    default: [],
  }],
  DocterVisit: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GetDocterVisit',
    default: [],
  }],
  Address: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AddAddress',
    default: [],
  }],
  storedBills: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'StoreBill' 
  }],
  OwnerMilkRecords: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OwnerMilk',
    default: [] // Ensure default value is an empty array
}],
userMilk:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Milk',
    default: [] // Ensure default value is an empty array
}],
userOrders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userOrders',
    default: []
}],
ownerBillKapat: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OnwerKapat',
    default: []
}],
SthanikVikriuser: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SthanikVikri',
    default: []
}],
ucchal:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ucchal',
    default: []
}],
VikrUseriMilk: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VikriMilk',
    default: [],
}],
  verifyToken: String,
  verifyTokenExpiry: Date,
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

ownerSchema.index({ registerNo: 1, sangh: 1 }, { unique: true });

ownerSchema.methods.toJSON = function () {
  const obj = this.toObject();
  if(obj.aadhaarNumber) {
    obj.aadhaarNumber = obj.aadhaarNumber.slice(0, 8) + 'XXXX'; // Mask Aadhaar
  }
  return obj;
}

const Owner = mongoose.models.Owner || mongoose.model('Owner', ownerSchema);
export default Owner;
