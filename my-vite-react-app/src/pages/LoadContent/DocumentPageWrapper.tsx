import React from "react";
import { useParams } from "react-router-dom"; // 確保引入 useParams
import DocumentPage from "./DocumentPage"; // 引入 DocumentPage 組件

const DocumentPageWrapper = () => {
  const { userId } = useParams<{ userId: string }>(); // 使用 useParams 獲取 userId 參數
  if (!userId) {
    return <div>Invalid User ID</div>;
  }

  return <DocumentPage userId={parseInt(userId)} />; // 將 userId 傳遞給 DocumentPage
};

export default DocumentPageWrapper;
