import mongoose from 'mongoose';

const animalDetailsSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
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
    dairyName:{
        type: String,
        required: true,
    },
    registerNo: {
        type: Number,
        required: true,
    },
    username:{
        type: String,
        required: true,
    },
    species: {
        type: String,
        enum: ["cow", "buffalo", "goat", "sheep", "hen", "duck"],
        required: true,
    },
    animalGender: {
        type: String,
        enum: ["Male", "Female"],
        required: true,
    },
    tagStatus: {
        type: String,
        enum: ["tagged", "untagged"],
        default: "untagged",
        required: true,
    },
    tagType: {
        type: String,
        enum: ["ear", "rfid", "other"],
        validate: {
            validator: function (value) {
                if (this.tagStatus === "tagged") return !!value;
                return !value;
            },
            message: "tagType is required if tagStatus is 'tagged' and must be empty otherwise.",
        }
    },
    tagId: {
        type: String,
        unique: true,
        validate: {
            validator: function (value) {
                if (this.tagStatus === "tagged") return !!value;
                return !value;
            },
            message: "tagId is required if tagStatus is 'tagged' and must be empty otherwise.",
        }
    },
    breed: {
        type: String,
        enum: ["sahiwal", "jersey", "holstein", "murrah", "kankrej", "desi", "other"],
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    purpose: {
        type: String,
        enum: ["inMilk", "dry", "calf", "pregnant", "other"],
        required: true,
    },
    quantityOfMilk: {
        type: Number,
        validate: {
            validator: function (value) {
                if (this.purpose === "inMilk") return value !== undefined && value !== null;
                return value === undefined || value === null;
            },
            message: "quantityOfMilk is required if purpose is 'in milk' and must be empty otherwise.",
        }
    },
    runningMonth: {
        type: Number,
        validate: {
            validator: function (value) {
                if (this.purpose === "pregnant") return value !== undefined && value !== null;
                return value === undefined || value === null;
            },
            message: "runningMonth is required if purpose is 'pregnant' and must be empty otherwise.",
        }
    },
    healthStatus: {
        type: String,
        enum: ["healthy", "sick"],
        required: true,
    },
    typeOfDisease: {
        type: String,
        validate: {
            validator: function (value) {
                if (this.healthStatus === "sick") return !!value;
                return !value;
            },
            message: "typeOfDisease is required if healthStatus is 'sick' and must be empty otherwise.",
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const AnimalDetails = mongoose.models.AnimalDetails || mongoose.model("AnimalDetails", animalDetailsSchema);

export default AnimalDetails;
