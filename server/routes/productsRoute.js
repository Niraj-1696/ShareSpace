const router = require("express").Router();
const Product = require("../models/productModel");
const authMiddleware = require("../middlwares/authMiddleware");
const cloudinary = require("../config/cloudinaryConfig");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

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
      status,
      seller: req.userId,
    });

    await newProduct.save();

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
    const { seller, categories = [], age = [] } = req.body;
    let filters = {};
    if (seller) {
      filters.seller = seller;
    }
    // build the query, populate seller, then await the final result
    const products = await Product.find(filters).populate("seller").sort({
      createdAt: -1,
      _id: -1,
    });
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
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

module.exports = router;
