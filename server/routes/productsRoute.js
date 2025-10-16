const router = require("express").Router();
const Product = require("../models/productModel");
const authMiddleware = require("../middlwares/authMiddleware");
const { cloudinary_js_config } = require("../config/cloudinaryConfig");
const multer = require("multer");

// ✅ Add a new product
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
      seller: req.userId, // ✅ hard-coded last
    });

    await newProduct.save();

    res.send({
      success: true,
      message: "Product added successfully",
    });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// ✅ Get all products
router.get("/get-products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1, _id: -1 });
    res.send({
      success: true,
      products,
    });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// edit a product
router.put("/edit-product/:id", authMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.send({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// delete a product
router.delete("/delete-product/:id", authMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get image from pc
const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

router.post(
  "/upload-image-to-product",
  authMiddleware,
  multer({ storage: storage }).single("file"),
  async (req, res) => {
    try {
      // upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      const productId = req.body.probuctId;
      await Product.findByIdAndUpdate(productId, {
        $push: { images: result.secure_url },
      });
      res.send({
        success: true,
        message: "Image uploaded successfully",
        result,
      });
    } catch (error) {}
  }
);

module.exports = router;
