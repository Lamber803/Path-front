import React, { useState } from "react";
import { Button, TextField, IconButton } from "@mui/material";
import TinyMCEEditor from "../../components/TinyMCEEditor"; // 引入 TinyMCEEditor
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";

interface UploadTextPageProps {
  userId: number; // 父组件传入的 userId
}

const UploadTextPage: React.FC<UploadTextPageProps> = ({ userId }) => {
  const [editorContent, setEditorContent] = useState<string>(""); // 編輯器內容
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // 選擇的文件
  const [fileNames, setFileNames] = useState<string[]>([]); // 文件名稱
  const [title, setTitle] = useState<string>(""); // 標題

  // 文件選擇處理
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length > 0) {
      setSelectedFiles(files);
      setFileNames(files.map((file) => file.name));
    }
  };

  // 標題變化處理
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  // 提交表單處理
  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("請輸入標題！");
      return;
    }

    if (!editorContent.trim()) {
      alert("請輸入文字內容！");
      return;
    }

    // 構建 FormData 上傳數據
    const formData = new FormData();
    formData.append("title", title); // 標題
    formData.append("htmlContent", editorContent); // 編輯器內容

    // 將選擇的文件添加到 FormData 中（上傳圖片到後端）
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(
        `http://localhost:8080/api/documents/create?userId=${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // 使用存儲的 JWT token
          },
        }
      );
      console.log("提交成功:", response.data);
      alert("文檔創建成功！");
    } catch (error) {
      console.error("提交錯誤:", error);
      alert("提交失敗，請稍後再試！");
    }
  };

  // 刪除文件
  const handleDeleteFile = (index: number) => {
    const updatedFileNames = [...fileNames];
    updatedFileNames.splice(index, 1); // 刪除文件名
    setFileNames(updatedFileNames);
  };

  return (
    <div style={{ display: "flex" }}>
      {/* 侧边栏 */}
      <Sidebar />

      {/* 右侧内容区域 */}
      <div
        style={{
          padding: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
          flex: 1, // 讓內容部分占滿剩餘空間
        }}
      >
        <h2>編輯文字內容與上傳文件</h2>

        {/* 標題輸入框 */}
        <TextField
          label="標題"
          variant="outlined"
          fullWidth
          value={title}
          onChange={handleTitleChange}
          style={{ marginBottom: "20px" }}
        />

        {/* 使用 TinyMCEEditor 组件 */}
        <TinyMCEEditor value={editorContent} onChange={setEditorContent} />

        {/* 文件上傳 */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            multiple
          />
          {fileNames.length > 0 && (
            <div>
              <p>選擇的文件：</p>
              {fileNames.map((fileName, index) => (
                <div key={index}>
                  <p>{fileName}</p>
                  <IconButton
                    onClick={() => handleDeleteFile(index)}
                    color="secondary"
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 提交按鈕 */}
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          提交
        </Button>
      </div>
    </div>
  );
};

export default UploadTextPage;
