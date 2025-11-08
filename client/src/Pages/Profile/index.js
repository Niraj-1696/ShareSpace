import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import Products from "./Products";
import UserBids from "./UserBids";
import moment from "moment";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function Profile() {
  const { user } = useSelector((state) => state.users);
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("1");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "UserBids") {
      setActiveTab("2");
    } else if (tab === "Products") {
      setActiveTab("1");
    } else if (tab === "General") {
      setActiveTab("3");
    }
  }, [searchParams]);

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="Products" key="1">
          <Products />
        </Tabs.TabPane>
        <Tabs.TabPane tab="My Bids" key="2">
          <UserBids />
        </Tabs.TabPane>
        <Tabs.TabPane tab="General" key="3">
          <div className="flex flex-col w-1/3">
            <span>
              Name: <b>{user.name}</b>
            </span>
            <span>
              Email: <b>{user.email}</b>
            </span>
            <span>
              Created At:{" "}
              <b>{moment(user.createdAt).format("MMM Do YYYY, h:mm a")}</b>
            </span>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default Profile;
