import React, { useEffect } from "react";
import { Form, Input, Button, Divider, App as AntdApp } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../../apicalls/users";
import { useDispatch } from "react-redux";
import { Setloader } from "../../Redux/loadersSlice";
const rules = [
  {
    required: true,
    message: "required",
  },
];

function Login() {
  const { message } = AntdApp.useApp(); // Correct now
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(Setloader(true));
      const response = await LoginUser(values);
      dispatch(Setloader(false));
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        window.location.href = "/";
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
      <div className="bg-white p-8 rounded-lg w-[450px] shadow-xl">
        <h1 className="text-primary text-2xl font-bold">
          ShareSpace{" "}
          <span className="text-gray-400 text-2xl font-normal">LOGIN</span>
        </h1>
        <Divider />
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email" rules={rules}>
            <Input placeholder="Email" className="rounded-lg" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={rules}>
            <Input
              type="password"
              placeholder="Password"
              className="rounded-lg"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            className="mt-2 h-12 rounded-lg bg-primary hover:bg-blue-600 font-medium transition-colors"
          >
            Login
          </Button>

          <div className="mt-3 text-center">
            <Link
              to="/forgot-password"
              className="text-primary hover:text-blue-600 transition-colors text-sm"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="mt-5 text-center">
            <span className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary hover:text-blue-600 font-medium transition-colors"
              >
                Register
              </Link>
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;
