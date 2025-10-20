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

// get product by id
export const GetProductById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/products/get-product/${id}`);
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

    // Return raw response shape; UI components will handle messages
    return response.data;
  } catch (error) {
    // Return a consistent error object; no UI side-effects here
    return error.response?.data || { success: false, message: error.message };
  }
};

// update product status
export const UpdateProductStatus = async (id, status) => {
  try {
    console.log("Updating status:", { id, status }); // Debug log
    const response = await axiosInstance.put(
      `/api/products/update-product-status/${id}`,
      { status }
    );
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to update status");
    }
  } catch (error) {
    console.error("Status update error:", error);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

// place a new bid
export const PlaceNewBid = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/bids/place-new-bid",
      payload
    );
    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// get all bids
export const GetAllBids = async (filters = {}) => {
  try {
    const response = await axiosInstance.post(
      "/api/bids/get-all-bids",
      filters
    );
    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};
