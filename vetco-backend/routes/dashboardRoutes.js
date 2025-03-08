const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const Appoint = require("../models/AppointmentDoc");
const { protect } = require("../middleware/authMiddleware");

// ✅ POST /api/dashboard/appointments → Create a new appointment
// ✅ POST: Create a new appointment
router.post("/appointments", protect, async (req, res) => {
  try {
    const { title, date, time, clientName, vetId } = req.body;

    if (!title || !date || !time || !clientName) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // ✅ Create the appointment
    const newAppointment = await Appointment.create({
      title,
      date,
      time,
      clientName,
      vetId: vetId || null,
      userId: req.user._id, // ✅ Associate with logged-in user
    });

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error("❌ Appointment creation error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
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

// ✅ GET appointments by user ID (Protected)
// router.get("/appointments/user/:userId", protect, async (req, res) => {
//   try {
//     const { userId } = req.params;
//     if (!userId) {
//       return res.status(400).json({ message: "User ID is required" });
//     }

//     const userAppointments = await Appointment.find({ userId }).sort({ date: 1 }).populate("vetId", "fullName email");

//     if (!userAppointments.length) {
//       return res.status(404).json({ message: "No appointments found for this user." });
//     }

//     res.status(200).json(userAppointments);
//   } catch (error) {
//     res.status(500).json({ message: "Server error. Please try again later.", error: error.message });
//   }
// });

// ✅ GET /api/dashboard/appointments/user → Fetch logged-in user's appointments
router.get("/appointments/user", protect, async (req, res) => {
  try {
    // ✅ Ensure `req.user` is available (middleware must attach it)
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const userId = req.user._id; // ✅ Get userId from decoded token
    console.log("🔑 Fetching appointments for User ID:", userId);

    // ✅ Fetch only appointments belonging to the logged-in user
    const userAppointments = await Appointment.find({ userId })
      .sort({ date: 1 })
      .populate("vetId", "fullName email");

    if (!userAppointments.length) {
      return res.status(404).json({ message: "No appointments found for this user." });
    }

    res.status(200).json(userAppointments);
  } catch (error) {
    console.error("🔥 Error fetching appointments:", error);
    res.status(500).json({ message: "Server error. Please try again later.", error: error.message });
  }
});



// ✅ DELETE an appointment
router.delete("/appointments/:appointmentId", protect, async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.appointmentId);
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later.", error: error.message });
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

router.post("/appointments/new", protect, async (req, res) => {
  try {
    const { title, date, time, clientName, vetId, message } = req.body;
    
    if (!title || !date || !time || !clientName) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create the appointment
    const newAppointment = await Appoint.create({
      title,
      date,
      time,
      clientName,
      vetId: vetId || null,
      message,
      userId: req.user._id,
    });

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error("❌ Appointment creation error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

router.get("/appointments/new", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const userAppointments = await Appoint.find({ userId })
      .sort({ date: 1 })
      .populate("vetId", "fullName email");

    if (!userAppointments.length) {
      return res.status(404).json({ message: "No appointments found for this user." });
    }

    res.status(200).json(userAppointments);
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later.", error: error.message });
  }
});




module.exports = router;
