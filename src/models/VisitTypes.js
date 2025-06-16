import mongoose from "mongoose";

const VisitTypeSchema = new mongoose.Schema({
    visitType: {
        type: String,
        required: true,
    },
    visitCode: {
        type: Number,
        required: true,
        unique: true,
    },
    visitRate: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value > 0; // Ensure visitRate is a positive number
            },
            message: "visitRate must be a positive number.",
        },
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sangh",
        required: true,
    },
}, { timestamps: true });

export default mongoose.models.VisitType || mongoose.model("VisitType", VisitTypeSchema);