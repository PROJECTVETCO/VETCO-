const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
  {
    vetId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    petName: { type: String, required: true },
    animalType: { type: String, required: true },
    diagnosis: { type: String, required: true },
    treatment: { type: String, required: true },
    visitDate: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Record", recordSchema);
