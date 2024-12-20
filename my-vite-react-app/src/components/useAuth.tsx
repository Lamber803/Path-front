import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation(); // 獲取當前路由

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    // 如果是訪問 /login 或 /register，則允許無 token 進入
    if (
      location.pathname === "/login" ||
      location.pathname === "/register" ||
      location.pathname === "/"
    ) {
      setLoading(false); // 無需檢查 token，允許進入這些頁面
      return;
    }

    // 如果是其他需要驗證的路由，則檢查 token 是否存在
    if (token) {
      try {
        // 解碼 token 以獲取用戶資訊
        const decodedToken = jwtDecode<{ sub: string }>(token);
        const username = decodedToken.sub;

        // 發送請求以獲取用戶資訊
        axios
          .get(`http://localhost:8080/api/users/${username}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setUserId(response.data.userId);
            setLoading(false); // 用戶資訊加載完成
          })
          .catch((error) => {
            console.error("無法獲取用戶ID:", error);
            setLoading(false);
            navigate("/login"); // 獲取用戶資料失敗，跳轉至登入頁面
          });
      } catch (error) {
        console.error("解碼 JWT 失敗:", error);
        setLoading(false);
        navigate("/login"); // 解碼失敗，跳轉至登入頁面
      }
    } else {
      setLoading(false); // 若沒有 Token，則不做其他處理
      navigate("/login"); // 若沒有 token，跳轉至登入頁面
    }
  }, [navigate, location.pathname]);

  return { loading, userId };
};

export default useAuth;
