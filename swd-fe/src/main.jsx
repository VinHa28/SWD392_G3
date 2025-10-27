import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
// Thêm import cho Ant Design để tải style cơ bản
import "antd/dist/reset.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
