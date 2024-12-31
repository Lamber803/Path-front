import React, { useEffect, useState } from "react";
import axios from "axios";

interface DocumentContentProps {
  documentId: number;
}

const DocumentContent: React.FC<DocumentContentProps> = ({ documentId }) => {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false); // 定義 loading 狀態
  const [error, setError] = useState<string | null>(null); // 錯誤信息

  useEffect(() => {
    console.log(documentId);
    if (documentId) {
      setLoading(true);
      setError(null); // 清除錯誤消息
      axios
        .get(`http://localhost:8080/api/documents?documentId=${documentId}`, {
          headers: {
            "Content-Type": "multipart/form-data", // 後端期望的內容類型
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // 獲取 token
          },
        })
        .then((response) => {
          setDocument(response.data); // 將返回的文檔數據保存到狀態
        })
        .catch((error) => {
          setError("無法獲取文檔詳細信息");
          console.error("獲取文檔錯誤:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [documentId]); // 當 documentId 改變時重新請求

  if (loading) {
    return <p>正在加載文檔...</p>; // 當加載中顯示此訊息
  }

  if (error) {
    return <p>{error}</p>; // 顯示錯誤信息
  }

  if (!document) {
    return <p>請選擇一個文檔來查看其內容。</p>;
  }

  return (
    <div className="document-content">
      <h2>{document.title}</h2>
      <p>創建時間：{document.createdAt}</p>
      <p>更新時間：{document.updatedAt}</p>
      <div dangerouslySetInnerHTML={{ __html: document.htmlContent }} />
    </div>
  );
};

export default DocumentContent;
