const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Configure CORS
// ✅ Configure CORS properly
app.use(
  cors({
    origin: ["http://localhost:3000", "https://vetco-n9qd.vercel.app"], // ✅ Add your frontend domains
    credentials: true, // ✅ Allows cookies & authorization headers
    methods: ["GET", "POST", "PUT", "DELETE"], // ✅ Specify allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allow token authentication
  })
);
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const messageRoutes = require("./routes/messageRoutes");
const recordRoutes = require("./routes/recordRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", messageRoutes); // Register message routes
app.use("/api/records", recordRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
