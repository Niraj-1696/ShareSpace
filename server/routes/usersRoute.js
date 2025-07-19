const router = require("express").Router();
const User = require("../models/usermodel"); // ✅ Capitalize model name for clarity
const bcrypt = require("bcryptjs"); // ✅ Fix typo from `bcrpt`
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlwares/authMiddleware");

// ✅ New user registration
router.post("/register", async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt); // ✅ Fix typo from 'hashedOassword'

    req.body.password = hashedPassword;

    // Save user
    const newUser = new User(req.body);
    await newUser.save(); // ✅ Fix typo from `saver()`

    res.send({
      success: true,
      message: "User created successfully",
      user: newUser, // 🔁 Add if you want to send back user data
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// ✅ User login
router.post("/login", async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("User not found");
    }

    // Compare password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    ); // ✅ Fix typo from `bscrypt.compared`

    if (!validPassword) {
      throw new Error("Invalid password");
    }

    // Create & assign token
    const token = jwt.sign({ userid: user._id }, process.env.jwt_secret);

    // Send response
    res.send({
      success: true,
      message: "User logged in successfully",
      data: token,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get current user
router.get("/get-current-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    res.send({
      success: true,
      message: "User fetched successfully",
      data: User,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});
module.exports = router;
