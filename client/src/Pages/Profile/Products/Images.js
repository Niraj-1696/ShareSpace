import { Button, message, Upload } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { Setloader } from "../../../Redux/loadersSlice";
import { EditProduct, UploadProductImage } from "../../../apicalls/products";

function Images({ selectedProduct, setShowProductForm, getData }) {
  const [showPreview, setShowPreview] = React.useState(true);
  const [images, setImages] = React.useState(selectedProduct?.images || []);
  const [file, setFile] = React.useState(null);
  const [fileList, setFileList] = React.useState([]); // control Upload list
  const dispatch = useDispatch();

  const upload = async () => {
    if (!selectedProduct?._id) {
      return message.error("Save the product first before uploading images.");
    }
    if (!file) return message.error("Please select a file");

    try {
      dispatch(Setloader(true));

      // Convert to raw File if AntD wraps it
      const rawFile = file.originFileObj || file;

      const formData = new FormData();
      formData.append("file", rawFile);
      formData.append("productId", selectedProduct._id);

      const response = await UploadProductImage(formData);

      if (response.success) {
        message.success(response.message);
        setImages([...images, response.data]);
        setShowPreview(false);
        getData();
        // clear current selection so next upload doesn't reuse previous file
        setFile(null);
        setFileList([]);
      } else {
        message.error(response.message || "Upload failed");
      }
    } catch (error) {
      message.error(error.message || "Upload failed");
    } finally {
      dispatch(Setloader(false));
    }
  };

  const deleteImage = async (image) => {
    if (!selectedProduct?._id) {
      return message.error("Save the product first before deleting images.");
    }
    try {
      dispatch(Setloader(true));
      const updatedImagesArray = images.filter((img) => img !== image);
      const updatedProduct = { ...selectedProduct, images: updatedImagesArray };
      const response = await EditProduct(selectedProduct._id, updatedProduct);

      if (response.success) {
        message.success(response.message);
        setImages(updatedImagesArray);
        getData();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(Setloader(false));
    }
  };

  return (
    <div>
      {!selectedProduct && (
        <div className="text-gray-500 mb-3">
          Save the product to enable image uploads.
        </div>
      )}
      <div className="flex gap-5 mb-5 flex-wrap">
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="flex gap-2 border border-solid border-gray-500 rounded p-2 items-end"
          >
            <img
              className="h-20 w-20 object-cover"
              src={image}
              alt={`Product ${index + 1}`}
            />
            <i
              className="ri-delete-bin-line cursor-pointer"
              onClick={() => deleteImage(image)}
            ></i>
          </div>
        ))}
      </div>
      <Upload
        accept="image/*"
        listType="picture"
        multiple={false}
        maxCount={1}
        showUploadList={showPreview}
        beforeUpload={() => false} // prevent auto upload
        fileList={fileList}
        onChange={({ file, fileList: nextList }) => {
          // keep only the latest file; AntD may accumulate
          const latestList = nextList.slice(-1);
          setFileList(latestList);
          setFile(file);
          setShowPreview(true);
        }}
      >
        <Button type="dashed">Select Image</Button>
      </Upload>

      <div className="flex justify-end gap-5 mt-5">
        <Button type="default" onClick={() => setShowProductForm(false)}>
          Cancel
        </Button>
        <Button type="primary" disabled={!file} onClick={upload}>
          {file ? "Upload" : "Select File"}
        </Button>
      </div>
    </div>
  );
}

export default Images;
