import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Layout,
  Input,
  Button,
  Typography,
  message,
  Card,
  Space,
  Form,
  Select,
} from "antd";

const { Content, Footer } = Layout;
const { Title, Text } = Typography;
import CustomHeaderLogin from "../custom-header/CustomHeaderLogin";

const RegisterPage = () => {
  const [username, setUsername] = useState(""); // 使用者名稱
  const [password, setPassword] = useState(""); // 密碼
  const [email, setEmail] = useState(""); // 電子郵件
  const [role, setRole] = useState("USER"); // 角色
  const [error, setError] = useState(""); // 錯誤訊息
  const [showPassword, setShowPassword] = useState(false); // 顯示密碼
  const navigate = useNavigate(); // 路由跳轉

  // 正則表達式驗證電子郵件格式
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 防止表單預設提交
    setError(""); // 清除錯誤訊息

    // 驗證電子郵件格式
    if (!validateEmail(email)) {
      setError("請輸入有效的電子郵件地址。");
      message.error("請輸入有效的電子郵件地址。");
      return;
    }

    try {
      const registerRequest = {
        username: username,
        password: password,
        email: email,
        role: role,
      };

      const response = await axios.post(
        "http://localhost:8080/api/users/register", // 後端註冊 API 地址
        registerRequest,
        {
          headers: {
            "Content-Type": "application/json", // 確保 Content-Type 是 application/json
          },
        }
      );

      if (response.status === 200) {
        message.success("註冊成功！");
        navigate("/login"); // 註冊成功後跳轉到登入頁面
      }
    } catch (err) {
      setError("註冊失敗，請再試一次。");
      message.error("註冊失敗，請再試一次。");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 頁面頭部 */}
      <CustomHeaderLogin
        // bgColor="#f5e4d8"
        menuColor={{ frontColor: "#923c3c", hoverColor: "#6f6262" }}
      />

      {/* 註冊內容 */}
      <Content
        style={{
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
          <Title level={3} style={{ color: "#955049", marginBottom: 5 }}>
            創建帳號
          </Title>
          <Typography
            variant="body2"
            mb={3}
            type="secondary"
            style={{ color: "#955049", paddingBottom: 10 }}
          >
            請填寫以下資料以創建您的帳號。
          </Typography>

          <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              <Input
                placeholder="使用者名稱"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <Input
                placeholder="電子郵件"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input.Password
                placeholder="密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                iconRender={(visible) => (visible ? "👁️" : "👁️‍🗨️")}
              />
              <Form.Item label="角色" name="role" required>
                <Select
                  value={role}
                  onChange={(value: string) => setRole(value)} // 明確指定 value 類型為 string
                  style={{ width: "100%" }}
                >
                  <Select.Option value="USER">使用者</Select.Option>
                  <Select.Option value="ADMIN">管理員</Select.Option>
                </Select>
              </Form.Item>

              {error && (
                <Text
                  type="danger"
                  style={{ textAlign: "center", display: "block" }}
                >
                  {error}
                </Text>
              )}

              <Button
                type="primary"
                htmlType="submit"
                block
                style={{
                  backgroundColor: "#d8a29d",
                  borderColor: "#d8a29d",
                }}
              >
                註冊
              </Button>
            </Space>
          </form>

          <Text type="secondary" style={{ marginTop: 20, display: "block" }}>
            已經有帳號了？{" "}
            <a href="/login" style={{ color: "#d8a29d" }}>
              登入
            </a>
          </Text>
        </Card>
      </Content>

      {/* 頁面底部 */}
      {/* <Footer style={{ textAlign: "center", background: "#f5e4d8" }}>
        © 2024 文件管理平台
      </Footer> */}
    </Layout>
  );
};

export default RegisterPage;
