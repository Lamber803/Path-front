// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 使用 useNavigate
import axios from "axios";
import { TextField, Button, Stack, Typography, Link } from "@mui/material";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // 清除错误信息

    try {
      const loginRequest = { username, password };
      const response = await axios.post(
        "http://localhost:8080/login", // 登录API
        loginRequest
      );

      if (response.status === 200) {
        // 登录成功，存储 JWT
        localStorage.setItem("jwt", response.data); // 将 JWT 存储在 localStorage 中
        alert("Login successful!");
        navigate("/dashboard"); // 跳转到仪表板
      }
    } catch (err) {
      setError("Invalid username or password.");
    }
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
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          required
        />
        <TextField
          id="password"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
        />
        {error && (
          <Typography variant="body2" color="error" align="center">
            {error}
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
