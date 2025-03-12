const mongoose = require("mongoose");
const doctorSchema = new mongoose.Schema({
    name: String,
    expertise: String,
    location: String,
    contact: String,
    availability: String,
    profilePic: String,
  });

  module.exports = mongoose.model("doctor", doctorSchema);