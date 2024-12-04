import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom"; // 引入 useLocation

const MainContent: React.FC = () => {
  const [documentContent, setDocumentContent] = useState<string>("");
  const [documentDetails, setDocumentDetails] = useState<any>({}); // 用于存储文档详情
  const [loading, setLoading] = useState<boolean>(false); // 用于显示加载提示

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search); // 获取查询参数
  const documentId = queryParams.get("documentId"); // 获取 documentId

  // 检查是否获得了有效的 documentId
  useEffect(() => {
    if (!documentId) {
      console.error("Error: documentId is not provided!");
      return;
    }
    console.log("Document ID:", documentId); // 输出 documentId 进行检查
    fetchDocumentContent(documentId);
  }, [documentId]);

  // 缓存文档内容，避免重复请求
  const fetchDocumentContent = async (documentId: string) => {
    if (!documentId) return;

    const cachedDocument = sessionStorage.getItem(`document-${documentId}`);
    if (cachedDocument) {
      // 使用缓存的文档内容
      const parsedData = JSON.parse(cachedDocument);
      setDocumentContent(parsedData.htmlContent);
      setDocumentDetails(parsedData.details);
      return;
    }

    setLoading(true); // 设置加载状态为 true
    try {
      const response = await axios.get(
        `http://localhost:8080/api/documents/read?documentId=${documentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      // 更新文档内容和文档详情
      const documentData = response.data;
      setDocumentContent(documentData.htmlContent);
      setDocumentDetails({
        documentId: documentData.documentId,
        userId: documentData.userId,
        title: documentData.title,
        createdAt: formatDate(documentData.createdAt),
        updatedAt: formatDate(documentData.updatedAt),
      });

      // 缓存文档内容
      sessionStorage.setItem(
        `document-${documentId}`,
        JSON.stringify({
          htmlContent: documentData.htmlContent,
          details: documentData,
        })
      );
    } catch (error) {
      console.error("Error fetching document content:", error);
    } finally {
      setLoading(false); // 数据请求完成，隐藏加载提示
    }
  };

  // 格式化时间
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // 使用本地格式输出日期和时间
  };

  return (
    <div className="main-content">
      <h3>文档内容</h3>

      {/* 如果正在加载，显示 loading 提示 */}
      {loading ? (
        <div className="loading-message">文档正在加载，请稍候...</div>
      ) : (
        <>
          {/* 渲染文档的基本信息 */}
          <div className="document-info">
            <p>
              <strong>文档ID:</strong> {documentDetails.documentId}
            </p>
            <p>
              <strong>用户ID:</strong> {documentDetails.userId}
            </p>
            <p>
              <strong>标题:</strong> {documentDetails.title}
            </p>
            <p>
              <strong>创建时间:</strong> {documentDetails.createdAt}
            </p>
            <p>
              <strong>更新时间:</strong> {documentDetails.updatedAt}
            </p>
          </div>

          {/* 渲染文档内容 */}
          <div dangerouslySetInnerHTML={{ __html: documentContent }} />
        </>
      )}
    </div>
  );
};

export default MainContent;
