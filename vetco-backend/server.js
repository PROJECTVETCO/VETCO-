const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
// ✅ Configure CORS
// ✅ Configure CORS properly
app.use(
  cors({
    origin: ["http://localhost:3000", "https://vetco-n9qd.vercel.app", "https://vetco.onrender.com/**"], // ✅ Add your frontend domains
    credentials: true, // ✅ Allows cookies & authorization headers
    methods: ["GET", "POST", "PUT", "DELETE"], // ✅ Specify allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allow token authentication
  })
);
// ✅ Ensure CORS headers are set for all responses
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});


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
const vetRoutes = require("./routes/vetRoutes");
const doctorRoutes = require("./routes/doctorRoutes")
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", messageRoutes); // Register message routes
app.use("/api/records", recordRoutes);
app.use("/api/vet", vetRoutes);
app.use("/api/doctor", doctorRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
