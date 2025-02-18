const express = require("express");
const Record = require("../models/recordModel");
const { protect } = require("../middleware/authMiddleware"); // Ensure this is imported correctly

const router = express.Router();

// ✅ Get medical records for a specific user
router.get("/user/:userId", protect, async (req, res) => {
  try {
    const records = await Record.find({ userId: req.params.userId }).populate("vetId", "fullName email");
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Create a new medical record
router.post("/", protect, async (req, res) => {
  const { vetId, userId, petName, animalType, diagnosis, treatment, visitDate } = req.body;

  if (!vetId || !userId || !petName || !animalType || !diagnosis || !treatment || !visitDate) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newRecord = new Record({ vetId, userId, petName, animalType, diagnosis, treatment, visitDate });
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Delete a medical record
router.delete("/:recordId", protect, async (req, res) => {
  try {
    await Record.findByIdAndDelete(req.params.recordId);
    res.json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
