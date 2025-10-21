const router = require("express").Router();
const Product = require("../models/productModel");
const authMiddleware = require("../middlwares/authMiddleware");
const cloudinary = require("../config/cloudinaryConfig");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Notification = require("../models/notificationModel");
const User = require("../models/usermodel");

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// -------------------- Product Routes -------------------- //

// Add a new product
router.post("/add-product", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      age,
      images,
      billAvailable,
      warrentyAvailable,
      accessoriesAvailable,
      boxAvailable,
      showBidsOnProductPage,
      status,
    } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      age,
      images,
      billAvailable,
      warrentyAvailable,
      accessoriesAvailable,
      boxAvailable,
      showBidsOnProductPage,
      status,
      seller: req.userId,
    });

    await newProduct.save();

    // Send Notification to admin
    const admins = await User.find({ role: "admin" });
    admins.forEach((admin) => {
      const newNotification = new Notification({
        user: admin._id,
        message: `A new product has been added: ${req.user.name}`,
        title: "New Product Added",
        onClick: `/admin`,
        read: false,
      });
      newNotification.save();
    });

    res.status(200).json({
      success: true,
      message: "Product added successfully",
    });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all products
router.post("/get-products", async (req, res) => {
  try {
    const {
      seller,
      status,
      category,
      categories = [],
      age = [], // array of range strings like ["0-1", "2-3"]
    } = req.body;

    // Build base AND clauses
    const andClauses = [];
    if (seller) andClauses.push({ seller });
    if (status) andClauses.push({ status: new RegExp(`^${status}$`, "i") });
    if (category) andClauses.push({ category });
    if (Array.isArray(categories) && categories.length > 0)
      andClauses.push({ category: { $in: categories } });

    // Apply age range filters if provided (as an OR inside the AND stack)
    if (Array.isArray(age) && age.length > 0) {
      const ageOrClauses = [];
      age.forEach((range) => {
        if (typeof range !== "string") return;
        const parts = range.split("-");
        if (parts.length !== 2) return;
        const min = Number(parts[0]);
        const max = Number(parts[1]);
        if (!Number.isNaN(min) && !Number.isNaN(max)) {
          ageOrClauses.push({ age: { $gte: min, $lte: max } });
        }
      });
      if (ageOrClauses.length > 0) {
        andClauses.push({ $or: ageOrClauses });
      }
    }

    const finalQuery =
      andClauses.length > 1 ? { $and: andClauses } : andClauses[0] || {};

    const products = await Product.find(finalQuery)
      .populate("seller")
      .sort({ createdAt: -1, _id: -1 });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get product by ID
router.get("/get-product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("seller");
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Edit a product
router.put("/edit-product/:id", authMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res
      .status(200)
      .json({ success: true, message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a product
router.delete("/delete-product/:id", authMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload image to product
router.post(
  "/upload-image-to-product",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file)
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      if (!req.body.productId)
        return res
          .status(400)
          .json({ success: false, message: "Missing productId" });

      const filePath = path.resolve(req.file.path);
      console.log("Uploading file to Cloudinary:", filePath);

      let result;
      try {
        result = await cloudinary.uploader.upload(filePath, {
          folder: "ShareSpace",
        });
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
        return res.status(500).json({
          success: false,
          message: "Cloudinary upload failed",
          error: err.message,
        });
      }

      await Product.findByIdAndUpdate(req.body.productId, {
        $push: { images: result.secure_url },
      });

      fs.unlinkSync(filePath); // delete temp file

      res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        data: result.secure_url,
      });
    } catch (err) {
      console.error("Image upload route error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// update product status
router.put("/update-product-status/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true } // return updated document
    );

    // Send Notification to seller about status update
    const newNotification = new Notification({
      user: product.seller,
      title: "Product Status Updated",
      message: `Your product "${product.name}" has been "${status}".`,
      onClick: `/profile`,
      read: false,
    });
    await newNotification.save();

    res.status(200).json({
      success: true,
      message: "Product status updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("❌ Error updating product status:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
