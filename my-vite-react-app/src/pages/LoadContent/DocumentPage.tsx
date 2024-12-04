import React, { useState } from "react";
import Sidebar from "./sidebar";
import MainContent from "./mainContent";

// 定義 DocumentPage 組件的 props 類型
interface DocumentPageProps {
  userId: number; // userId 應該是 number 類型
}

const DocumentPage: React.FC<DocumentPageProps> = ({ userId }) => {
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(
    null
  );

  return (
    <div className="document-page">
      <Sidebar userId={userId} setSelectedDocumentId={setSelectedDocumentId} />
      <MainContent documentId={selectedDocumentId} />
    </div>
  );
};

export default DocumentPage;
