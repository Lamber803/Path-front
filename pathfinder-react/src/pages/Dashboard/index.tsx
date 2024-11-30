import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Sidebar from "../Sidebar/Sidebar"; // 导入 Sidebar 组件
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 用于页面跳转

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState<any>(null); // 存储用户数据
  const [error, setError] = useState<string>(""); // 错误信息
  const navigate = useNavigate(); // 页面跳转

  useEffect(() => {
    // 检查 localStorage 中是否有有效的 JWT token
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      // 如果没有 token，跳转到登录页面
      navigate("/login");
    }
  }, [navigate]); // 在组件加载时检查 token

  const fetchUserData = () => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      setError("No token, user is not authenticated.");
      navigate("/login"); // 如果没有 token，跳转到登录页面
      return;
    }

    axios
      .get("http://localhost:8080/user-profile", {
        headers: {
          Authorization: `Bearer ${token}`, // 将 token 添加到请求头
        },
      })
      .then((response) => {
        setUserProfile(response.data); // 设置用户数据
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data.");
      });
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* 侧边栏 */}
      <Sidebar />

      {/* 主内容区 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          marginLeft: { xs: 0, md: 240 }, // 调整主内容区与侧边栏的间距，响应式设计
        }}
      >
        <Navbar />
        <Typography variant="h4" gutterBottom>
          Welcome to the Dashboard!
        </Typography>

        {error && (
          <Typography variant="body1" color="error" paragraph>
            {error}
          </Typography>
        )}

        {userProfile ? (
          <div>
            <Typography variant="h6">User Profile</Typography>
            <Typography variant="body1">
              Username: {userProfile.username}
            </Typography>
            <Typography variant="body1">Email: {userProfile.email}</Typography>
            {/* 根据需要显示更多的用户数据 */}
          </div>
        ) : (
          <Typography variant="body1">Loading user data...</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
