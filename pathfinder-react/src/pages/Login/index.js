import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 使用 useNavigate
import axios from "axios";
import { TextField, Button, Stack, Typography, Link } from "@mui/material";

const LoginPage = () => {
  const [username, setUsername] = useState(""); // 用户名
  const [password, setPassword] = useState(""); // 密码
  const [error, setError] = useState(""); // 错误提示
  const navigate = useNavigate(); // 用于路由跳转

  // 登录函数
  const loginUser = async (username, password) => {
    try {
      const loginRequest = { username, password };

      const response = await axios.post(
        "http://localhost:8080/api/users/login", // 登录API
        loginRequest
      );

      if (response.status === 200) {
        // 登录成功，存储 JWT
        console.log(response);

        const token = response.data; // 移除 "Bearer " 前缀
        console.log(token.data);
        localStorage.setItem("jwtToken", token.data); // 将 JWT 存储在 localStorage 中
        alert("Login successful!");
        navigate("/dashboard"); // 登录成功后跳转到仪表盘
      }
    } catch (err) {
      setError("Invalid username or password."); // 如果登录失败，显示错误
    }
  };

  // 提交表单
  const handleSubmit = (e) => {
    e.preventDefault(); // 阻止默认表单提交

    setError(""); // 清除错误信息
    loginUser(username, password); // 调用 loginUser 函数进行登录
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "20px" }}>
      <Typography align="center" variant="h4" gutterBottom>
        Sign In
      </Typography>

      <Stack
        component="form"
        onSubmit={handleSubmit}
        direction="column"
        gap={2}
      >
        <TextField
          id="username"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // 绑定用户名输入框
          fullWidth
          required
        />
        <TextField
          id="password"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // 绑定密码输入框
          fullWidth
          required
        />
        {error && (
          <Typography variant="body2" color="error" align="center">
            {error} {/* 如果有错误，显示错误信息 */}
          </Typography>
        )}

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </Stack>

      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        letterSpacing={0.25}
      >
        Don't have an account? <Link href="/register">Sign up</Link>
      </Typography>
    </div>
  );
};

export default LoginPage;
