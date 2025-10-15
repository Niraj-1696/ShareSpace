import React, { useEffect } from "react";
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
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const formRef = React.useRef(null);

  const onFinish = async (values) => {
    try {
      dispatch(Setloader(true));
      let response = null;
      if (selectedProduct) {
        response = await EditProduct(selectedProduct._id, values);
      } else {
        values.seller = user._id;
        values.status = "pending";
        values.images = []; // temp - should come from upload logic later
        response = await AddProduct(values);
      }
      dispatch(Setloader(false));
      if (response.success) {
        message.success(response.message);
        setShowProductForm(false);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(Setloader(false));
      message.error(error.message);
    }
  };
  useEffect(() => {
    if (selectedProduct) {
      formRef.current.setFieldsValue(selectedProduct);
    }
  }, [selectedProduct]);

  return (
    <Modal
      title="Add Product"
      open={showProductForm}
      onCancel={() => setShowProductForm(false)}
      centered
      width={1000}
      okText="Save"
      onOk={() => formRef.current.submit()}
    >
      <div>
        <h1 className="text-primary text-2xl text-center font-semibold uppercase">
          {selectedProduct ? "Edit Product" : "Add Product"}
        </h1>
        <Form layout="vertical" ref={formRef} onFinish={onFinish}>
          <Tabs
            defaultActiveKey="1"
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
                        <Form.Item
                          label="Category"
                          name="category"
                          rules={rules}
                        >
                          <Select placeholder="Select Category">
                            <Option value="electronics">Electronics</Option>
                            <Option value="fashion">Fashion</Option>
                            <Option value="home">Home</Option>
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

                    {/* Hidden field for images until upload works */}
                    <Form.Item name="images" initialValue={[]} hidden>
                      <Input />
                    </Form.Item>
                  </>
                ),
              },
              {
                key: "2",
                label: "Images",
                children: <h1>Image Upload Coming Soon</h1>,
              },
            ]}
          />
        </Form>
      </div>
    </Modal>
  );
}

export default ProductsForm;
