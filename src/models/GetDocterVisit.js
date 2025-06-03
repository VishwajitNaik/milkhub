const mongoose = require('mongoose');

const GetDocterVisitSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
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
    username: {
        type: String,
        required: true,
    },
    Decises: {  // Note: Consider renaming to 'diseases' for consistency
        type: String,
        required: true
    },
    AnimalType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Completed"],
        default: "Pending",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
        required: true,
    },
    visitDate: {
        type: Date,
    },
    visitTime: {
        type: String,
    },
    // New fields for completed visits
    diseasesOccurred: {
        type: String,
    },
    treatmentFollowed: {
        type: String,
    },
    medicinesUsed: [{
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ["Tablet", "Injection", "Syrup", "Ointment", "Powder", "Other"],
            required: true
        },
        dosage: String
    }],
    completedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    completedAt: {
        type: Date
    }
}, { timestamps: true });

const GetDocterVisit = mongoose.models.GetDocterVisit || mongoose.model('GetDocterVisit', GetDocterVisitSchema);

module.exports = GetDocterVisit;