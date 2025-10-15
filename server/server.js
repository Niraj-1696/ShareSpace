const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors()); // ✅ Add this line
app.use(express.json());
require("dotenv").config();
const dbconfig = require("./config/dbconfig");
const port = process.env.PORT || 5000;

const usersRoute = require("./routes/usersRoute");
const productsRoute = require("./routes/productsRoute");

app.use("/api/users", usersRoute);
app.use("/api/products", productsRoute);

app.listen(port, () =>
  console.log(`✅ Server running on http://localhost:${port}`)
);
