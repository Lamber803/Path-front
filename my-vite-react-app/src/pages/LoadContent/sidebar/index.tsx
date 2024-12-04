import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 导入 useNavigate 用于路由跳转
import Sidebar from "../../Sidebar/Sidebar";

// 定义文档类型
interface Document {
  documentId: number;
  title: string;
  url: string; // 由于后端没有返回 url，url 可以为空
}

// 定义 DocumentsSidebar 组件的 props 类型
interface DocumentsSidebarProps {
  userId: number; // 明确指定 userId 的类型为 number
}

const DocumentsSidebar: React.FC<DocumentsSidebarProps> = ({ userId }) => {
  const [documents, setDocuments] = useState<Document[]>([]); // 存储文档列表
  const [loading, setLoading] = useState<boolean>(true); // 存储加载状态
  const navigate = useNavigate(); // 使用 useNavigate 来控制页面跳转

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true); // 请求开始时设置加载状态为 true
      try {
        console.log(`Fetching documents for user: ${userId}`);
        const response = await axios.get(
          `http://localhost:8080/api/documents/search?userId=${userId}`, // 使用模板字符串插入 userId
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        console.log("Documents fetched:", response.data); // 打印返回的数据
        // 这里我们移除了 URL 的获取，保持仅包含文档ID和标题
        setDocuments(
          response.data.map((doc: any) => ({
            documentId: doc.documentId,
            title: doc.title,
            url: "", // 没有 URL，可能只是文档ID
          }))
        );
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false); // 请求结束，更新加载状态
      }
    };

    if (userId) {
      fetchDocuments();
    }
  }, [userId]); // 依赖于 userId，只有当 userId 改变时才重新请求数据

  const handleDocumentClick = (documentId: number) => {
    console.log("Navigating to document:", documentId); // 确保 documentId 正确传递
    navigate(`/documents/read?documentId=${documentId}`); // 跳转到文档详情页
  };

  return (
    <div style={{ display: "flex" }}>
      {/* 将 Sidebar 组件放置在左侧 */}
      <Sidebar />
      <div className="sidebar">
        <h3>我的文档</h3>
        {loading ? (
          <p>加载中...</p> // 如果正在加载，显示加载中的提示
        ) : (
          <ul>
            {documents.map((doc) => (
              <li key={doc.documentId}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault(); // 阻止默认行为（避免页面刷新）
                    handleDocumentClick(doc.documentId); // 触发点击时的自定义处理
                  }}
                >
                  {doc.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DocumentsSidebar;
