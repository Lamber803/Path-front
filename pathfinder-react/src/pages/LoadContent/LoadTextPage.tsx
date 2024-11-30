import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import axios from "axios";

const LoadTextPage = ({ contentId }: { contentId: number }) => {
  const [editorContent, setEditorContent] = useState<any>("");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // 從後端載入 Delta 格式的內容
        const response = await axios.get(
          `http://localhost:8080/api/content/${contentId}`
        );
        setEditorContent(response.data.textContent); // 設置 Delta 格式內容
      } catch (error) {
        console.error("載入內容錯誤:", error);
      }
    };

    fetchContent();
  }, [contentId]);

  return (
    <div>
      <h2>載入編輯內容</h2>
      <ReactQuill
        value={editorContent}
        readOnly={false} // 設置為可編輯模式
        theme="snow"
      />
    </div>
  );
};

export default LoadTextPage;
