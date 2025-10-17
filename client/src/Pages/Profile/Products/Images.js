import { Button, message, Upload } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { Setloader } from "../../../Redux/loadersSlice";
import { UploadProductImage } from "../../../apicalls/products";

function Images({ selectedProduct, setShowProductForm, getData }) {
  const [showPreview = false, setShowPreview] = React.useState(true);
  const [images = [], setimages] = React.useState(selectedProduct.images);
  const [file, setFile] = React.useState(null);
  const dispatch = useDispatch();

  const upload = async () => {
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
        setimages([...images, response.data]);
        setShowPreview(false);
        getData();
        setFile(null); // clear file
      } else {
        message.error(response.message || "Upload failed");
      }
    } catch (error) {
      message.error(error.message || "Upload failed");
    } finally {
      dispatch(Setloader(false));
    }
  };

  return (
    <div>
      <Upload
        listType="picture"
        showUploadList={showPreview}
        beforeUpload={() => false} // prevent auto upload
        onChange={(info) => {
          setFile(info.file);
          setShowPreview(true);
        }}
      >
        <div className="flex gap-5 mb-5">
          {images.map((image) => {
            return (
              <div className="flex gap-2 border border-solid border-gray-500 rounded p-2 items-end">
                <img className="h-20 w-20 object-cover" src={image} alt="" />
                <i className="ri-delete-bin-line" onClick={() => {}}></i>
              </div>
            );
          })}
        </div>
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
