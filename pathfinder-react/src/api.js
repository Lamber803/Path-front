import axios from "axios";

const API_URL = "http://localhost:8080/api/users"; // 使用 /api/users 路径

// 用户注册
export const registerUser = async (username, password, email, role) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      password,
      email,
      role,
    });
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

// 用户登录
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// 修改密码
export const updatePassword = async (
  userId,
  username,
  oldPassword,
  newPassword
) => {
  try {
    const response = await axios.put(`${API_URL}/change-password`, {
      userId,
      username,
      oldPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Password update failed:", error);
    throw error;
  }
};
