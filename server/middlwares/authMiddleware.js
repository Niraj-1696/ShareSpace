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
    const decryptedToken = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Store in req.userId instead of req.body (which is undefined in GET requests)
    req.userId = decryptedToken.userId;

    next();
  } catch (error) {
    res.status(401).send({
      success: false,
      message: error.message,
    });
  }
};
