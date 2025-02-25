// import {express} from "express";
const express = require("express");
const MedicalRecord = require("../models/MedicalRecord");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/** 
 * @desc Fetch all patients assigned to a vet
 * @route GET /api/vet/patients
 * @access Private (Vet)
 */
router.get("/patients", protect, async (req, res) => {
  try {
    const patients = await Patient.find({ vet: req.user._id }).populate("owner", "name");
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients" });
  }
});

/** 
 * @desc Add a new patient
 * @route POST /api/vet/patients
 * @access Private (Vet)
 */
router.post("/patients", protect, async (req, res) => {
  try {
    const { name, species, breed, age, owner } = req.body;
    const patient = new Patient({
      name,
      species,
      breed,
      age,
      owner,
      vet: req.user._id,
    });
    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: "Error adding patient" });
  }
});

/** 
 * @desc Fetch all medical records for a vet's patients
 * @route GET /api/vet/records
 * @access Private (Vet)
 */
router.get("/records", protect, async (req, res) => {
  try {
    const records = await MedicalRecord.find({ vet: req.user._id }).populate("patient", "name species");
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching medical records" });
  }
});

/** 
 * @desc Add a new medical record
 * @route POST /api/vet/records
 * @access Private (Vet)
 */
router.post("/records", protect, async (req, res) => {
  try {
    const { patientId, diagnosis, treatment, medications, followUpDate } = req.body;
    const record = new MedicalRecord({
      patient: patientId,
      diagnosis,
      treatment,
      medications,
      followUpDate,
      vet: req.user._id,
    });
    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: "Error adding medical record" });
  }
});

// /** 
//  * @desc Fetch appointments assigned to a vet
//  * @route GET /api/vet/appointments
//  * @access Private (Vet)
//  */
// router.get("/appointments", protect, async (req, res) => {
//   try {
//     const appointments = await Appointment.find({ vet: req.user._id }).populate("client", "name");
//     res.status(200).json(appointments);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching appointments" });
//   }
// });
/** 
/** 
 * @desc Fetch appointments assigned to a vet
 * @route GET /api/vet/appointments
 * @access Private (Vet)
 */
router.get("/appointments", protect, async (req, res) => {
    try {
      const appointments = await Appointment.find({ vetId: req.user._id })
        .populate("userId", "name") // Populating client details
        .populate("vetId", "name"); // ✅ Correct field name in schema
  
      res.status(200).json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Error fetching appointments" });
    }
  });
  
// @desc Fetch recent activities for the vet
// @route GET /api/dashboard/recent-activity
// @access Private (Vet)
router.get("/recent-activity", protect, async (req, res) => {
    try {
      const activities = await RecentActivity.find({ vet: req.user._id }).sort({ createdAt: -1 }).limit(10);
      res.status(200).json(activities);
    } catch (error) {
      res.status(500).json({ message: "Error fetching recent activity" });
    }
  });  
  

  module.exports = router;
