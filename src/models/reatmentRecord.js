import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      enum: ['Tablet', 'Injection', 'Syrup', 'Ointment', 'Powder', 'Other']
    },
    dosage: {
      type: String,
      trim: true
    }
  }, { _id: false });

const treatmentRecordSchema = new mongoose.Schema({
    // Reference to the original visit request
    visitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DocterVisit',
      required: true
    },
    
    // Doctor who completed the visit
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sangh',
      required: true
    },
    
    // Patient information (denormalized for easier queries)
    patientName: {
      type: String,
      required: true,
      trim: true
    },
    patientVillage: {
      type: String,
      required: true,
      trim: true
    },
    // Form data
    diseasesDiagnosed: {
      type: String,
      required: true,
      trim: true
    },
    treatmentFollowed: {
      type: String,
      required: true,
      trim: true
    },
    medicinesUsed: [medicineSchema],
    
    // Additional notes
    notes: {
      type: String,
      trim: true
    },
    
    // Metadata
    visitDate: {
      type: Date,
      required: true
    },
    completionDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['completed', 'follow-up-needed', 'referred'],
      default: 'completed'
    }
  }, {
    timestamps: true
  });
  
  // Indexes for better query performance
  treatmentRecordSchema.index({ visitId: 1 });
  treatmentRecordSchema.index({ doctorId: 1 });
  treatmentRecordSchema.index({ patientName: 'text', patientVillage: 'text' });
  
  const TreatmentRecord = mongoose.models.TreatmentRecord || mongoose.model('TreatmentRecord', treatmentRecordSchema);
  
  export default TreatmentRecord;