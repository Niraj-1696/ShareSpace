import React, { useEffect, useState } from "react";
import { message } from "antd";
import { GetCurrentUser } from "../apicalls/users";
import { useNavigate } from "react-router-dom";

function ProtectedPages({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const validateToken = async () => {
    try {
      const response = await GetCurrentUser();
      if (response && response.success) {
        setUser(response.data);
      } else {
        message.error(response.message || "Unauthorized access");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
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

  return (
    <div>
      {user && (
        <div className="p-5">
          <div>Welcome, {user.name}</div>
          {children}
        </div>
      )}
    </div>
  );
}

export default ProtectedPages;
