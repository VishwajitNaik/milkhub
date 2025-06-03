import mongoose from "mongoose";

const AddAddressSchema = new mongoose.Schema({
    village: {
        type: String,
        required: true,
    },
    tahasil: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    PinCode: {
        type: Number,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: true,
    },
}, { timestamps: true });

const AddAddress = mongoose.models.AddAddress || mongoose.model('AddAddress', AddAddressSchema);
export default AddAddress;