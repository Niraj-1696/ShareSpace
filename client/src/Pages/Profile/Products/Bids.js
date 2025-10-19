import React, { useEffect } from "react";
import { Modal, Table, message } from "antd";
import { useDispatch } from "react-redux";
import { GetAllBids } from "../../../apicalls/products";
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

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => record.buyer.name,
    },
    {
      title: "Bid Amount",
      dataIndex: "bidAmount",
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
    },
    {
      title: "Contact Details",
      dataIndex: "contactDetails",
      render: (text, record) => {
        return (
          <div>
            <p>Email: {record.buyer.email}</p>
            <p>Phone: {record.mobile}</p>
          </div>
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
