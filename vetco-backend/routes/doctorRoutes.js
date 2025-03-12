const express = require("express");
const router = express.Router();
const Doctor = require("../models/doctor");


// Get all doctors
app.get("/get", async (req, res) => {
    try {
      const doctors = await Doctor.find();
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch doctors" });
    }
  });
  
  // Add a new doctor
  app.post("/post", async (req, res) => {
    try {
      const doctor = new Doctor(req.body);
      await doctor.save();
      res.status(201).json(doctor);
    } catch (error) {
      res.status(500).json({ error: "Failed to add doctor" });
    }
  });

module.exports = router;
