const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const { protect } = require("../middleware/authMiddleware");

// // ✅ POST /api/dashboard/appointments → Create a new appointment
// router.post("/appointments", async (req, res) => {
//   try {
//     const { title, date, time, clientName } = req.body;

//     if (!title || !date || !time || !clientName) {
//       return res.status(400).json({ message: "All fields are required." });
//     }

//     const newAppointment = new Appointment({
//       title,
//       date,
//       time,
//       clientName,
//     });

//     await newAppointment.save();
//     res.status(201).json({ message: "Appointment created successfully", appointment: newAppointment });

//   } catch (error) {
//     res.status(500).json({ message: "Server error. Please try again later." });
//   }
// });


// ✅ POST /api/dashboard/appointments → Create an appointment for logged-in user

// ✅ Create an appointment for a logged-in user
router.post("/appointments", protect, async (req, res) => {
  try {
    const { title, date, time, clientName, vetId } = req.body;

    if (!title || !date || !time || !clientName) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    const userId = req.user._id; // Extract logged-in user ID

    const newAppointment = new Appointment({
      title,
      date,
      time,
      clientName,
      userId, // ✅ Assign to logged-in user
      vetId: vetId || null, // Optional vet assignment
    });

    await newAppointment.save();
    res.status(201).json({ message: "Appointment created successfully", appointment: newAppointment });

  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Server error. Please try again later.", error: error.message });
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


// ✅ GET appointments by user ID (Protected)
router.get("/appointments/user/:userId", protect, async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userAppointments = await Appointment.find({ userId }).sort({ date: 1 }).populate("vetId", "fullName email");

    if (!userAppointments.length) {
      return res.status(404).json({ message: "No appointments found for this user." });
    }

    res.status(200).json(userAppointments);
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later.", error: error.message });
  }
});

// ✅ GET /api/dashboard/stats - Fetch total appointments
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

// ✅ GET /api/dashboard/recent-activity - Fetch recent user activity
router.get("/recent-activity", protect, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    const userId = req.user._id;

    // Fetch only the logged-in user's recent appointments
    const recentAppointments = await Appointment.find({ userId })
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
    console.error("Error fetching recent activity:", error);
    res.status(500).json({ message: "Server error. Try again later.", error: error.message });
  }
});



module.exports = router;
