// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import DashboardPage from "./pages/Dashboard"; // 引入主頁組件
import UploadPage from "./pages/Upload"; // 引入 UploadPage 元件
import RegisterPage from "./pages/Register"; // 引入註冊頁面

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 检查 localStorage 中的 token 是否存在，来判断用户是否已认证
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true); // 如果存在 token，认为用户已认证
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* 登录页面路由 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} /> {/* 根路由指向登录页面 */}
        {/* 注册页面路由 */}
        <Route path="/register" element={<RegisterPage />} />
        {/* 保护的路由，用户必须认证才能访问 */}
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* 上传页面路由 */}
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </Router>
  );
}

export default App;
