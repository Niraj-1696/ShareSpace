import React, { useEffect } from "react";
import { message, Table, Popconfirm } from "antd";
import {
  GetProducts,
  UpdateProductStatus,
  DeleteProduct,
} from "../../apicalls/products";
import { Setloader } from "../../Redux/loadersSlice";
import { useDispatch } from "react-redux";
import moment from "moment";

function Products() {
  const [products, setProducts] = React.useState([]);

  const dispatch = useDispatch();

  // Fetch products for the logged-in seller only
  const getData = async () => {
    try {
      dispatch(Setloader(true));

      // Fetch all products for admin (no filters)
      const response = await GetProducts();

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

  const onStatusUpdate = async (id, status) => {
    try {
      dispatch(Setloader(true));
      const response = await UpdateProductStatus(id, status);
      dispatch(Setloader(false));
      if (response.success) {
        message.success(response.message);
        getData(); // Refresh the product list
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(Setloader(false));
      message.error(error.message);
    }
  };

  const onDeleteProduct = async (id, productName) => {
    try {
      dispatch(Setloader(true));
      const response = await DeleteProduct(id);
      dispatch(Setloader(false));
      if (response.success) {
        message.success(response.message);
        getData(); // Refresh the product list
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(Setloader(false));
      message.error(error.message);
    }
  };

  // Table columns
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
    { title: "Product", dataIndex: "name" },
    {
      title: "Seller",
      dataIndex: "name",
      render: (text, record) => {
        if (!record.seller) return "N/A";
        return `${record.seller.name || "N/A"} (${
          record.seller.class || "N/A"
        })`;
      },
    },
    { title: "Price", dataIndex: "price" },
    { title: "Category", dataIndex: "category" },
    { title: "Age", dataIndex: "age" },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        return record.status.toUpperCase();
      },
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
      render: (text, record) => {
        const { status, _id } = record;
        return (
          <div className="flex gap-3">
            {status === "pending" && (
              <span
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "approved")}
              >
                Approve
              </span>
            )}
            {status === "pending" && (
              <span
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "rejected")}
              >
                Reject
              </span>
            )}
            {status === "rejected" && (
              <Popconfirm
                title={`Delete Product: ${record.name}`}
                description={`Are you sure you want to permanently delete "${record.name}"? This action cannot be undone.`}
                onConfirm={() => onDeleteProduct(_id, record.name)}
                okText="Yes, Delete"
                cancelText="Cancel"
                okType="danger"
              >
                <span className="underline cursor-pointer text-red-600 hover:text-red-800">
                  Delete
                </span>
              </Popconfirm>
            )}
            {status === "approved" && (
              <span
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "blocked")}
              >
                Block
              </span>
            )}
            {status === "blocked" && (
              <span
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "approved")}
              >
                Unblock
              </span>
            )}
            {status === "unblocked" && (
              <span
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "approved")}
              >
                Approve
              </span>
            )}
          </div>
        );
      },
    },
  ];

  // Fetch data on mount
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={products}
        rowKey={(record) => record._id}
      />
    </div>
  );
}

export default Products;
