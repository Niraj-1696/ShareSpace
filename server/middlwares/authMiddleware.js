const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.header("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        message: "Authorization header missing or malformed",
      });
    }

    const token = authHeader.split(" ")[1];
    console.log("🛡️ Incoming Token:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded Token:", decoded);
    req.userId = decoded.userId; // ✅ Fixed

    next();
  } catch (error) {
    res.status(401).send({
      success: false,
      message: error.message,
    });
  }
};
