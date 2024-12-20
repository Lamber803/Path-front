import React, { useEffect, useState } from "react";
import axios from "axios";

const DocumentContent = ({ documentId }) => {
  const [document, setDocument] = useState(null);

  useEffect(() => {
    if (documentId) {
      // 查詢指定文檔
      axios
        .get(
          `http://localhost:8080/api/documents/read?documentId=${documentId}`,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        )
        .then((response) => {
          setDocument(response.data);
        })
        .catch((error) => {
          console.error("Error fetching document:", error);
        });
    }
  }, [documentId]);

  if (!document) {
    return <p>Select a document to view its content.</p>;
  }

  return (
    <div className="document-content">
      <h2>{document.title}</h2>
      <p>Created at: {document.createdAt}</p>
      <p>Updated at: {document.updatedAt}</p>
      <div dangerouslySetInnerHTML={{ __html: document.htmlContent }} />
    </div>
  );
};

export default DocumentContent;
