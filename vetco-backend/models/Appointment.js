const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  clientName: { type: String, required: true },
  status: { type: String, default: "Scheduled" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
