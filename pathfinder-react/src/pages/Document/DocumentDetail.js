// src/components/DocumentDetail.js
import React, { useState, useEffect } from "react";
import axiosInstance from "./axios";
import { useParams } from "react-router-dom";

const DocumentDetail = () => {
  const [document, setDocument] = useState(null);
  const { documentId } = useParams();

  useEffect(() => {
    axiosInstance
      .get(`/${documentId}`)
      .then((response) => {
        setDocument(response.data);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the document details!",
          error
        );
      });
  }, [documentId]);

  if (!document) return <div>Loading...</div>;

  return (
    <div>
      <h2>{document.title}</h2>
      <div>
        <h3>內容:</h3>
        <div dangerouslySetInnerHTML={{ __html: document.htmlContent }} />
      </div>
    </div>
  );
};

export default DocumentDetail;
