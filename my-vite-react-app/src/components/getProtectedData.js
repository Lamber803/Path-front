import axios from "axios";

// 示例：使用存储的 JWT 进行 API 请求
function getProtectedData() {
  // 从 localStorage 获取存储的 JWT token
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    console.error("No JWT token found in localStorage.");
    return;
  }

  // 发送带有 JWT 的请求
  axios
    .get("http://localhost:8080/api/protected-data", {
      headers: {
        Authorization: `Bearer ${token}`, // 将 token 放在 Authorization header 中
      },
    })
    .then((response) => {
      console.log("Protected Data: ", response.data);
    })
    .catch((error) => {
      if (error.response) {
        console.error("Failed to fetch protected data: ", error.response.data);
      } else {
        console.error("Error:", error.message);
      }
    });
}
