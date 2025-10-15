import React, { useEffect } from "react";
import { Button, message, Table } from "antd";
import ProductsForm from "./ProductsForm";
import { GetProducts, DeleteProduct } from "../../../apicalls/products";
import { Setloader } from "../../../Redux/loadersSlice";
import { useDispatch } from "react-redux";
import moment from "moment";

function Products() {
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [products, setProducts] = React.useState([]);
  const [showProductForm, setShowProductForm] = React.useState(false);
  const dispatch = useDispatch();

  // Fetch products and sort newest first
  const getData = async () => {
    try {
      dispatch(Setloader(true));
      const response = await GetProducts();
      dispatch(Setloader(false));
      if (response.success) {
        // Sort products by createdAt descending
        setProducts(
          response.products.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      }
    } catch (error) {
      dispatch(Setloader(false));
      message.error(error.message);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    try {
      dispatch(Setloader(true));
      const response = await DeleteProduct(id);
      dispatch(Setloader(false));
      if (response.success) {
        message.success(response.message);
        getData(); // refresh table
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(Setloader(false));
      message.error(error.message);
    }
  };

  // Table columns
  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Description", dataIndex: "description" },
    { title: "Price", dataIndex: "price" },
    { title: "Category", dataIndex: "category" },
    { title: "Age", dataIndex: "age" },
    { title: "Status", dataIndex: "status" },
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
        <div className="flex gap-5">
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
        </div>
      ),
    },
  ];

  // Fetch products on mount
  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="flex justify-end mb-2">
        <Button
          type="default"
          onClick={() => {
            setSelectedProduct(null); // reset selection
            setShowProductForm(true);
          }}
        >
          Add Products
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        rowKey={(record) => record._id} // ✅ ensures correct rendering & order
      />

      {showProductForm && (
        <ProductsForm
          showProductForm={showProductForm}
          setShowProductForm={setShowProductForm}
          selectedProduct={selectedProduct}
          getData={getData} // refresh table after add/edit
        />
      )}
    </div>
  );
}

export default Products;
