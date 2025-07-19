import React, { useEffect } from "react";
import { Form, Input, Button, Divider, App as AntdApp } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { RegisterUser } from "../../apicalls/users.js";
import { useDispatch } from "react-redux";
import { Setloader } from "../../Redux/loadersSlice";
const rules = [
  {
    required: true,
    message: "Required",
  },
];

function Register() {
  const { message } = AntdApp.useApp();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(Setloader(true));
      const response = await RegisterUser(values);
      navigate("/login");
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

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

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
