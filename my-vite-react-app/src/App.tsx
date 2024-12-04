import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import useAuth from "./components/useAuth"; // 引入自定義的 useAuth Hook
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UploadTextPage from "./pages/Upload";
import DocumentsSidebar from "./pages/LoadContent/sidebar";
import MainContent from "./pages/LoadContent/mainContent";
import { useLocation } from "react-router-dom"; // 引入 useLocation

const App: React.FC = () => {
  const { loading, userId } = useAuth(); // 使用自定義 Hook

  if (loading) {
    return <div>載入中...</div>; // 可以顯示加載中的提示
  }

  return (
    <div
      style={{
        display: "flex", // 啟用 Flexbox 佈局
        justifyContent: "center", // 水平居中
        alignItems: "center", // 垂直居中
        height: "100vh", // 設置容器高度為視口高度
        padding: "20px", // 內邊距，避免內容靠邊
        boxSizing: "border-box", // 確保 padding 不會影響元素大小
      }}
    >
      <Routes>
        {/* 登入頁面 */}
        <Route path="/login" element={<LoginPage />} />
        {/* 根路由指向登入頁面 */}
        <Route path="/" element={<LoginPage />} />
        {/* 註冊頁面 */}
        <Route path="/register" element={<RegisterPage />} />
        {/* 需要驗證的路由，使用 useAuth 處理後，這些頁面可以保護 */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* 上傳頁面，並傳遞用戶 ID */}
        {userId && (
          <Route path="/upload" element={<UploadTextPage userId={userId!} />} />
        )}
        {/* 查詢頁面，並傳遞用戶 ID */}
        {userId && (
          <Route
            path="/search"
            element={<DocumentsSidebar userId={userId!} />}
          />
        )}
        {/* 读取文档页 */}
        <Route path="/documents/read" element={<MainContent />} />
      </Routes>
    </div>
  );
};

const Root: React.FC = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default Root;
