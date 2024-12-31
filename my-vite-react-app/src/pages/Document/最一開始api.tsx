import React, { useEffect, useState } from "react";
import axios from "axios";

const DocumentsList = ({ userId, onSelectDocument }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      setError(null);

      // 發送 API 請求查詢文檔
      axios
        .get(`http://localhost:8080/api/documents/search?userId=${userId}`, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        })
        .then((response) => {
          const data = response.data;
          console.log(data); // 查看返回的數據結構

          // 檢查返回的數據是否為陣列
          if (Array.isArray(data)) {
            setDocuments(data); // 設置為 documents
          } else {
            setError("返回的數據格式無效");
          }
        })
        .catch(() => {
          setError("無法加載文檔");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="document-list">
      {documents.length === 0 ? (
        <p>沒有文檔可顯示。</p>
      ) : (
        <ul>
          {documents.map((doc) => (
            <li
              key={doc.documentId}
              style={{ cursor: "pointer" }}
              onClick={() => onSelectDocument(doc.documentId)} // Pass the document ID on click
            >
              <h3>{doc.title}</h3>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DocumentsList;
