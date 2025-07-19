import React from "react";
import { Tabs } from "antd";

function Profile() {
  return (
    <div>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Buy / Sell" key="1">
          <h1>Buy / Sell</h1>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Bids" key="2">
          <h1>Bids</h1>
        </Tabs.TabPane>
        <Tabs.TabPane tab="General" key="3">
          <h1>General</h1>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default Profile;
