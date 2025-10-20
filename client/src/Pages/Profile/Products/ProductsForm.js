import React, { useEffect } from "react";
import Images from "./Images"; // ✅ make sure Images has default export
import {
  Modal,
  Tabs,
  Form,
  Row,
  Col,
  message,
  Checkbox,
  Input,
  Select,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useDispatch, useSelector } from "react-redux";
import { AddProduct, EditProduct } from "../../../apicalls/products";
import { Setloader } from "../../../Redux/loadersSlice";

const { Option } = Select;

const additionalThings = [
  { Label: "Bill Available", name: "billAvailable" },
  { Label: "Warrenty Available", name: "warrentyAvailable" },
  { Label: "Accessories Available", name: "accessoriesAvailable" },
  { Label: "Box Available", name: "boxAvailable" },
];

const rules = [{ required: true, message: "Required!" }];

function ProductsForm({
  showProductForm,
  setShowProductForm,
  selectedProduct,
  getData,
}) {
  // ❌ Your previous state declaration was incorrect
  // ✅ Correct useState syntax:
  const [selectedTab, setSelectedTab] = React.useState("1");

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const formRef = React.useRef(null);

  // Handle form submission
  const onFinish = async (values) => {
    try {
      dispatch(Setloader(true));
      let response = null;

      if (selectedProduct) {
        response = await EditProduct(selectedProduct._id, values);
      } else {
        values.seller = user._id;
        values.status = "pending";
        values.images = [];
        response = await AddProduct(values);
      }

      dispatch(Setloader(false));

      if (response.success) {
        message.success(response.message);
        // Only switch to Images tab when editing an existing product
        // For new products, remain on General tab to avoid rendering Images with null product
        if (selectedProduct) setSelectedTab("2");
        getData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(Setloader(false));
      message.error(error.message);
    }
  };

  // Reset or set form fields when modal opens
  useEffect(() => {
    if (selectedProduct) {
      formRef.current.setFieldsValue(selectedProduct);
    } else {
      formRef.current.resetFields();
    }
  }, [selectedProduct]);

  return (
    <Modal
      title={selectedProduct ? "Edit Product" : "Add Product"}
      open={showProductForm}
      onCancel={() => setShowProductForm(false)}
      centered
      width={1000}
      okText="Save"
      onOk={() => formRef.current.submit()}
      {...(selectedTab === "2" && { footer: false })}
    >
      <Form layout="vertical" ref={formRef} onFinish={onFinish}>
        <Tabs
          defaultActiveKey="1"
          activeKey={selectedTab}
          onChange={(key) => setSelectedTab(key)} // ✅ correct function call
          items={[
            {
              key: "1",
              label: "General",
              children: (
                <>
                  <Form.Item label="Name" name="name" rules={rules}>
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Description"
                    name="description"
                    rules={rules}
                  >
                    <TextArea />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="Price" name="price" rules={rules}>
                        <Input type="number" />
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label="Category" name="category" rules={rules}>
                        <Select placeholder="Select Category">
                          <Option value="electronics">Electronics</Option>
                          <Option value="fashion">Fashion</Option>
                          <Option value="books">Books</Option>
                          <Option value="sports">Sports</Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label="Age" name="age" rules={rules}>
                        <Input type="number" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <div className="flex gap-10">
                    {additionalThings.map((item) => (
                      <Form.Item
                        key={item.name}
                        name={item.name}
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox>{item.Label}</Checkbox>
                      </Form.Item>
                    ))}
                  </div>

                  {/* Show bids on product page */}
                  <div className="mt-3">
                    <Form.Item
                      name="showBidsOnProductPage"
                      valuePropName="checked"
                      initialValue={true}
                    >
                      <Checkbox>Show bids on product page</Checkbox>
                    </Form.Item>
                  </div>

                  {/* Hidden images field for future upload */}
                  <Form.Item name="images" initialValue={[]} hidden>
                    <Input />
                  </Form.Item>
                </>
              ),
            },
            {
              key: "2",
              label: "Images",
              disabled: !selectedProduct,
              children: (
                <Images
                  selectedProduct={selectedProduct}
                  getData={getData}
                  setShowProductForm={setShowProductForm}
                />
              ),
            },
          ]}
        />
      </Form>
    </Modal>
  );
}

export default ProductsForm;
