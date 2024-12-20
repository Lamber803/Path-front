import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 使用 useNavigate
import axios from "axios";
import { Layout, Input, Button, Typography, message, Card, Space } from "antd";
import CustomHeaderLogin from "../custom-header/CustomHeaderLogin";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const LoginPage = () => {
  const [username, setUsername] = useState(""); // 使用者名稱
  const [password, setPassword] = useState(""); // 密碼
  const navigate = useNavigate(); // 用於路由跳轉

  // 登入函數
  const loginUser = async (username: string, password: string) => {
    try {
      const loginRequest = { username, password };

      const response = await axios.post(
        "http://localhost:8080/api/users/login", // 登入 API
        loginRequest
      );

      if (response.status === 200) {
        // 登入成功，儲存 JWT
        const token = response.data; // 移除 "Bearer " 前綴
        localStorage.setItem("jwtToken", token.data); // 將 JWT 儲存在 localStorage 中
        message.success("登入成功！");
        navigate("/home"); // 登入成功後跳轉首頁
      } else {
        message.error("登入失敗，請稍後再試！");
      }
    } catch (err) {
      message.error("使用者名稱或密碼錯誤。"); // 如果登入失敗，顯示錯誤
    }
  };

  // 提交表單
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 阻止預設表單提交
    if (!username || !password) {
      message.error("請填寫完整的用戶名和密碼");
      return;
    }
    loginUser(username, password); // 呼叫 loginUser 函數進行登入
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 頁面頭部 */}
      <CustomHeaderLogin
        // bgColor="#f3cbaf"
        menuColor={{ frontColor: "#923c3c", hoverColor: "#6f6262" }}
      />

      {/* 登入內容 */}
      <Content
        style={{
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // backgroundColor: "#F0F2F5", // 頁面背景色
        }}
      >
        <Card
          style={{
            maxWidth: 400,
            width: "100%",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: 8,
            marginBottom: 100,
          }}
        >
          <Title level={3} style={{ color: "#955049" }}>
            登入
          </Title>
          <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              <Input
                placeholder="使用者名稱"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ borderColor: "#4A90E2" }}
              />
              <Input.Password
                placeholder="密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ borderColor: "#4A90E2" }}
              />
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{
                  backgroundColor: "#d8a29d",
                  borderColor: "#4A90E2",
                  color: "#FFFFFF",
                }}
              >
                登入
              </Button>
            </Space>
          </form>

          <Text
            type="secondary"
            style={{ marginTop: 20, display: "block", color: "#666666" }}
          >
            還沒有帳號？{" "}
            <a href="/register" style={{ color: "#d8a29d" }}>
              註冊
            </a>
          </Text>
        </Card>
      </Content>

      {/* 頁面底部 */}
      {/* <Footer
        style={{ textAlign: "center", background: "#4A90E2", color: "#FFFFFF" }}
      >
        © 2024 文件管理平台
      </Footer> */}
    </Layout>
  );
};

export default LoginPage;
