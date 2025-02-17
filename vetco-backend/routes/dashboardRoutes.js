const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

// ✅ POST /api/dashboard/appointments → Create a new appointment
router.post("/appointments", async (req, res) => {
  try {
    const { title, date, time, clientName } = req.body;

    if (!title || !date || !time || !clientName) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newAppointment = new Appointment({
      title,
      date,
      time,
      clientName,
    });

    await newAppointment.save();
    res.status(201).json({ message: "Appointment created successfully", appointment: newAppointment });

  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// ✅ GET /api/dashboard/appointments → Fetch all appointments
router.get("/appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: 1 });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;
