import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // 全局 CSS 文件
import App from "./App.tsx";
import { ThemeProvider, CssBaseline } from "@mui/material"; // 引入 MUI 组件
import theme from "./theme/theme"; // 导入 MUI 主题配置

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      {" "}
      {/* 使用 MUI 的 ThemeProvider 包裹应用 */}
      <CssBaseline /> {/* 引入 CssBaseline，使全局样式适应 MUI 主题 */}
      <App />
    </ThemeProvider>
  </StrictMode>
);
