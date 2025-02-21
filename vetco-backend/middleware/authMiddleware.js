const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Received Token:", token); // ✅ Log token received on the backend

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token Data:", decoded); // ✅ Check decoded user details

      req.user = await User.findById(decoded.userId).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found." });
      }

      next();
    } catch (error) {
      console.error("Token Verification Error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.log("Authorization header missing");
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
