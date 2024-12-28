import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import useAuth from "./components/useAuth"; // 引入自定義的 useAuth Hook
import Menu from "./pages/home/Menu";
import HomePage from "./pages/home/HomePage";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";
import CalendarPage from "./pages/calendar/CalendarPage";
import PomodoroPage from "./pages/pomodoro/PomodoroPage";
import FlashCardPage from "./pages/flash-card/FlashCardPage";
import UploadTextPage from "./pages/upload/UploadTextPage";
import DocumentsPage from "./pages/document/DocumentPage";

import ChartPage from "./pages/progress/ChartPage";
import { useLocation } from "react-router-dom"; // 引入 useLocation

const App: React.FC = () => {
  const { loading, userId } = useAuth(); // 使用自定義 Hook

  if (loading) {
    return <div>載入中...</div>; // 可以顯示加載中的提示
  }

  return (
    <Routes>
      {/* 根路由指向介紹頁面 */}
      <Route path="/" element={<Menu />} />

      {/* 登入頁面 */}
      <Route path="/login" element={<LoginPage />} />
      {/* 註冊頁面 */}
      <Route path="/register" element={<RegisterPage />} />
      {/* 需要驗證的路由，使用 useAuth 處理後，這些頁面可以保護 */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/calendar" element={<CalendarPage userId={userId!} />} />
      <Route path="/clock" element={<PomodoroPage userId={userId!} />} />

      {/* 上傳頁面，並傳遞用戶 ID */}
      {userId && (
        <Route path="/upload" element={<UploadTextPage userId={userId!} />} />
      )}
      {/* 查詢頁面，並傳遞用戶 ID */}
      {userId && (
        <Route path="/search" element={<DocumentsPage userId={userId!} />} />
      )}
      {/* 讀取文檔頁 */}
      {/* <Route path="/documents/read" element={<MainContent />} /> */}

      <Route path="/card" element={<FlashCardPage userId={userId!} />} />
      <Route path="/progress" element={<ChartPage userId={userId!} />} />
    </Routes>
  );
};

export default App;
