import React, { useEffect, useState } from "react";
import { Button, message, Table, Image, Modal } from "antd";
import { Setloader } from "../../Redux/loadersSlice";
import { useDispatch } from "react-redux";
import moment from "moment";
import { GetAllUsers, UpdateUserStatus } from "../../apicalls/users";
function Users() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
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

  const onStatusUpdate = async (id, statusData) => {
    try {
      dispatch(Setloader(true));
      const response = await UpdateUserStatus(id, statusData);
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

  const showUserDetails = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  // ✅ Table columns
  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    {
      title: "PSID",
      dataIndex: "psid",
      render: (text, record) => {
        return record.psid || "N/A";
      },
    },
    {
      title: "Roll No",
      dataIndex: "rollNo",
      render: (text, record) => {
        return record.rollNo || "N/A";
      },
    },
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
            {status === "pending" && (
              <>
                <span
                  className="underline cursor-pointer text-blue-600"
                  onClick={() => showUserDetails(record)}
                >
                  View Details
                </span>
                <span
                  className="underline cursor-pointer text-green-600"
                  onClick={() => onStatusUpdate(_id, "active")}
                >
                  Approve
                </span>
                <span
                  className="underline cursor-pointer text-red-600"
                  onClick={() => onStatusUpdate(_id, "blocked")}
                >
                  Reject
                </span>
              </>
            )}
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

      {/* Modal to show user details */}
      <Modal
        title="User Verification Details"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>,
          <Button
            key="approve"
            type="primary"
            onClick={() => {
              onStatusUpdate(selectedUser._id, "active");
              handleModalClose();
            }}
          >
            Approve
          </Button>,
          <Button
            key="reject"
            danger
            onClick={() => {
              onStatusUpdate(selectedUser._id, "blocked");
              handleModalClose();
            }}
          >
            Reject
          </Button>,
        ]}
        width={700}
      >
        {selectedUser && (
          <div>
            <div className="mb-4">
              <p>
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>PSID:</strong> {selectedUser.psid}
              </p>
              <p>
                <strong>Roll No:</strong> {selectedUser.rollNo}
              </p>
              <p>
                <strong>Status:</strong> {selectedUser.status?.toUpperCase()}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {moment(selectedUser.createdAt).format("DD-MM-YYYY hh:mm A")}
              </p>
            </div>
            <div>
              <p>
                <strong>College ID Image:</strong>
              </p>
              <Image
                src={selectedUser.collegeIdImage}
                alt="College ID"
                width={400}
                style={{ border: "1px solid #ddd", padding: "10px" }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Users;
