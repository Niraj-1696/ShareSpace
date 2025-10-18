import React, { useEffect, useState } from "react";
import { Form, Input, Button, Divider, App as AntdApp, Upload } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { RegisterUser } from "../../apicalls/users.js";
import { useDispatch } from "react-redux";
import { Setloader } from "../../Redux/loadersSlice";
import Tesseract from "tesseract.js";
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
  const [imageFile, setImageFile] = useState(null);
  const [psid, setPsid] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [ocrLoading, setOcrLoading] = useState(false);

  // Clean, single async onImageChange function
  const onImageChange = async (info) => {
    if (info.file.status === "removed") {
      setImageFile(null);
      setPsid("");
      setRollNo("");
      return;
    }
    let file =
      info.file && info.file.originFileObj
        ? info.file.originFileObj
        : info.file;
    if (!file || typeof file !== "object") {
      message.error("Invalid file. Please upload a valid image.");
      return;
    }
    setImageFile(file);
    setOcrLoading(true);
    try {
      const result = await Tesseract.recognize(file, "eng");
      const text = result.data.text;
      const psidMatch = text.match(/PSID[:\s]*([0-9]+)/i);
      const rollNoMatch = text.match(/ROLL\s*NO[:\s]*([0-9]+)/i);
      setPsid(psidMatch ? psidMatch[1] : "");
      setRollNo(rollNoMatch ? rollNoMatch[1] : "");
      if (!psidMatch || !rollNoMatch) {
        message.error(
          "Could not extract PSID or Roll No. Please upload a clear image."
        );
      }
    } catch (err) {
      message.error("OCR failed. Try again with a clearer image.");
      setPsid("");
      setRollNo("");
    }
    setOcrLoading(false);
  };

  const onReset = () => {
    setImageFile(null);
    setPsid("");
    setRollNo("");
  };

  const onFinish = async (values) => {
    if (!imageFile) {
      message.error("Please upload your college ID image.");
      return;
    }
    if (!psid || !rollNo) {
      message.error("PSID and Roll No must be extracted from image.");
      return;
    }
    try {
      dispatch(Setloader(true));
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("collegeIdImage", imageFile);
      // PSID and Roll No will be extracted server-side as well for validation
      const response = await RegisterUser(formData, true); // true: multipart
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
          <Form.Item label="College ID Image" required>
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={onImageChange}
              fileList={imageFile ? [{ uid: "1", name: imageFile.name }] : []}
            >
              <Button loading={ocrLoading} disabled={!!imageFile}>
                {imageFile ? "Image Uploaded" : "Upload College ID"}
              </Button>
            </Upload>
            {imageFile && (
              <Button type="default" onClick={onReset} className="mt-2">
                Reset
              </Button>
            )}
          </Form.Item>
          <Form.Item label="PSID" required>
            <Input value={psid} disabled placeholder="Extracted from image" />
          </Form.Item>
          <Form.Item label="Roll No" required>
            <Input value={rollNo} disabled placeholder="Extracted from image" />
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
