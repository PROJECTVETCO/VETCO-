const mongoose = require("mongoose");

const MedicalRecordSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    diagnosis: { type: String, required: true },
    treatment: { type: String, required: true },
    medications: { type: String },
    followUpDate: { type: Date },
    vet: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Vet who added the record
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicalRecord", MedicalRecordSchema);
