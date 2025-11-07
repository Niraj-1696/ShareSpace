const express = require("express");
const router = express.Router();
const User = require("../models/usermodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlwares/authMiddleware");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const cloudinary = require("../config/cloudinaryConfig");
const multer = require("multer");
const Tesseract = require("tesseract.js");

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Registration with image upload and OCR
router.post("/register", upload.single("collegeIdImage"), async (req, res) => {
  try {
    // Check for duplicate email, psid, rollNo
    const { name, email, password, rollNo } = req.body;

    // Validate rollNo input
    if (!rollNo || !rollNo.trim()) {
      throw new Error("Roll No is required");
    }

    // Image file
    const file = req.file;
    if (!file) {
      throw new Error("College ID image is required");
    }

    // Upload image to Cloudinary using base64
    const base64Image = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;
    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      resource_type: "image",
      folder: "college_ids",
    });

    // Run OCR using Tesseract.js
    const ocrResult = await Tesseract.recognize(file.buffer, "eng");
    const text = ocrResult.data.text;

    // Extract only PSID using regex
    const psidMatch = text.match(/PSID[:\s]*([0-9]+)/i);
    const psid = psidMatch ? psidMatch[1] : null;
    if (!psid) {
      throw new Error(
        "Could not extract PSID from image. Please upload a clear image."
      );
    }

    // Check for duplicate PSID or Roll No
    const existingUser = await User.findOne({
      $or: [{ email }, { psid }, { rollNo: rollNo.trim() }],
    });
    if (existingUser) {
      throw new Error("User with this email, PSID, or Roll No already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      psid,
      rollNo: rollNo.trim(),
      collegeIdImage: uploadResult.secure_url,
      status: "pending",
    });
    await newUser.save();

    res.send({
      success: true,
      message: "User created successfully. Awaiting admin approval.",
      user: newUser,
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

    // Check if user is blocked
    if (user.status !== "active") {
      throw new Error("User is blocked , please contact admin");
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

    // Validate email input
    if (!email || !email.trim()) {
      return res.send({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.send({
        success: false,
        message: "No account found with this email address",
      });
    }

    // Check if user is active
    if (user.status !== "active") {
      return res.send({
        success: false,
        message: "Account is not active. Please contact admin.",
      });
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

    // Send reset email - Fixed to point to frontend URL
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "ShareSpace - Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #405138;">ShareSpace - Password Reset</h2>
          <p>Hello ${user.name},</p>
          <p>You are receiving this because you (or someone else) have requested a password reset for your ShareSpace account.</p>
          <p>Please click on the following button to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #405138; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #405138;">${resetUrl}</p>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you did not request this password reset, please ignore this email and your password will remain unchanged.</p>
          <hr style="margin: 30px 0; border: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">This email was sent from ShareSpace Campus Marketplace</p>
        </div>
      `,
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your ShareSpace account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${resetUrl}\n\n
        This link will expire in 1 hour.\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);

    res.send({
      success: true,
      message:
        "If an account with this email exists, you will receive a password reset link shortly.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.send({
      success: false,
      message: "Failed to process password reset request. Please try again.",
    });
  }
});

// reset password
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;

    // Validate password input
    if (!password || password.length < 6) {
      return res.send({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Hash the token from URL parameter
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.send({
        success: false,
        message:
          "Invalid or expired reset token. Please request a new password reset.",
      });
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log(`Password successfully reset for user: ${user.email}`);

    res.send({
      success: true,
      message:
        "Password reset successful! You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.send({
      success: false,
      message:
        "Failed to reset password. Please try again or request a new reset link.",
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

// update user status
router.put("/update-user-status/:id", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.send({
      success: true,
      message: "User status updated",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// delete user (admin only)
router.delete("/delete-user/:id", authMiddleware, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);

    // Check if current user is admin
    if (currentUser.role !== "admin") {
      return res.status(403).send({
        success: false,
        message: "Only admin users can delete accounts",
      });
    }

    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from deleting themselves
    if (req.params.id === req.userId) {
      return res.status(400).send({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    // Prevent deleting other admin users
    if (userToDelete.role === "admin") {
      return res.status(400).send({
        success: false,
        message: "Cannot delete other admin users",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    console.log(
      `👤 User deleted by admin: ${userToDelete.name} (${userToDelete.email})`
    );

    res.send({
      success: true,
      message: `User "${userToDelete.name}" has been successfully deleted`,
    });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
