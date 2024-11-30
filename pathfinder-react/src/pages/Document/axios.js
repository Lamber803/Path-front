// src/axios.js
import axios from "axios";

// 創建一個 axios 實例
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api/documents", // 後端 API 根路徑
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
