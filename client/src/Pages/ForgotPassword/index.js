import React from "react";
import { Form, Input, Button, Divider, App as AntdApp } from "antd";
import { Link } from "react-router-dom";
import { ForgotPassword as ForgotPasswordAPI } from "../../apicalls/users";
import { useDispatch } from "react-redux";
import { Setloader } from "../../Redux/loadersSlice";

const rules = [
  {
    required: true,
    message: "required",
  },
];

function ForgotPassword() {
  const { message } = AntdApp.useApp();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(Setloader(true));
      const response = await ForgotPasswordAPI(values.email);
      dispatch(Setloader(false));
      if (response.success) {
        message.success(response.message);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(Setloader(false));
      message.error(error.message);
    }
  };

  return (
    <div className="h-screen bg-primary flex justify-center items-center">
      <div className="bg-white p-5 rounded w-[450px]">
        <h1 className="text-primary text-2xl">
          SHSP - <span className="text-gray-400">Forgot Password</span>
        </h1>
        <Divider />
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              ...rules,
              {
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input type="email" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            className="mt-2 h-12 rounded-lg bg-primary hover:bg-blue-600 font-medium transition-colors"
            style={{ backgroundColor: "#3b82f6", borderColor: "#3b82f6" }}
          >
            Send Reset Link
          </Button>

          <div className="mt-5 text-center">
            <Link to="/login" className="text-primary">
              Back to Login
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default ForgotPassword;
