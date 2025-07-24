import React, { useEffect } from "react";
import { Button, message, Table } from "antd";
import ProductsForm from "./ProductsForm";
import { GetProducts } from "../../../apicalls/products";
import { Setloader } from "../../../Redux/loadersSlice";
import { useDispatch } from "react-redux";

function Products() {
  const [products, setProducts] = React.useState([]);
  const [showProductForm, setShowProductForm] = React.useState(false);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(Setloader(true));
      const response = await GetProducts();
      dispatch(Setloader(false));
      if (response.success) {
        setProducts(response.products);
      }
    } catch (error) {
      dispatch(Setloader(false));
      message.error(error.message);
    }
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Age",
      dataIndex: "age",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-5">
            <i className="ri-delete-bin-line"></i>
            <i className="ri-pencil-line"></i>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="flex justify-end" mb-2>
        <Button type="default" onClick={() => setShowProductForm(true)}>
          Add Products
        </Button>
      </div>
      <Table columns={columns} dataSource={products} />
      {showProductForm && (
        <ProductsForm
          showProductForm={showProductForm}
          setShowProductForm={setShowProductForm}
        />
      )}
    </div>
  );
}

export default Products;
