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

// ✅ GET /api/dashboard/stats - Fetch total appointments
router.get("/stats", async (req, res) => {
  try {
    const totalAppointments = await Appointment.countDocuments();
    res.status(200).json({
      totalAppointments,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// ✅ GET /api/dashboard/recent-activity - Fetch recent appointments as activity
router.get("/recent-activity", async (req, res) => {
  try {
    const recentAppointments = await Appointment.find().sort({ createdAt: -1 }).limit(5);
    const activity = recentAppointments.map((appt) => ({
      id: appt._id,
      type: "appointment",
      status: "New appointment scheduled",
      description: `${appt.clientName} - ${new Date(appt.date).toLocaleDateString()} at ${appt.time}`,
      color: "green",
    }));

    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: "Server error. Try again later." });
  }
});



module.exports = router;
