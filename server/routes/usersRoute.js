const router = require("express").Router();
const User = require("../models/usermodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlwares/authMiddleware");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

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
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

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

// forgot password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save reset token to user
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
    await user.save();

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send reset email
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${resetUrl}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);

    res.send({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// reset password
router.post("/reset-password/:token", async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.send({
      success: true,
      message: "Password reset successful",
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
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Return minimal user info including id and role so frontend can use it
    res.send({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// get all users
router.get("/get-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.send({
      success: true,
      data: users,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
