const router = require("express").Router();
const Product = require("../models/productModel");
const authMiddleware = require("../middlwares/authMiddleware");

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
    const products = await Product.find();

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

module.exports = router;
