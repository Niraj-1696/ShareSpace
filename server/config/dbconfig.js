const mongoose = require("mongoose");
require("dotenv").config(); // ✅ To load .env variables

mongoose
  .connect(process.env.MONGO_URL, {
    ssl: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((error) =>
    console.error("❌ MongoDB Connection Failed:", error.message)
  );

module.exports = mongoose.connection;
