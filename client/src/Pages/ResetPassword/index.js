import React from "react";
import { Form, Input, Button, Divider, App as AntdApp } from "antd";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ResetPassword as ResetPasswordAPI } from "../../apicalls/users";
import { useDispatch } from "react-redux";
import { Setloader } from "../../Redux/loadersSlice";

const rules = [
  {
    required: true,
    message: "required",
  },
];

function ResetPassword() {
  const { message } = AntdApp.useApp();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const onFinish = async (values) => {
    try {
      dispatch(Setloader(true));
      const response = await ResetPasswordAPI(token, values.password);
      dispatch(Setloader(false));
      if (response.success) {
        message.success(response.message);
        navigate("/login");
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
          SHSP - <span className="text-gray-400">Reset Password</span>
        </h1>
        <Divider />
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="New Password"
            name="password"
            rules={[
              ...rules,
              {
                min: 6,
                message: "Password must be at least 6 characters",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              ...rules,
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit" block className="mt-2">
            Reset Password
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

export default ResetPassword;
