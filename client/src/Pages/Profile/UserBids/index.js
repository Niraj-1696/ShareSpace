import React, { useEffect } from "react";
import { Table, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { GetAllBids } from "../../../apicalls/products";
import { Setloader } from "../../../Redux/loadersSlice";
import { useNavigate } from "react-router-dom";

function UserBids() {
  const [bidsData, setBidsData] = React.useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);

  const getData = async () => {
    try {
      if (!user?._id) return;
      dispatch(Setloader(true));
      const response = await GetAllBids({ buyer: user._id });
      dispatch(Setloader(false));
      if (response.success) {
        setBidsData(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(Setloader(false));
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <img
            src={record.product?.images?.[0]}
            alt=""
            className="w-16 h-16 object-cover rounded-md"
          />
          <div>
            <p className="font-semibold">{record.product?.name}</p>
            <p className="text-sm text-gray-500">₹ {record.product?.price}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Seller",
      dataIndex: "seller",
      render: (text, record) => (
        <div>
          <p>{record.seller?.name}</p>
        </div>
      ),
    },
    {
      title: "Bid Amount",
      dataIndex: "bidAmount",
      render: (text, record) => (
        <span className="font-semibold text-blue-600">
          ₹ {record.bidAmount}
        </span>
      ),
    },
    {
      title: "Bid Date",
      dataIndex: "createdAt",
      render: (text, record) =>
        moment(record.createdAt).format("MMM DD YYYY, h:mm A"),
    },
    {
      title: "Message",
      dataIndex: "message",
      render: (text) => (
        <div className="max-w-xs truncate" title={text}>
          {text}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            (record.status || "pending") === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : (record.status || "pending") === "accepted"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {(record.status || "pending").toUpperCase()}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="flex flex-col gap-1">
          <span
            className="text-primary underline cursor-pointer hover:text-blue-600 text-sm"
            onClick={() => navigate(`/product/${record.product?._id}`)}
          >
            View Product
          </span>
          {record.status === "accepted" && (
            <div className="text-xs">
              <div className="font-medium text-green-600">✅ Accepted!</div>
              <div className="text-gray-600">
                <div>📧 Contact: {record.seller?.email}</div>
              </div>
            </div>
          )}
          {record.status === "rejected" && (
            <div className="text-xs text-red-600 font-medium">❌ Rejected</div>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (user?._id) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-xl font-semibold text-gray-800">My Bids</h1>
      <Table
        columns={columns}
        dataSource={bidsData}
        rowKey={(r) => r._id}
        pagination={{ pageSize: 10 }}
        locale={{
          emptyText: (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No bids placed yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Start bidding on products to see them here
              </p>
            </div>
          ),
        }}
      />
    </div>
  );
}

export default UserBids;
