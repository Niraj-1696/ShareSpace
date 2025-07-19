import React from "react";
import { Form, Input, Button, Divider, App as AntdApp } from "antd";
import { Link } from "react-router-dom";
import { RegisterUser } from "../../apicalls/users.js";

const rules = [
  {
    required: true,
    message: "Required",
  },
];

function Register() {
  const { message } = AntdApp.useApp(); // ✅ use AntD context-safe message

  const onFinish = async (values) => {
    try {
      const response = await RegisterUser(values);
      if (response.success) {
        message.success(response.message);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div className="h-screen bg-primary flex justify-center items-center">
      <div className="bg-white p-5 rounded w-[450px]">
        <h1 className="text-primary text-2xl">
          SHSP - <span className="text-gray-400">REGISTER</span>
        </h1>
        <Divider />
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Name" name="name" rules={rules}>
            <Input placeholder="Name" autoComplete="name" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={rules}>
            <Input placeholder="Email" autoComplete="email" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={rules}>
            <Input.Password
              placeholder="Password"
              autoComplete="new-password"
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" block className="mt-2">
            Register
          </Button>

          <div className="mt-5 text-center">
            <span className="text-gray-500">
              Already have an account?{" "}
              <Link to="/Login" className="text-primary">
                Login
              </Link>
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Register;
