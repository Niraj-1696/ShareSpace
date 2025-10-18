import React, { useEffect } from "react";
import { Button, message, Table } from "antd";
import { Setloader } from "../../Redux/loadersSlice";
import { useDispatch } from "react-redux";
import moment from "moment";
import { GetAllUsers, UpdateUserStatus } from "../../apicalls/users";
function Users() {
  const [users, setUsers] = React.useState([]);
  const dispatch = useDispatch();

  // Fetch all users
  const getData = async () => {
    try {
      dispatch(Setloader(true));
      const response = await GetAllUsers();
      dispatch(Setloader(false));

      if (response.success) {
        setUsers(
          response.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(Setloader(false));
      message.error(error.message);
    }
  };

  const onStatusUpdate = async (id, status) => {
    try {
      dispatch(Setloader(true));
      const response = await UpdateUserStatus(id, status);
      dispatch(Setloader(false));
      if (response.success) {
        message.success(response.message);
        getData(); // Refresh the users list
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(Setloader(false));
      message.error(error.message);
    }
  };

  // ✅ Table columns
  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Role",
      dataIndex: "role",
      render: (text, record) => {
        return record.role.toUpperCase();
      },
    },
    {
      title: "createdAt",
      dataIndex: "createdAt",
      render: (text, record) =>
        moment(record.createdAt).format("DD-MM-YYYY hh:mm A"),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        return record.status ? record.status.toUpperCase() : "ACTIVE";
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        const { status, _id } = record;
        return (
          <div className="flex gap-3">
            {(!status || status === "active") && (
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
                onClick={() => onStatusUpdate(_id, "active")}
              >
                Unblock
              </span>
            )}
          </div>
        );
      },
    },
  ];

  // ✅ Fetch data on mount
  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={users}
        rowKey={(record) => record._id}
      />
    </div>
  );
}

export default Users;
