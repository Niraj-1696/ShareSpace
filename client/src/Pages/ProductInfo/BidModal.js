import React from "react";
import { Modal, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { PlaceNewBid } from "../../apicalls/products";
import { Setloader } from "../../Redux/loadersSlice";
import { message } from "antd";
import { AddNotification } from "../../apicalls/notifications";
function BidModal({ showBidModal, setShowBidModal, product, reloadData }) {
  const formref = React.useRef(null);
  const rules = [{ required: true, message: "Required" }];
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const onFinish = async (values) => {
    try {
      dispatch(Setloader(true));
      const response = await PlaceNewBid({
        ...values,
        product: product._id,
        seller: product.seller._id,
        buyer: user._id,
      });
      dispatch(Setloader(false));
      if (response.success) {
        message.success("Bid placed successfully");

        // send notification to seller
        await AddNotification({
          title: "A new bid has been placed",
          message: `A new bid of ₹${values.bidAmount} has been placed on your product "${product.name}" by ${user.name}.`,
          user: product.seller._id,
          onClick: `/profile`,
          read: false,
        });
        // Let app know a new notification has been created for someone
        window.dispatchEvent(new CustomEvent("notification-updated"));
        setShowBidModal(false);
        reloadData();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(Setloader(false));
      message.error(error.message);
    }
  };
  return (
    <Modal
      onCancel={() => setShowBidModal(false)}
      open={showBidModal}
      centered
      width={600}
      onOk={() => formref.current.submit()}
    >
      <div className="flex flex-col gap-5 mb-5">
        <h1 className="text-2xl font-semibold text-orange-900 text-center">
          New Bid
        </h1>

        <Form layout="vertical" ref={formref} onFinish={onFinish}>
          <Form.Item label="Bid Amount" name="bidAmount" rules={rules}>
            <Input />
          </Form.Item>
          <Form.Item label="Message" name="message" rules={rules}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Mobile" name="mobile" rules={rules}>
            <Input type="tel" />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}

export default BidModal;
