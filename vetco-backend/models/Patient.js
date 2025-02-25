const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    species: { type: String, required: true },
    breed: { type: String },
    age: { type: Number },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vet: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Assigned vet
    lastVisit: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", PatientSchema);