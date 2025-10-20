const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    images: {
      type: [String], // specify type of array elements
      default: [],
    },
    billAvailable: {
      type: Boolean,
      default: false,
    },
    warrentyAvailable: {
      type: Boolean,
      default: false,
    },
    accessoriesAvailable: {
      type: Boolean,
      default: false,
    },
    boxAvailable: {
      type: Boolean,
      default: false,
    },
    // Controls whether to show bids section on public product page
    showBidsOnProductPage: {
      type: Boolean,
      default: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "blocked"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("products", productSchema);
