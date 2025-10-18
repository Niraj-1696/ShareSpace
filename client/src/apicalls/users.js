// src/apicalls/users.js
import { axiosInstance } from "./axiosinstance";

// ✅ Correct export
export const RegisterUser = async (payload, isMultipart = false) => {
  console.log("RegisterUser called", payload); // optional debug
  const config = isMultipart
    ? {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    : {};
  const response = await axiosInstance.post(
    "/api/users/register",
    payload,
    config
  );
  return response.data;
};

export const LoginUser = async (payload) => {
  const response = await axiosInstance.post("/api/users/login", payload);
  return response.data;
};

// get current user
export const ForgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post("/api/users/forgot-password", {
      email,
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};

export const ResetPassword = async (token, password) => {
  try {
    const response = await axiosInstance.post(
      `/api/users/reset-password/${token}`,
      { password }
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};

export const GetCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/api/users/get-current-user", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};

// get all users
export const GetAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/api/users/get-users");
    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// update user status
export const UpdateUserStatus = async (id, statusData) => {
  try {
    const payload =
      typeof statusData === "string" ? { status: statusData } : statusData;
    const response = await axiosInstance.put(
      `/api/users/update-user-status/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// update user status
export const UpdateUserRole = async (id, status) => {
  try {
    const response = await axiosInstance.put(
      `/api/users/update-user-role/${id}`,
      { status }
    );
    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};
