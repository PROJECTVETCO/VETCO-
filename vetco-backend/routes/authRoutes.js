const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// SIGNUP Route
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password, userType, licenseNumber, location } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      userType, // Store userType: "farmer" or "vet"
      licenseNumber: userType === "vet" ? licenseNumber : undefined,
      location,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LOGIN Route (Redirect Based on Role)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user existence
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT Token (Include userType)
    const token = jwt.sign(
      { userId: user._id, userType: user.userType }, // ✅ Include userType
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send token and userType in response
    res.status(200).json({
      token,
      userType: user.userType, // ✅ Send userType for frontend navigation
      user,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
