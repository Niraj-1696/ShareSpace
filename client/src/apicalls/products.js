import { axiosInstance } from "./axiosinstance";
import { message } from "antd";
// add a new product
export const AddProduct = async (productData) => {
  try {
    const response = await axiosInstance.post(
      "/api/products/add-product",
      productData
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
};

// get all products
export const GetProducts = async (filters = {}) => {
  try {
    const response = await axiosInstance.post(
      "/api/products/get-products",
      filters
    );
    return response.data;
  } catch (error) {
    // return a consistent error object shape
    return { success: false, message: error.message };
  }
};

// edit a product
export const EditProduct = async (id, payload) => {
  try {
    const response = await axiosInstance.put(
      `/api/products/edit-product/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// delete a product
export const DeleteProduct = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `/api/products/delete-product/${id}`
    );
    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// upload product image
export const UploadProductImage = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/products/upload-image-to-product",
      payload,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (response.data.success) {
      message.success(response.data.message || "Image uploaded successfully");
      return response.data; // contains success and imageUrl
    } else {
      message.error(response.data.message || "Upload failed");
      return { success: false };
    }
  } catch (error) {
    const err = error.response?.data || {
      success: false,
      message: error.message,
    };
    message.error(err.message || "Upload failed");
    return err;
  }
};
