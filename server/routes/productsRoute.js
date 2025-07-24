const router = require("express").Router();
const Product = require("../models/productModel");
const authMiddleware = require("../middlwares/authMiddleware");

// ✅ Add a new product
router.post("/add-product", authMiddleware, async (req, res) => {
  try {
    // `authMiddleware` sets req.user to the userId (string)
    req.body.seller = req.user;
    req.body.status = "pending"; // default status

    const newProduct = new Product(req.body);
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

module.exports = router;
