const express = require("express");
const router = require("./home");
const userrouter = require("./userroutes");
const cors = require("cors");
const mongoose = require("mongoose");

// MongoDB Connection
const mongoUri =
  process.env.MONGODB_URI ||
  "mongodb+srv://2004vimal:zaq1%40wsx@cluster0.kfsrfxi.mongodb.net/";

mongoose
  .connect(mongoUri)
  .then(() => console.log("Mongo DB connected!"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

const app = express();
app.use(express.json());
app.use(cors());

// ✅ **Security Headers**
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY"); // Prevent Clickjacking
  res.setHeader("X-Content-Type-Options", "nosniff"); // Prevent MIME sniffing
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload"); // Force HTTPS
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; object-src 'none'"); // CSP
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private"); // Disable caching
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=()"); // Restrict browser features
  res.setHeader("X-Powered-By", ""); // Hide Express.js version
  next();
});

// Routes
app.use("/", router);
app.use("/api/users", userrouter);

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
