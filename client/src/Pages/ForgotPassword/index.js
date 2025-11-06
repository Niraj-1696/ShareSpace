import React from "react";
import { Form, Input, Button, Divider, App as AntdApp, Alert } from "antd";
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
  const [emailSent, setEmailSent] = React.useState(false);
  const [emailAddress, setEmailAddress] = React.useState("");

  const onFinish = async (values) => {
    try {
      dispatch(Setloader(true));
      const response = await ForgotPasswordAPI(values.email);
      dispatch(Setloader(false));

      if (response.success) {
        setEmailSent(true);
        setEmailAddress(values.email);
        message.success("Password reset email sent! Please check your inbox.");
      } else {
        throw new Error(response.message || "Failed to send reset email");
      }
    } catch (error) {
      dispatch(Setloader(false));
      message.error(
        error.message || "Failed to send reset email. Please try again."
      );
    }
  };

  if (emailSent) {
    return (
      <div className="h-screen bg-primary flex justify-center items-center">
        <div className="bg-white p-5 rounded w-[450px]">
          <h1 className="text-primary text-2xl">
            ShareSpace - <span className="text-gray-400">Email Sent!</span>
          </h1>
          <Divider />
          <Alert
            message="Check Your Email"
            description={`We've sent a password reset link to ${emailAddress}. Please check your inbox and click the link to reset your password. The link will expire in 1 hour.`}
            type="success"
            showIcon
            className="mb-4"
          />
          <div className="mt-5 text-center space-y-2">
            <div>
              <Button
                type="link"
                onClick={() => setEmailSent(false)}
                className="text-primary hover:text-blue-600"
              >
                Send Another Email
              </Button>
            </div>
            <div>
              <Link to="/login" className="text-primary hover:text-blue-600">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-primary flex justify-center items-center">
      <div className="bg-white p-5 rounded w-[450px]">
        <h1 className="text-primary text-2xl">
          ShareSpace - <span className="text-gray-400">Forgot Password</span>
        </h1>
        <Divider />
        <Alert
          message="Reset Your Password"
          description="Enter your email address and we'll send you a link to reset your password."
          type="info"
          showIcon
          className="mb-4"
        />
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
