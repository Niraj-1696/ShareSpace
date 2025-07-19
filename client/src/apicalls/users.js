// src/apicalls/users.js
import { axiosInstance } from "./axiosinstance";

// ✅ Correct export
export const RegisterUser = async (payload) => {
  console.log("RegisterUser called", payload); // optional debug
  const response = await axiosInstance.post("/api/users/register", payload);
  return response.data;
};

export const LoginUser = async (payload) => {
  const response = await axiosInstance.post("/api/users/login", payload);
  return response.data;
};

// get current user
export const GetCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/api/users/get-current-user", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};
