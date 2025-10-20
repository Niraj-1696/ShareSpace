const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
require("dotenv").config();
const dbconfig = require("./config/dbconfig");
const port = process.env.PORT || 5000;

// ✅ Proper CORS for credentials
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // include auth header
    credentials: true,
  })
);

const usersRoute = require("./routes/usersRoute");
const productsRoute = require("./routes/productsRoute");
const bidsRoute = require("./routes/bidesRoute");
const notificationsRoute = require("./routes/notificationsRoute");

app.use("/api/notifications", notificationsRoute);
app.use("/api/bids", bidsRoute);
app.use("/api/users", usersRoute);
app.use("/api/products", productsRoute);

app.listen(port, () =>
  console.log(`✅ Server running on http://localhost:${port}`)
);
