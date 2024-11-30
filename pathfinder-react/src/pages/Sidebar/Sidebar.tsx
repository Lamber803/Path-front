import React from "react";
import { Drawer, List, ListItem, ListItemText, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // 使用 useNavigate 來處理導航

const Sidebar = () => {
  // 使用 useNavigate 來處理導航
  const navigate = useNavigate();

  // 登出邏輯
  const handleLogout = () => {
    console.log("User logged out");

    // 清除 JWT token 或 session token，假設你將 token 存儲在 localStorage
    localStorage.removeItem("jwtToken"); // 清除 localStorage 中的 token
    sessionStorage.removeItem("token"); // 如果 token 也存儲在 sessionStorage 中，這行也要執行

    // 你也可以執行其他登出清理操作，例如清除用戶資料等

    // 然後跳轉到登錄頁面
    navigate("/login"); // 使用 navigate 來進行頁面跳轉
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
        },
      }}
    >
      <List>
        {/* Sidebar 其他項目 */}
        <ListItem component="button" sx={{ padding: "10px" }}>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem component="button" sx={{ padding: "10px" }}>
          <ListItemText primary="About" />
        </ListItem>
        <ListItem component="button" sx={{ padding: "10px" }}>
          <ListItemText primary="Services" />
        </ListItem>
        <ListItem component="button" sx={{ padding: "10px" }}>
          <ListItemText primary="Contact" />
        </ListItem>

        {/* 登出按鈕 */}
        <ListItem sx={{ padding: "10px", marginTop: "auto" }}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={handleLogout} // 處理登出邏輯
          >
            Log Out
          </Button>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
