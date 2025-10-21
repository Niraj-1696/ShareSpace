import React, { useEffect, useState } from "react";
import { message } from "antd";
import { GetCurrentUser } from "../apicalls/users";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Setloader } from "../Redux/loadersSlice";
import { SetUser } from "../Redux/usersSlice";
import { Avatar, Badge } from "antd";
import Notifications from "../Components/Notifications";
import {
  GetAllNotifications,
  ReadAllNotifications,
} from "../apicalls/notifications";
import ReactRef from "react";

function ProtectedPages({ children }) {
  const [notifications = [], setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const validateToken = async () => {
    try {
      dispatch(Setloader(true));
      const response = await GetCurrentUser();
      dispatch(Setloader(false));
      if (response && response.success) {
        dispatch(SetUser(response.data));
      } else {
        message.error(response.message || "Unauthorized access");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      dispatch(Setloader(false));
      message.error("Token validation failed");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      validateToken();
    } else {
      navigate("/login");
    }
  }, []);

  // Load notifications when user changes or when modal is opened
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?._id) return;
      try {
        const res = await GetAllNotifications();
        if (res?.success) {
          setNotifications(res.data || []);
        }
      } catch (e) {
        // no-op
      }
    };
    fetchNotifications();
  }, [user?._id, showNotifications]);

  // Refresh notifications when other parts of the app report updates
  useEffect(() => {
    const handler = async () => {
      if (!user?._id) return;
      const res = await GetAllNotifications();
      if (res?.success) setNotifications(res.data || []);
    };
    window.addEventListener("notification-updated", handler);
    return () => window.removeEventListener("notification-updated", handler);
  }, [user?._id]);

  // Mark all as read only when modal transitions from open -> closed
  const prevShowRef = React.useRef(false);
  useEffect(() => {
    const wasOpen = prevShowRef.current;
    if (wasOpen && !showNotifications && user?._id) {
      (async () => {
        try {
          await ReadAllNotifications();
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        } catch (e) {
          // ignore
        }
      })();
    }
    prevShowRef.current = showNotifications;
  }, [showNotifications, user?._id]);

  return (
    user && (
      <div>
        {/* header */}
        <div className="flex justify-between items-center bg-primary p-5">
          <h1
            className="text-2xl text-white cursor-pointer"
            onClick={() => navigate("/")}
          >
            ShareSpace
          </h1>

          <div className="bg-white py-2 px-5 rounded flex gap-1 items-center">
            <span
              className="underline cursor-pointer uppercase"
              onClick={() => {
                if (user.role === "user") {
                  navigate("/profile");
                } else {
                  navigate("/admin");
                }
              }}
            >
              {user.name}
            </span>
            <Badge
              count={
                notifications?.filter((notification) => !notification.read)
                  .length
              }
              onClick={() => setShowNotifications(true)}
              className="cursor-pointer"
            >
              <Avatar
                shape="circle"
                icon={<i class="ri-notification-line"></i>}
              />
            </Badge>
            <i
              className="ri-logout-box-r-line ml-10"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            ></i>
          </div>
        </div>

        {/* body */}
        <div className="p-5">{children}</div>

        {
          <Notifications
            notifications={notifications}
            reloadNotifications={setNotifications}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
          />
        }
      </div>
    )
  );
}

export default ProtectedPages;
