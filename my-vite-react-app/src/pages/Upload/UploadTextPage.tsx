import React, { useState } from "react";
import {
  Layout,
  Input,
  Button,
  Upload,
  Card,
  Tag,
  Typography,
  message,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { createDocument } from "./document"; // 引入剛才創建的 API 函數
import TinyMCEEditor from "../../components/TinyMCEEditor"; // 引入 TinyMCEEditor
import CustomHeader from "../custom-header/CustomHeader";

const { Header, Footer, Sider, Content } = Layout;
const { Text } = Typography;

interface UploadTextPageProps {
  userId: number; // 父组件传入的 userId
}

const UploadTextPage: React.FC<UploadTextPageProps> = ({ userId }) => {
  const [editorContent, setEditorContent] = useState<string>(""); // 編輯器內容
  const [fileList, setFileList] = useState<any[]>([]); // 文件列表
  const [title, setTitle] = useState<string>(""); // 標題

  // 標題變化處理
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  // 文件上傳處理
  const handleFileChange = ({ file, fileList }: any) => {
    if (file.status === "done") {
      message.success(`${file.name} 文件上传成功`);
    } else if (file.status === "error") {
      message.error(`${file.name} 文件上传失败`);
    }

    // 為每個文件生成 URL（只處理圖片、PDF 等文件）
    const updatedFileList = fileList.map((file: any) => {
      if (file.status === "done" && file.originFileObj) {
        // 如果文件是已上傳的，生成預覽 URL
        const fileUrl = URL.createObjectURL(file.originFileObj);
        return {
          ...file,
          url: fileUrl, // 將 URL 加入到 file 物件
        };
      }
      return file;
    });

    setFileList(updatedFileList);
  };

  // 刪除文件
  const handleDeleteFile = (file: any) => {
    const updatedList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(updatedList);
    message.info(`已删除文件 ${file.name}`);
  };

  // 提交表單處理
  const handleSubmit = async () => {
    if (!title.trim()) {
      message.error("請輸入標題！");
      return;
    }
    if (!editorContent.trim()) {
      message.error("請輸入文字內容！");
      return;
    }

    try {
      // 調用後端創建文檔的 API 函數，傳遞文檔內容和 URL
      const response = await createDocument(
        userId,
        title,
        editorContent,
        fileList
      );
      message.success("文檔創建成功！");
      console.log("提交成功:", response);
    } catch (error) {
      message.error("提交失敗，請稍後再試！");
      console.error("提交錯誤:", error);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <CustomHeader
        bgColor="#e9af88"
        menuColor={{ frontColor: "#000000", hoverColor: "#fff" }}
      />

      <Layout>
        {/* Sidebar */}
        <Sider width={250} style={{ background: "#f7f4f1", padding: 20 }}>
          <h3>已選標籤</h3>
          <div>
            {["創新", "高效", "現代"].map((tag) => (
              <Tag color="blue" closable key={tag}>
                {tag}
              </Tag>
            ))}
          </div>
        </Sider>

        {/* Content */}
        <Content style={{ padding: "20px", background: "#fff" }}>
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
            <TinyMCEEditor value={editorContent} onChange={setEditorContent} />

            {/* 文件上傳 */}
            <div style={{ marginTop: 20 }}>
              <Upload
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false} // 不直接上傳到服務器
                onRemove={handleDeleteFile}
                multiple
              >
                <Button icon={<UploadOutlined />}>上傳文件</Button>
              </Upload>
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
        </Content>
      </Layout>
    </Layout>
  );
};

export default UploadTextPage;
