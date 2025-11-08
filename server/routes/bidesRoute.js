const router = require("express").Router();
const Bid = require("../models/bidModel");
const Notification = require("../models/notificationModel");
const authMiddleware = require("../middlwares/authMiddleware");

// place a new bid
router.post("/place-new-bid", authMiddleware, async (req, res) => {
  try {
    const { product, seller, buyer } = req.body;

    // Check if any bid on this product has been accepted (bidding closed)
    const acceptedBid = await Bid.findOne({
      product: product,
      status: "accepted",
    });

    if (acceptedBid) {
      return res.send({
        success: false,
        message:
          "Bidding is closed for this product. A bid has already been accepted.",
      });
    }

    // Check for duplicate pending bid from same user
    const existingBid = await Bid.findOne({
      product: product,
      buyer: buyer,
      status: "pending",
    });

    if (existingBid) {
      return res.send({
        success: false,
        message:
          "You already have a pending bid on this product. Wait for seller response or contact them directly.",
      });
    }

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

// respond to a bid (accept/reject)
router.put("/respond-to-bid/:bidId", authMiddleware, async (req, res) => {
  try {
    const { action, message } = req.body; // 'accept' or 'reject'
    const bidId = req.params.bidId;

    if (!["accept", "reject"].includes(action)) {
      return res.send({
        success: false,
        message: "Invalid action. Use 'accept' or 'reject'",
      });
    }

    const bid = await Bid.findById(bidId).populate("buyer product seller");

    if (!bid) {
      return res.send({
        success: false,
        message: "Bid not found",
      });
    }

    // Check if the current user is the seller
    if (bid.seller._id.toString() !== req.userId) {
      return res.send({
        success: false,
        message: "Only the product seller can respond to this bid",
      });
    }

    // Check if bid is still pending
    if (bid.status !== "pending") {
      return res.send({
        success: false,
        message: `Bid has already been ${bid.status}`,
      });
    }

    // Update bid status
    const updatedBid = await Bid.findByIdAndUpdate(
      bidId,
      {
        status: action === "accept" ? "accepted" : "rejected",
        respondedAt: new Date(),
        sellerResponse: message || "",
      },
      { new: true }
    ).populate("buyer product seller");

    // Create notification for buyer
    const notificationTitle =
      action === "accept" ? "Bid Accepted! 🎉" : "Bid Response";
    const notificationMessage =
      action === "accept"
        ? `Great news! Your bid of ₹${bid.bidAmount} for "${bid.product.name}" has been accepted. Contact the seller to proceed.`
        : `Your bid of ₹${bid.bidAmount} for "${
            bid.product.name
          }" has been rejected.${
            message ? ` Seller's message: ${message}` : ""
          }`;

    const newNotification = new Notification({
      user: bid.buyer._id,
      title: notificationTitle,
      message: notificationMessage,
      onClick: `/profile?tab=UserBids`,
      read: false,
    });

    await newNotification.save();

    res.send({
      success: true,
      message: `Bid ${action}ed successfully`,
      data: updatedBid,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
