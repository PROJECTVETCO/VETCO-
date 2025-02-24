const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const { protect } = require("../middleware/authMiddleware");

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
// router.get("/appointments", async (req, res) => {
//   try {
//     const appointments = await Appointment.find().sort({ date: 1 });
//     res.status(200).json(appointments);
//   } catch (error) {
//     res.status(500).json({ message: "Server error. Please try again later." });
//   }
// });



// ✅ GET /api/dashboard/appointments → Fetch logged-in user's appointments
router.get("/appointments", protect, async (req, res) => {
  try {
    // Fetch only the logged-in user's appointments
    const appointments = await Appointment.find({ user: req.user._id }).sort({ date: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});




// // ✅ GET /api/dashboard/stats - Fetch total appointments
// router.get("/stats", async (req, res) => {
//   try {
//     const totalAppointments = await Appointment.countDocuments();
//     res.status(200).json({
//       totalAppointments,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error. Try again later." });
//   }
// });

// ✅ GET /api/dashboard/stats - Fetch total appointments for the logged-in user
router.get("/stats", protect, async (req, res) => {
  try {
    const totalAppointments = await Appointment.countDocuments({ userId: req.user._id });

    res.status(200).json({
      totalAppointments,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error. Try again later.", error: error.message });
  }
});


// ✅ GET /api/dashboard/recent-activity - Fetch recent appointments as activity
// router.get("/recent-activity", async (req, res) => {
//   try {
//     const recentAppointments = await Appointment.find().sort({ createdAt: -1 }).limit(5);
//     const activity = recentAppointments.map((appt) => ({
//       id: appt._id,
//       type: "appointment",
//       status: "New appointment scheduled",
//       description: `${appt.clientName} - ${new Date(appt.date).toLocaleDateString()} at ${appt.time}`,
//       color: "green",
//     }));

//     res.status(200).json(activity);
//   } catch (error) {
//     res.status(500).json({ message: "Server error. Try again later." });
//   }
// });

// ✅ GET /api/dashboard/recent-activity → Fetch recent appointments for the logged-in user
router.get("/recent-activity", protect, async (req, res) => {
  try {
    const userId = req.user._id; // ✅ Get logged-in user ID

    const recentAppointments = await Appointment.find({ userId }) // ✅ Only show user's appointments
      .sort({ createdAt: -1 })
      .limit(5);

    if (!recentAppointments.length) {
      return res.status(404).json({ message: "No recent activity found." });
    }

    const activity = recentAppointments.map((appt) => ({
      id: appt._id,
      type: "appointment",
      status: "New appointment scheduled",
      description: `${appt.clientName} - ${new Date(appt.date).toLocaleDateString()} at ${appt.time}`,
      color: "green",
    }));

    res.status(200).json(activity);
  } catch (error) {
    console.error("❌ Error fetching recent activity:", error.message);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});


module.exports = router;
