// src/components/DocumentForm.js
import React, { useState, useEffect } from "react";
import axiosInstance from "./axios";
import { useNavigate, useParams } from "react-router-dom";

const DocumentForm = ({ userId }) => {
  const [title, setTitle] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const { documentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // 如果是更新操作，則獲取文檔的詳細信息
    if (documentId) {
      axiosInstance
        .get(`/${documentId}`)
        .then((response) => {
          setTitle(response.data.title);
          setHtmlContent(response.data.htmlContent);
        })
        .catch((error) => {
          console.error("Error fetching document for editing", error);
        });
    }
  }, [documentId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const documentData = { title, htmlContent };

    if (documentId) {
      // 更新文檔
      axiosInstance
        .put(`/${documentId}`, documentData)
        .then((response) => {
          navigate(`/documents/${documentId}`);
        })
        .catch((error) => {
          console.error("There was an error updating the document!", error);
        });
    } else {
      // 創建新文檔
      axiosInstance
        .post("/", documentData, {
          params: { userId },
        })
        .then((response) => {
          navigate(`/documents/${response.data.documentId}`);
        })
        .catch((error) => {
          console.error("There was an error creating the document!", error);
        });
    }
  };

  return (
    <div>
      <h2>{documentId ? "更新文檔" : "創建文檔"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>標題:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>內容:</label>
          <textarea
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">{documentId ? "更新" : "創建"}</button>
      </form>
    </div>
  );
};

export default DocumentForm;
