import React, { useEffect } from "react";
import { Modal, Table, message, Button } from "antd";
import { useDispatch } from "react-redux";
import { GetAllBids, RespondToBid } from "../../../apicalls/products";
import { Setloader } from "../../../Redux/loadersSlice";
import moment from "moment";
import Divider from "../../../Components/Divider";

// Correctly destructure props passed from parent
// Parent passes `product={selectedProduct}`; accept `product` here
function Bids({ showBidModal, setShowBidModal, product }) {
  const [bidsData, setBidsData] = React.useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      if (!product?._id) return;
      dispatch(Setloader(true));
      const response = await GetAllBids({ product: product._id });
      dispatch(Setloader(false));
      if (response.success) {
        setBidsData(response.data);
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
        getData(); // Reload bids to show updated status
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(Setloader(false));
      message.error("Failed to respond to bid");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => record.buyer?.name || "N/A",
    },
    {
      title: "Bid Amount",
      dataIndex: "bidAmount",
      render: (amount) => (
        <span className="font-semibold text-blue-600">₹ {amount}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            (status || "pending") === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : (status || "pending") === "accepted"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {(status || "pending").toUpperCase()}
        </span>
      ),
    },
    {
      title: "Bid Date",
      dataIndex: "createdAt",
      render: (text, record) =>
        moment(record.createdAt).format("MMM Do YYYY, h:mm a"),
    },
    {
      title: "Message",
      dataIndex: "message",
      render: (message) => (
        <div className="max-w-xs truncate" title={message}>
          {message || "No message"}
        </div>
      ),
    },
    {
      title: "Contact Details",
      dataIndex: "contactDetails",
      render: (text, record) => {
        if (record.status === "accepted") {
          return (
            <div className="text-sm">
              <p>Email: {record.buyer?.email}</p>
              <p>Mobile: {record.mobile}</p>
            </div>
          );
        } else if (record.status === "pending") {
          return (
            <div className="text-sm text-blue-600">
              <p>Available after acceptance</p>
            </div>
          );
        } else {
          return (
            <div className="text-sm text-gray-500">
              <p>Not available</p>
            </div>
          );
        }
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => {
        if (record.status === "pending") {
          return (
            <div className="flex gap-2">
              <Button
                type="primary"
                size="small"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleBidResponse(record._id, "accept")}
              >
                Accept
              </Button>
              <Button
                danger
                size="small"
                onClick={() => handleBidResponse(record._id, "reject")}
              >
                Reject
              </Button>
            </div>
          );
        }
        return (
          <span
            className={`text-sm ${
              record.status === "accepted" ? "text-green-600" : "text-red-600"
            }`}
          >
            {record.status === "accepted" ? "Accepted" : "Rejected"}
          </span>
        );
      },
    },
  ];

  useEffect(() => {
    if (showBidModal && product?._id) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showBidModal, product?._id]);

  return (
    <Modal
      title=""
      open={!!showBidModal}
      onCancel={() => setShowBidModal && setShowBidModal(false)}
      centered
      width={1500}
      footer={null}
    >
      <div className="flex flex-col gap-3">
        <h1 className=" text-primary">Bids</h1>
        <Divider />
        <h1 className="text-xl text-gray-500">
          Product Name : {product?.name || "-"}
        </h1>
        <Table columns={columns} dataSource={bidsData} rowKey={(r) => r._id} />
      </div>
    </Modal>
  );
}

export default Bids;
