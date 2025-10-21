import { Modal } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

function Notifications({
  notifications = [],
  reloadNotifications,
  showNotifications,
  setShowNotifications,
}) {
  const navigate = useNavigate();
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
              className="flex flex-col gap-1 border border-solid p-2 cursor-pointer"
              onClick={() => {
                navigate(notification.onClick);
                setShowNotifications(false);
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-gray-700">{notification.title}</h1>
                  <p className="text-gray-600 text-sm">
                    {notification.message}
                  </p>
                  <span className="text-gray-500 text-xs">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
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
