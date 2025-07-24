import React from "react";
import { Modal, Tabs, Form } from "antd";
import TextArea from "antd/es/input/TextArea";
import Input from "antd/es/input/Input";

function ProductsForm({ showProductForm, setShowProductForm }) {
  return (
    <Modal
      tittle=""
      open={showProductForm}
      onCancel={() => setShowProductForm(false)}
      centered
      width={1000}
    >
      <Tabs>
        <Tabs.TabPane tab="General" key="1">
          <Form layout="vertical">
            <Form.Item label="Name" name="name">
              <Input type="text" />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <TextArea type="text" />
            </Form.Item>

            <Row>
              <Col span={8}>
                <Form.Item label="Price" name="price">
                  <Input type="number" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Category" name="category">
                  <select>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="home">Home</option>
                    <option value="sports">Sports</option>
                  </select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Images" key="2">
          <h1>Images</h1>
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
}

export default ProductsForm;
