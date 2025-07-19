import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider, App as AntdApp } from "antd";
import { Provider } from "react-redux";
import store from "./Redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: "#405138",
            colorPrimaryHover: "#405138",
            borderRadius: "2px",
          },
        },
        token: {
          borderRadius: "2px",
          colorPrimary: "#405138",
        },
      }}
    >
      <AntdApp>
        <App />
      </AntdApp>
    </ConfigProvider>
  </Provider>
);

reportWebVitals();
