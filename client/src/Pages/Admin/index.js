import React from "react";
import { Tabs } from "antd";
import Products from "./Products";
function Admin() {
  return (
    <Tabs>
      <Tabs.TabPane tab="Products" key="1">
        <Products />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Users" key="2">
        <h1>Users</h1>
      </Tabs.TabPane>
    </Tabs>
  );
}

export default Admin;
