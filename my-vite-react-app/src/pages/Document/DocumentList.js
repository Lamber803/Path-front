// src/components/DocumentList.js
import React, { useState, useEffect } from "react";
import axiosInstance from "./axios";
import { Link } from "react-router-dom";

const DocumentList = ({ userId }) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    // 發送請求獲取文檔列表
    axiosInstance
      .get("/", {
        params: { userId },
      })
      .then((response) => {
        setDocuments(response.data); // 更新文檔列表
      })
      .catch((error) => {
        console.error("There was an error fetching the documents!", error);
      });
  }, [userId]); // 當 userId 改變時重新加載文檔列表

  return (
    <div>
      <h2>文檔列表</h2>
      <ul>
        {documents.map((document) => (
          <li key={document.documentId}>
            <Link to={`/documents/${document.documentId}`}>
              {document.title}
            </Link>
            <button onClick={() => handleDelete(document.documentId)}>
              刪除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  // 刪除文檔
  const handleDelete = (documentId) => {
    axiosInstance
      .delete(`/${documentId}`)
      .then((response) => {
        setDocuments(documents.filter((doc) => doc.documentId !== documentId)); // 更新 UI
      })
      .catch((error) => {
        console.error("There was an error deleting the document!", error);
      });
  };
};

export default DocumentList;
