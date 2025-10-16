import { Button, message, Upload } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { Setloader } from "../../../Redux/loadersSlice";

function Images({ selectedProduct, setShowProductForm, getData }) {
  const [file, setFile] = React.useState(null);
  const dispatch = useDispatch();
  const upload = () => {
    try {
      dispatch(Setloader(true));
    } catch (error) {
      // Upload Image to Cloudinary
      dispatch(Setloader(false));
      message.error(error.message);
    }
  };

  return (
    <div>
      <Upload
        listType="picture"
        beforeUpload={() => false}
        onChange={(info) => {
          setFile(info.file);
        }}
      >
        <Button type="dashed">Upload Image</Button>
      </Upload>

      <div className="flex justify-end gap-5 mt-5">
        <Button
          type="default"
          onClick={() => {
            setShowProductForm(false);
          }}
        >
          Cancel
        </Button>

        <Button type="primary" disabled={!file} onClick={upload}>
          Upload
        </Button>
      </div>
    </div>
  );
}

export default Images;
