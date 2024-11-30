import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const UploadTextPage = () => {
  const [editorContent, setEditorContent] = useState<string>(""); // 編輯器內容
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // 選擇的檔案
  const [fileNames, setFileNames] = useState<string[]>([]); // 檔案名稱
  const [title, setTitle] = useState<string>(""); // 標題
  const [userId, setUserId] = useState<number | null>(null); // 假設這是當前登錄用戶的 ID

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decodedToken = jwtDecode<{ sub: string }>(token); // 解碼 JWT token
        console.log("解碼後的令牌:", decodedToken);
        const username = decodedToken.sub; // 假設 JWT 中有 username 屬性
        console.log(username);
        const getUrl = `http://localhost:8080/api/users/${username}`;
        console.log(getUrl);
        // 根據用戶名向後端請求 userId
        axios
          .get(getUrl, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // 使用存儲的 JWT token
            },
          })

          .then((response) => {
            const userId = response.data.userId; // 假設後端返回 { userId: ... }
            setUserId(userId); // 設置 userId
            console.log(userId);
          })
          .catch((error) => {
            console.error("無法獲取 userId:", error);
          });
      } catch (error) {
        console.error("解碼 JWT 失敗:", error);
      }
    }
  }, []);
  // 檔案選擇處理
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length > 0) {
      setSelectedFiles(files);
      setFileNames(files.map((file) => file.name));
    }
  };

  // 編輯器內容變更處理
  const handleEditorChange = (value: string) => {
    setEditorContent(value);
  };

  // 標題變更處理
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  // 提交表單處理
  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("請輸入標題！");
      return;
    }

    // 如果編輯器沒有內容，則提示
    if (!editorContent.trim()) {
      alert("請輸入文字內容！");
      return;
    }

    // 檢查是否有檔案
    const formData = new FormData();
    formData.append("title", title); // 標題
    formData.append("htmlContent", editorContent); // 編輯器內容

    // 添加選擇的檔案
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(
        `http://localhost:8080/api/documents/create?userId=${userId}`, // 在 URL 中加上 userId 作為查詢參數
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
      alert("提交錯誤，請稍後再試！");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>編輯文字內容與上傳檔案</h2>

      {/* 標題輸入框 */}
      <TextField
        label="標題"
        variant="outlined"
        fullWidth
        value={title}
        onChange={handleTitleChange}
        style={{ marginBottom: "20px" }}
      />

      <div style={{ marginBottom: "20px" }}>
        <ReactQuill
          value={editorContent}
          onChange={handleEditorChange}
          modules={{
            toolbar: [
              [{ header: "1" }, { header: "2" }, { font: [] }],
              [{ list: "ordered" }, { list: "bullet" }],
              ["bold", "italic", "underline", "strike"],
              [{ color: [] }, { background: [] }],
              [{ align: [] }],
              ["link"],
              ["image"],
              [{ size: ["small", "normal", "large", "huge"] }],
            ],
          }}
          formats={[
            "header",
            "font",
            "list",
            "bold",
            "italic",
            "underline",
            "link",
            "image",
            "size",
          ]}
          placeholder="請輸入內容..."
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*, .pdf, .doc, .docx, .txt"
          multiple
        />
        {fileNames.length > 0 && (
          <div>
            <p>選擇的檔案：</p>
            {fileNames.map((fileName, index) => (
              <p key={index}>{fileName}</p>
            ))}
          </div>
        )}
      </div>

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        提交
      </Button>
    </div>
  );
};

export default UploadTextPage;
