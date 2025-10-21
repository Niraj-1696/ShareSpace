const router = require("express").Router();
const Bid = require("../models/bidModel");
const authMiddleware = require("../middlwares/authMiddleware");

// place a new bid
router.post("/place-new-bid", authMiddleware, async (req, res) => {
  try {
    const newBid = new Bid(req.body);
    await newBid.save();
    res.send({
      success: true,
      message: "Bid placed successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//get all bids
router.post("/get-all-bids", authMiddleware, async (req, res) => {
  try {
    const { product, seller, buyer } = req.body;
    let filter = {};
    if (product) filter.product = product;
    if (seller) filter.seller = seller;
    if (buyer) filter.buyer = buyer;
    const bids = await Bid.find(filter)
      .populate("product")
      .populate("buyer")
      .populate("seller")
      .sort({ createdAt: -1 });
    res.send({
      success: true,
      data: bids,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
