import React, { useState } from "react";
import { Input, Button, Upload, Card, Tag, Typography, message } from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { createDocument } from "./document"; // 引入后端 API 函数
import TinyMCEEditor from "../../components/TinyMCEEditor"; // 引入 TinyMCEEditor 组件

const { Text } = Typography;

interface DocumentFormProps {
  userId: number; // 父组件传入的 userId
}

const DocumentForm: React.FC<DocumentFormProps> = ({ userId }) => {
  const [editorContent, setEditorContent] = useState<string>(""); // 编辑器内容
  const [fileList, setFileList] = useState<any[]>([]); // 文件列表
  const [title, setTitle] = useState<string>(""); // 标题

  // 标题变化处理
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  // 文件上传处理
  const handleFileChange = ({ file, fileList }: any) => {
    if (file.status === "done") {
      message.success(`${file.name} 文件上传成功`);
    } else if (file.status === "error") {
      message.error(`${file.name} 文件上传失败`);
    }

    // 为每个文件生成 URL（只处理图片、PDF 等文件）
    const updatedFileList = fileList.map((file: any) => {
      if (file.status === "done" && file.originFileObj) {
        // 如果文件是已上传的，生成预览 URL
        const fileUrl = URL.createObjectURL(file.originFileObj);
        return {
          ...file,
          url: fileUrl, // 将 URL 加入到 file 对象
        };
      }
      return file;
    });

    setFileList(updatedFileList);
  };

  // 删除文件
  const handleDeleteFile = (file: any) => {
    const updatedList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(updatedList);
    message.info(`已删除文件 ${file.name}`);
  };

  // 提交表单处理
  const handleSubmit = async () => {
    if (!title.trim()) {
      message.error("请输入标题！");
      return;
    }
    if (!editorContent.trim()) {
      message.error("请输入文字内容！");
      return;
    }

    try {
      // 调用后端创建文档的 API 函数，传递文档内容和文件 URL
      const response = await createDocument(
        userId,
        title,
        editorContent,
        fileList
      );
      message.success("文档创建成功！");
      console.log("提交成功:", response);
    } catch (error) {
      message.error("提交失败，请稍后再试！");
      console.error("提交错误:", error);
    }
  };

  return (
    <Card style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* 标题输入框 */}
      <Input
        placeholder="请输入标题"
        value={title}
        onChange={handleTitleChange}
        style={{ marginBottom: 20 }}
        prefix={<FileTextOutlined />}
      />

      {/* 富文本编辑器 */}
      <TinyMCEEditor value={editorContent} onChange={setEditorContent} />

      {/* 文件上传 */}
      <div style={{ marginTop: 20 }}>
        <Upload
          fileList={fileList}
          onChange={handleFileChange}
          beforeUpload={() => false} // 不直接上传到服务器
          onRemove={handleDeleteFile}
          multiple
        >
          <Button icon={<UploadOutlined />}>上传文件</Button>
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
              {/* 显示图片预览 */}
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

      {/* 提交按钮 */}
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
        提交文档
      </Button>
    </Card>
  );
};

export default DocumentForm;
