import React, { useEffect } from "react";
import { Button, message, Table } from "antd";
import ProductsForm from "./ProductsForm";
import { GetProducts, DeleteProduct } from "../../../apicalls/products";
import { Setloader } from "../../../Redux/loadersSlice";
import { useDispatch, useSelector } from "react-redux"; // ✅ added useSelector
import moment from "moment";
import Bids from "./Bids";

function Products() {
  const [showBids, setShowBids] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [products, setProducts] = React.useState([]);
  const [showProductForm, setShowProductForm] = React.useState(false);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  // ✅ Fetch products for the logged-in seller only
  const getData = async () => {
    try {
      dispatch(Setloader(true));

      // Pass seller ID to API
      const response = await GetProducts({ seller: user._id });

      dispatch(Setloader(false));

      if (response.success) {
        // Sort newest first
        setProducts(
          response.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(Setloader(false));
      message.error(error.message);
    }
  };

  // ✅ Delete product
  const handleDeleteProduct = async (id) => {
    try {
      dispatch(Setloader(true));
      const response = await DeleteProduct(id);
      dispatch(Setloader(false));
      if (response.success) {
        message.success(response.message);
        getData(); // refresh list
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(Setloader(false));
      message.error(error.message);
    }
  };

  // ✅ Table columns
  const columns = [
    {
      title: "Product",
      dataIndex: "images",
      render: (text, record) => (
        <img
          src={record?.images?.length > 0 ? record.images[0] : ""}
          alt=""
          className="w-20 h-20 object-cover rounded-md"
        />
      ),
    },
    { title: "Name", dataIndex: "name" },
    { title: "Price", dataIndex: "price" },
    { title: "Category", dataIndex: "category" },
    { title: "Age", dataIndex: "age" },
    { title: "Status", dataIndex: "status" },
    {
      title: "Bids",
      dataIndex: "bids",
      render: (text, record) => (
        <span className="font-medium">
          {record.bidCount ?? record.bids?.length ?? 0}
        </span>
      ),
    },
    {
      title: "Added on",
      dataIndex: "createdAt",
      render: (text, record) =>
        moment(record.createdAt).format("DD-MM-YYYY hh:mm A"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="flex gap-5 items-center">
          <i
            className="ri-delete-bin-line"
            onClick={() => handleDeleteProduct(record._id)}
          ></i>
          <i
            className="ri-pencil-line"
            onClick={() => {
              setSelectedProduct(record);
              setShowProductForm(true);
            }}
          ></i>
          <span
            className="underline cursor-pointer"
            onClick={() => {
              setSelectedProduct(record);
              setShowBids(true);
            }}
          >
            Show Bids
          </span>
        </div>
      ),
    },
  ];

  // ✅ Fetch data on mount
  useEffect(() => {
    if (user?._id) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div>
      <div className="flex justify-end mb-2">
        <Button
          type="default"
          onClick={() => {
            setSelectedProduct(null);
            setShowProductForm(true);
          }}
        >
          Add Product
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        rowKey={(record) => record._id}
      />

      {showProductForm && (
        <ProductsForm
          showProductForm={showProductForm}
          setShowProductForm={setShowProductForm}
          selectedProduct={selectedProduct}
          getData={getData}
        />
      )}
      {showBids && (
        <Bids
          showBidModal={showBids}
          setShowBidModal={setShowBids}
          product={selectedProduct}
        />
      )}
    </div>
  );
}

export default Products;
