import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { message, Button } from "antd";
import {
  GetAllBids,
  GetProductById,
  GetProducts,
} from "../../apicalls/products";
import { Setloader } from "../../Redux/loadersSlice";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import BidModal from "./BidModal";
import Divider from "../../Components/Divider";

function ProductInfo() {
  const { user } = useSelector((state) => state.users);
  const [showAddNewBid, setShowAddNewBid] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [product, setProduct] = React.useState(null);
  const navigate = useNavigate();
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
  React.useEffect(() => {
    getData();
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
              <div className="flex justify-between mt-2">
                <span>Email</span>
                <span>{product.seller.email}</span>
              </div>
            </div>
            <Divider />
            {product.showBidsOnProductPage !== false && (
              <div className="flex flex-col">
                <div className="flex justify-between">
                  <h1 className="text-2xl font-semibold text-orange-900">
                    Bids
                  </h1>
                  <Button
                    onClick={() => setShowAddNewBid(!showAddNewBid)}
                    disabled={user._id === product.seller._id}
                  >
                    New Bid
                  </Button>
                </div>
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
                          <div className="flex justify-between mt-2">
                            <span className="font-semibold">
                              Bid Placed On :
                            </span>
                            <span>
                              {moment(bid.createdAt).format(
                                "MMM Do YYYY, h:mm a"
                              )}
                            </span>
                          </div>
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
            )}
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
