const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/User");
const Message = require("../models/Message");

// ✅ Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ✅ GET /api/users → Fetch users for recipient selection
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("fullName email _id");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error. Try again later." });
  }
});


// ✅ POST /api/messages/send → Send a new message
router.post("/messages/send", async (req, res) => {
  try {
    const { sender, recipient, content } = req.body;

    // 🔴 Check if required fields are missing
    if (!sender || !recipient || !content) {
      return res.status(400).json({ message: "All fields (sender, recipient, content) are required." });
    }

    // 🔴 Validate sender & recipient (Ensure they exist)
    const senderExists = await User.findById(sender);
    const recipientExists = await User.findById(recipient);

    if (!senderExists || !recipientExists) {
      return res.status(404).json({ message: "Sender or recipient not found." });
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


// ✅ GET /api/messages → Fetch recent messages
router.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find()
      .populate("sender", "fullName")
      .populate("recipient", "fullName")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// ✅ GET /api/messages/recent → Fetch recent conversations
router.get("/messages/recent/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
  
      if (!isValidObjectId(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
  
      const messages = await Message.find({
        $or: [{ sender: userId }, { recipient: userId }],
      })
        .populate("sender", "fullName email")
        .populate("recipient", "fullName email")
        .sort({ createdAt: -1 })
        .limit(10); // Fetch last 10 messages
  
      res.status(200).json(messages);
    } catch (error) {
      console.error("Error fetching recent conversations:", error);
      res.status(500).json({ message: "Server error. Try again later." });
    }
  });
  
  
  // ✅ POST /api/messages/reply → Reply to a message
  router.post("/messages/reply", async (req, res) => {
    try {
      const { sender, recipient, content } = req.body;
  
      if (!isValidObjectId(sender) || !isValidObjectId(recipient)) {
        return res.status(400).json({ message: "Invalid sender or recipient ID." });
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
