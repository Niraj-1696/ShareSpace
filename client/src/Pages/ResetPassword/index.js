import React, { useEffect, useState } from "react";
import { Form, Input, Button, Divider, App as AntdApp, Alert } from "antd";
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
  const [tokenValid, setTokenValid] = useState(true);

  // Check if token exists
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      message.error("Invalid reset link. Please request a new password reset.");
    }
  }, [token, message]);

  const onFinish = async (values) => {
    if (!token) {
      message.error("Invalid reset token");
      return;
    }

    try {
      dispatch(Setloader(true));
      const response = await ResetPasswordAPI(token, values.password);
      dispatch(Setloader(false));

      if (response.success) {
        message.success(
          "Password reset successful! You can now login with your new password."
        );
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        throw new Error(response.message || "Failed to reset password");
      }
    } catch (error) {
      dispatch(Setloader(false));
      message.error(
        error.message || "Failed to reset password. Please try again."
      );
    }
  };

  if (!tokenValid) {
    return (
      <div className="h-screen bg-primary flex justify-center items-center">
        <div className="bg-white p-5 rounded w-[450px]">
          <h1 className="text-primary text-2xl">
            ShareSpace - <span className="text-gray-400">Reset Password</span>
          </h1>
          <Divider />
          <Alert
            message="Invalid Reset Link"
            description="This reset link is invalid or has expired. Please request a new password reset."
            type="error"
            showIcon
            className="mb-4"
          />
          <div className="mt-5 text-center">
            <Link
              to="/forgot-password"
              className="text-primary hover:text-blue-600 font-medium"
            >
              Request New Reset Link
            </Link>
            <span className="mx-2">|</span>
            <Link
              to="/login"
              className="text-primary hover:text-blue-600 font-medium"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-primary flex justify-center items-center">
      <div className="bg-white p-5 rounded w-[450px]">
        <h1 className="text-primary text-2xl">
          ShareSpace - <span className="text-gray-400">Reset Password</span>
        </h1>
        <Divider />
        {token && (
          <Alert
            message="Reset Your Password"
            description="Please enter your new password below. Make sure it's strong and secure."
            type="info"
            showIcon
            className="mb-4"
          />
        )}
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

          <Button
            type="primary"
            htmlType="submit"
            block
            className="mt-2 h-12 rounded-lg bg-primary hover:bg-blue-600 font-medium transition-colors"
            style={{ backgroundColor: "#3b82f6", borderColor: "#3b82f6" }}
          >
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
