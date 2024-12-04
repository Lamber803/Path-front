import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 用 useNavigate 來處理頁面跳轉
import axios from "axios";
import {
  TextField,
  Button,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Divider,
  Link,
} from "@mui/material";
import { Icon } from "@iconify/react"; // Correct import for Iconify icons

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // 用 useNavigate 來處理頁面跳轉

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // 清除錯誤訊息

    try {
      const registerRequest = {
        username: username,
        password: password,
        email: email,
        role: role,
      };

      // 發送 POST 請求到後端註冊 API
      const response = await axios.post(
        "http://localhost:8080/api/users/register", // 后端注册 API 地址
        registerRequest, // 请求体
        {
          headers: {
            "Content-Type": "application/json", // 确保 Content-Type 是 application/json
          },
        }
      );

      if (response.status === 200) {
        alert("Registration successful!");
        navigate("/login"); // 跳轉到登入頁面
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "20px" }}>
      <Typography align="center" variant="h4" gutterBottom>
        Create an Account
      </Typography>
      <Typography align="center" variant="body2" mb={3}>
        Please fill in the details to create your account.
      </Typography>

      <Stack
        component="form"
        onSubmit={handleSubmit}
        direction="column"
        gap={2}
      >
        <TextField
          id="username"
          name="username"
          type="text"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          variant="filled"
          fullWidth
          required
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon icon="ic:baseline-alternate-email" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          id="email"
          name="email"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="filled"
          fullWidth
          required
        />
        <TextField
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="filled"
          fullWidth
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon icon="ic:outline-lock" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  <Icon
                    icon={
                      showPassword
                        ? "ic:outline-visibility"
                        : "ic:outline-visibility-off"
                    }
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <FormControl variant="filled" fullWidth required>
          <InputLabel>Role</InputLabel>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            label="Role"
          >
            <MenuItem value="USER">User</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
          </Select>
        </FormControl>

        {error && (
          <Typography variant="body2" color="error" align="center">
            {error}
          </Typography>
        )}

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Register
        </Button>
      </Stack>

      <Divider sx={{ my: 4 }} />

      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        letterSpacing={0.25}
      >
        Already have an account? <Link href="#login">Login</Link>
      </Typography>
    </div>
  );
};

export default RegisterPage;
