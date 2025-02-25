const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/User");
const Message = require("../models/Message");
const { protect } = require("../middleware/authMiddleware"); // ✅ Import authentication middleware

// ✅ Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ✅ GET /api/users → Fetch users for recipient selection
router.get("/users", protect, async (req, res) => {
  try {
    const users = await User.find().select("fullName email _id");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// ✅ POST /api/messages/send → Send a new message
router.post("/messages/send", protect, async (req, res) => {
  try {
    const sender = req.user._id; // ✅ Get sender from logged-in user
    const { recipient, content } = req.body;

    if (!recipient || !content.trim()) {
      return res.status(400).json({ message: "Recipient and content are required." });
    }

    const recipientExists = await User.findById(recipient);
    if (!recipientExists) {
      return res.status(404).json({ message: "Recipient not found." });
    }

    // ✅ Create a new message
    const newMessage = new Message({ sender, recipient, content });
    await newMessage.save();

    res.status(201).json({ message: "Message sent successfully", messageData: newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error. Try again later.", error: error.message });
  }
});

// ✅ GET /api/messages → Fetch **only** logged-in user's messages
router.get("/messages", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(`Fetching messages for user ID: ${userId}`);

    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    })
      .populate("sender", "fullName email")
      .populate("recipient", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// ✅ GET /api/messages/recent → Fetch **recent conversations for logged-in user**
router.get("/messages/recent", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    })
      .populate("sender", "fullName email")
      .populate("recipient", "fullName email")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching recent conversations:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// ✅ GET /api/messages/chat/:otherUserId → Fetch chat between logged-in user & specific user
router.get("/messages/chat/:otherUserId", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const { otherUserId } = req.params;

    if (!isValidObjectId(otherUserId)) {
      return res.status(400).json({ message: "Invalid recipient ID." });
    }

    const chatMessages = await Message.find({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId },
      ],
    })
      .populate("sender", "fullName email")
      .populate("recipient", "fullName email")
      .sort({ createdAt: 1 });

    res.status(200).json(chatMessages);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// ✅ POST /api/messages/reply → Reply to a message
router.post("/messages/reply", protect, async (req, res) => {
  try {
    const sender = req.user._id;
    const { recipient, content } = req.body;

    if (!isValidObjectId(recipient)) {
      return res.status(400).json({ message: "Invalid recipient ID." });
    }

    if (!content.trim()) {
      return res.status(400).json({ message: "Message cannot be empty." });
    }

    const newMessage = new Message({ sender, recipient, content });
    await newMessage.save();

    res.status(201).json({ message: "Reply sent successfully", messageData: newMessage });
  } catch (error) {
    console.error("Error sending reply:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

module.exports = router;
