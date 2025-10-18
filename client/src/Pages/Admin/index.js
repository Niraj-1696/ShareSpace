import React, { useEffect } from "react";
import { Tabs } from "antd";
import Products from "./Products";
import Users from "./Users";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
function Admin() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/");
    }
  }, []);

  return (
    <Tabs>
      <Tabs.TabPane tab="Products" key="1">
        <Products />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Users" key="2">
        <Users />
      </Tabs.TabPane>
    </Tabs>
  );
}

export default Admin;
