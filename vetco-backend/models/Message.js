const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }, // ✅ Index for faster lookups
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }, // ✅ Index for faster lookups
  content: { type: String, required: true },
  read: { type: Boolean, default: false }, // ✅ Track unread messages
}, { timestamps: true }); // ✅ Automatically adds createdAt & updatedAt fields

module.exports = mongoose.model("Message", MessageSchema);
