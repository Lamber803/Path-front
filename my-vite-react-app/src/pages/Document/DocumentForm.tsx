import React, { useState } from "react";
import { Input, Button, Upload, Card, Tag, Typography, message } from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { createDocument } from "./document"; // 引入後端 API 函數
import TinyMCEEditor from "../../components/TinyMCEEditor"; // 引入 TinyMCEEditor 组件

const { Text } = Typography;

interface DocumentFormProps {
  userId: number; // 父組件傳入的 userId
  groupId: number; // 父組件傳入的 groupId
}

const DocumentForm: React.FC<DocumentFormProps> = ({ userId, groupId }) => {
  const [htmlContent, setHtmlContent] = useState<string>(""); // 編輯器內容
  const [fileList, setFileList] = useState<any[]>([]); // 文件列表
  const [title, setTitle] = useState<string>(""); // 標題
  const [error, setError] = useState<string | null>(null); // 錯誤信息狀態，初始化為 null

  // 標題變更處理
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  // 刪除文件
  const handleDeleteFile = (file: any) => {
    const updatedList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(updatedList);
    message.info(`已刪除文件 ${file.name}`);
  };

  // 提交表單處理
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("提交的參數：", {
      userId,
      title,
      htmlContent: htmlContent,
      groupId,
      fileList,
    });

    const data = {
      userId,
      createDocumentDTO: {
        title,
        htmlContent: htmlContent,
        groupId,
      },
      files: fileList.length > 0 ? fileList : undefined,
    };

    try {
      const result = await createDocument(
        userId,
        title,
        htmlContent,
        groupId,
        fileList
      );
      console.log("文檔創建成功", result);
    } catch (error) {
      console.error("提交文檔失敗", error);
      setError("提交文檔失敗，請稍後再試！");
    }
  };

  return (
    <Card style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* 標題輸入框 */}
      <Input
        placeholder="請輸入標題"
        value={title}
        onChange={handleTitleChange}
        style={{ marginBottom: 20 }}
        prefix={<FileTextOutlined />}
      />

      {/* 富文本編輯器 */}
      <TinyMCEEditor value={htmlContent} onChange={setHtmlContent} />

      {/* 文件上傳 */}
      <div style={{ marginTop: 20 }}>
        <div style={{ marginTop: 10 }}>
          {fileList.map((file) => (
            <div
              key={file.uid}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 5,
              }}
            >
              {/* 顯示圖片預覽 */}
              {file.url && (
                <img
                  src={file.url}
                  alt={file.name}
                  style={{ width: 50, height: 50, marginRight: 10 }}
                />
              )}
              <Text>{file.name}</Text>
              <Button
                type="link"
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteFile(file)}
                danger
                style={{ marginLeft: "auto" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 提交按鈕 */}
      <Button
        type="primary"
        onClick={handleSubmit}
        style={{
          marginTop: 30,
          width: "100%",
          backgroundColor: "#d8a29d",
          borderColor: "#d8a29d",
        }}
      >
        提交文檔
      </Button>
    </Card>
  );
};

export default DocumentForm;
