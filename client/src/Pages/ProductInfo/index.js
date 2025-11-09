import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { message, Button } from "antd";
import {
  GetAllBids,
  GetProductById,
  RespondToBid,
} from "../../apicalls/products";
import { Setloader } from "../../Redux/loadersSlice";
import { useParams } from "react-router-dom";
import moment from "moment";
import BidModal from "./BidModal";
import Divider from "../../Components/Divider";

function ProductInfo() {
  const { user } = useSelector((state) => state.users);
  const [showAddNewBid, setShowAddNewBid] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [product, setProduct] = React.useState(null);
  const dispatch = useDispatch();
  const { id } = useParams();
  const getData = async () => {
    try {
      dispatch(Setloader(true));
      const response = await GetProductById(id);
      dispatch(Setloader(false));
      if (response.success) {
        const bidsResponse = await GetAllBids({ product: id });
        setProduct({ ...response.data, bids: bidsResponse.data });
      }
    } catch (error) {
      dispatch(Setloader(false));
      message.error(error.message);
    }
  };

  const handleBidResponse = async (bidId, action) => {
    try {
      dispatch(Setloader(true));
      const response = await RespondToBid(bidId, action);
      dispatch(Setloader(false));

      if (response.success) {
        message.success(response.message);
        getData(); // Reload data to show updated bid status
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(Setloader(false));
      message.error("Failed to respond to bid");
    }
  };
  React.useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    product && (
      <div>
        <div className="grid grid-cols-2 gap-5 mt-5">
          {/*images*/}
          <div clasdssName="flex flex-col gap-5">
            <img
              src={product.images[selectedImageIndex]}
              alt=""
              className="w-full h-96 object-cover rounded-md"
            />

            <div className="flex gap-5">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  className={
                    "w-20 h-20 object-cover rounded-md cursor-pointer " +
                    (selectedImageIndex === index
                      ? "border-2 border-green-700 border-dashed p-2"
                      : "")
                  }
                  onClick={() => setSelectedImageIndex(index)}
                  src={image}
                  alt=""
                />
              ))}
            </div>
            <Divider />
            <div>
              <h1 className="text-gray-600">Added On</h1>
              <span className="text-gray-600">
                {moment(product.createdAt).format("MMMM Do , YYYY hh:mm A")}
              </span>
            </div>
          </div>

          {/*details*/}
          <div className="flex flex-col gap-3 ">
            <div>
              <h1 className="text-2xl font-semibold text-orange-900">
                {product.name}
              </h1>
              <span>{product.description}</span>
            </div>

            <Divider />
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold text-orange-900">
                Product Details
              </h1>
              <div className="flex justify-between mt-2">
                <span>Price</span>
                <span>₹ {product.price}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Category</span>
                <span className="uppercase">{product.category}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Bill Available</span>
                <span>{product.billAvailable ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Box Available</span>
                <span>{product.boxAvailable ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Accessories Available</span>
                <span>{product.accessoriesAvailable ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Warranty Available</span>
                <span>{product.warrantyAvailable ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Purchased Year</span>
                <span>
                  {moment().subtract(product.age, "years").format("YYYY")} (
                  {product.age}
                  {product.age > 1 ? " Years" : " Year"} Old)
                </span>
              </div>
            </div>
            <Divider />
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold text-orange-900">
                Seller Details
              </h1>
              <div className="flex justify-between mt-2">
                <span>Name</span>
                <span>{product.seller.name}</span>
              </div>
            </div>
            <Divider />
            {/* Bids header and New Bid button should always be visible */}
            <div className="flex flex-col">
              <div className="flex justify-between">
                <h1 className="text-2xl font-semibold text-orange-900">Bids</h1>
                <Button
                  onClick={() => setShowAddNewBid(!showAddNewBid)}
                  disabled={
                    user._id === product.seller._id ||
                    product.bids?.some((bid) => bid.status === "accepted")
                  }
                  title={
                    user._id === product.seller._id
                      ? "You cannot bid on your own product"
                      : product.bids?.some((bid) => bid.status === "accepted")
                      ? "Bidding closed - A bid has been accepted"
                      : "Place a new bid"
                  }
                >
                  New Bid
                </Button>
              </div>

              {/* Show bidding status */}
              {product.bids?.some((bid) => bid.status === "accepted") && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                  <span className="text-green-800 text-sm font-medium">
                    Bidding Closed - A bid has been accepted for this product
                  </span>
                </div>
              )}

              {/* Always show the bids list */}
              <div className="flex flex-col gap-3 mt-3">
                {product.bids && product.bids.length > 0 ? (
                  product.bids.map((bid) => {
                    return (
                      <div
                        key={bid._id}
                        className="border border-gray-400 border-solid p-3 rounded"
                      >
                        <div className="flex justify-between">
                          <span className="font-semibold">Name:</span>
                          <span>{bid.buyer?.name || "N/A"}</span>
                        </div>
                        <div className="flex justify-between mt-2">
                          <span className="font-semibold">Bid Amount:</span>
                          <span>₹ {bid.bidAmount}</span>
                        </div>
                        {user._id === product.seller._id && (
                          <div className="flex justify-between mt-2">
                            <span className="font-semibold">Mobile:</span>
                            <span className="text-sm">
                              Mobile: {bid.mobile}
                            </span>
                          </div>
                        )}
                        {user._id === product.seller._id && (
                          <div className="flex justify-between mt-2">
                            <span className="font-semibold">Message:</span>
                            <span className="text-sm">
                              {bid.message || "No message provided"}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between mt-2">
                          <span className="font-semibold">Status:</span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              bid.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : bid.status === "accepted"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {bid.status?.toUpperCase() || "PENDING"}
                          </span>
                        </div>
                        <div className="flex justify-between mt-2">
                          <span className="font-semibold">Bid Placed:</span>
                          <span className="text-sm text-blue-600 font-medium">
                            {moment(bid.createdAt).format(
                              "MMM Do YYYY, h:mm a"
                            )}
                          </span>
                        </div>

                        {/* Accept/Reject buttons for seller when bid is pending */}
                        {user._id === product.seller._id &&
                          bid.status === "pending" && (
                            <div className="flex gap-2 mt-3">
                              <Button
                                type="primary"
                                size="small"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() =>
                                  handleBidResponse(bid._id, "accept")
                                }
                              >
                                Accept
                              </Button>
                              <Button
                                danger
                                size="small"
                                onClick={() =>
                                  handleBidResponse(bid._id, "reject")
                                }
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-gray-500 text-center p-4">
                    No bids yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {showAddNewBid && (
          <BidModal
            showBidModal={showAddNewBid}
            setShowBidModal={setShowAddNewBid}
            product={product}
            reloadData={getData}
          />
        )}
      </div>
    )
  );
}

export default ProductInfo;
