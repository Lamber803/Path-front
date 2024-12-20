import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom"; // 引入 Router
import App from "./App"; // 引入 App 組件
import "antd/dist/reset.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      {" "}
      {/* 將 Router 包裹住整個 App 組件 */}
      <App />
    </Router>
  </StrictMode>
);
