import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // 使用 useNavigate 來處理導航
import MenuIcon from "@mui/icons-material/Menu"; // 用於顯示漢堡菜單圖標
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"; // 用於側邊欄摺疊

const Sidebar = () => {
  const [open, setOpen] = useState<boolean>(true); // 控制側邊欄是否打開
  const navigate = useNavigate();

  // 登出邏輯
  const handleLogout = () => {
    console.log("User logged out");

    // 清除 JWT token 或 session token，假設你將 token 存儲在 localStorage
    localStorage.removeItem("jwtToken");
    sessionStorage.removeItem("token");

    // 跳轉到登錄頁面
    navigate("/login"); // 使用 navigate 來進行頁面跳轉
  };

  // 控制側邊欄的開關
  const handleDrawerToggle = () => {
    setOpen(!open); // 切換側邊欄的開關狀態
  };

  return (
    <>
      {/* 漢堡菜單圖標，用於開關側邊欄 */}
      <IconButton
        color="primary"
        aria-label="menu"
        onClick={handleDrawerToggle}
        sx={{ position: "absolute", top: 20, left: 20 }}
      >
        <MenuIcon />
      </IconButton>

      {/* 側邊欄（Drawer） */}
      <Drawer
        variant="persistent" // 使用 persistent 屬性讓側邊欄可摺疊
        open={open} // 根據 open 狀態來決定是否展開
        onClose={handleDrawerToggle} // 點擊外部區域關閉側邊欄
        sx={{
          width: open ? 240 : 70, // 展開時寬度 240，摺疊時寬度 70
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? 240 : 70,
            boxSizing: "border-box",
            transition: "width 0.3s ease", // 添加過渡效果
          },
        }}
      >
        {/* 左上角的摺疊按鈕 */}
        <ListItem sx={{ padding: "10px", justifyContent: "flex-end" }}>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        </ListItem>

        {/* 菜單選項 */}
        <List>
          <ListItem
            component="button"
            sx={{ padding: "10px" }}
            onClick={() => navigate("/dashboard")}
          >
            {open ? <ListItemText primary="首頁" /> : null}
          </ListItem>

          <ListItem
            component="button"
            sx={{ padding: "10px" }}
            onClick={() => navigate("/upload")}
          >
            {open ? <ListItemText primary="上傳" /> : null}
          </ListItem>

          <ListItem
            component="button"
            sx={{ padding: "10px" }}
            onClick={() => navigate("/search")}
          >
            {open ? <ListItemText primary="查詢" /> : null}
          </ListItem>

          <ListItem
            component="button"
            sx={{ padding: "10px" }}
            onClick={() => navigate("/progress")}
          >
            {open ? <ListItemText primary="進度" /> : null}
          </ListItem>

          <ListItem
            component="button"
            sx={{ padding: "10px" }}
            onClick={() => navigate("/remind")}
          >
            {open ? <ListItemText primary="提醒" /> : null}
          </ListItem>

          {/* 登出 - Logout */}
          <Divider sx={{ marginY: 2 }} />
          <ListItem sx={{ padding: "10px", marginTop: "auto" }}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handleLogout}
            >
              {open ? "登出" : null}
            </Button>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
