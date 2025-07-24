import { axiosInstance } from "./axiosinstance";

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
export const GetProducts = async () => {
  try {
    const response = await axiosInstance.get("/api/products/get-products");
    return response.data;
  } catch (error) {
    return error.message;
  }
};
