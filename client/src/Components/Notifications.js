import { Modal, message } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { DeleteNotification } from "../apicalls/notifications";
import { GetAllNotifications } from "../apicalls/notifications";
import moment from "moment";

function Notifications({
  notifications = [],
  reloadNotifications,
  showNotifications,
  setShowNotifications,
}) {
  const navigate = useNavigate();

  const handleDelete = async (e, notificationId) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    try {
      const response = await DeleteNotification(notificationId);
      if (response.success) {
        message.success("Notification deleted");
        // Refresh the notifications list
        const res = await GetAllNotifications();
        if (res?.success) {
          reloadNotifications(res.data || []);
        }
      } else {
        message.error(response.message || "Failed to delete");
      }
    } catch (error) {
      message.error("Failed to delete notification");
    }
  };
  return (
    <Modal
      title="Notifications"
      open={showNotifications}
      onCancel={() => setShowNotifications(false)}
      footer={null}
      centered
      width={1000}
    >
      <div className="flex flex-col gap-2">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className="flex justify-between items-start gap-3 border border-solid border-gray-300 p-3 rounded hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                navigate(notification.onClick);
                setShowNotifications(false);
              }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-gray-800 font-semibold">
                    {notification.title}
                  </h1>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  {notification.message}
                </p>
                <span className="text-gray-500 text-xs">
                  {moment(notification.createdAt).fromNow()} •{" "}
                  {moment(notification.createdAt).format("MMM DD, YYYY h:mm A")}
                </span>
              </div>
              <i
                className="ri-delete-bin-line text-red-500 text-lg cursor-pointer hover:text-red-700"
                onClick={(e) => handleDelete(e, notification._id)}
                title="Delete notification"
              ></i>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No notifications</p>
        )}
      </div>
    </Modal>
  );
}

export default Notifications;
