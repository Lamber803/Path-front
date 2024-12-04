import React, { useEffect, useState, useCallback } from "react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import MyUploadAdapterPlugin from "../../../components/MyUploadAdapterPlugin"; // 引入自定义上传适配器插件

interface MainContentProps {
  documentId: number | null; // 通过 props 传递 documentId
}

const MainContent: React.FC<MainContentProps> = ({ documentId }) => {
  const [documentContent, setDocumentContent] = useState<string>("");
  const [documentDetails, setDocumentDetails] = useState<any>({}); // 用于存储文档详情
  const [loading, setLoading] = useState<boolean>(false); // 用于显示加载提示

  // 缓存文档内容，避免重复请求
  const fetchDocumentContent = useCallback(async () => {
    if (!documentId) return;

    const cachedDocument = sessionStorage.getItem(`document-${documentId}`);
    if (cachedDocument) {
      // 使用缓存的文档内容
      const parsedData = JSON.parse(cachedDocument);
      setDocumentContent(parsedData.htmlContent);
      setDocumentDetails(parsedData.details);
      return;
    }

    setLoading(true); // 设置加载状态为 true
    try {
      const response = await axios.get(
        `http://localhost:8080/api/documents/search/${documentId}`, // 获取单个文档
        {
          headers: {
            "Content-Type": "application/json", // 改为 "application/json" 更符合标准的 API 调用
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      // 更新文档内容和文档详情
      const documentData = response.data;
      setDocumentContent(documentData.htmlContent);
      setDocumentDetails({
        documentId: documentData.documentId,
        userId: documentData.userId,
        title: documentData.title,
        createdAt: formatDate(documentData.createdAt),
        updatedAt: formatDate(documentData.updatedAt),
      });

      // 缓存文档内容
      sessionStorage.setItem(
        `document-${documentId}`,
        JSON.stringify({
          htmlContent: documentData.htmlContent,
          details: documentData,
        })
      );
    } catch (error) {
      console.error("Error fetching document content:", error);
    } finally {
      setLoading(false); // 数据请求完成，隐藏加载提示
    }
  }, [documentId]);

  // 格式化时间
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // 使用本地格式输出日期和时间
  };

  // 依赖于 documentId，组件加载时请求数据
  useEffect(() => {
    fetchDocumentContent();
  }, [documentId, fetchDocumentContent]);

  return (
    <div className="main-content">
      <h3>文档内容</h3>

      {/* 如果正在加载，显示 loading 提示 */}
      {loading ? (
        <div className="loading-message">文档正在加载，请稍候...</div>
      ) : (
        <>
          {/* 渲染文档的基本信息 */}
          <div className="document-info">
            <p>
              <strong>文档ID:</strong> {documentDetails.documentId}
            </p>
            <p>
              <strong>用户ID:</strong> {documentDetails.userId}
            </p>
            <p>
              <strong>标题:</strong> {documentDetails.title}
            </p>
            <p>
              <strong>创建时间:</strong> {documentDetails.createdAt}
            </p>
            <p>
              <strong>更新时间:</strong> {documentDetails.updatedAt}
            </p>
          </div>

          {/* 渲染文档内容 */}
          <Editor
            apiKey="fjnm5g2otneaagwyv2ar146jny63sai9ft966tr14yt3gcyc" // TinyMCE API Key
            value={documentContent} // 绑定文档内容到编辑器
            init={{
              height: 500,
              menubar: false,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar:
                "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | outdent indent | bullist numlist | link image",
              // 使用自定义上传适配器插件
              extraPlugins: [MyUploadAdapterPlugin],
              file_picker_types: "image", // 只允许图片上传
              disable: true, // 设置为只读模式
              // 配置上传图片时的文件选择回调
              file_picker_callback: (callback: any, value: any, meta: any) => {
                // 打开文件选择框
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*"; // 只允许选择图片
                input.onchange = async () => {
                  const file = input.files![0];
                  const formData = new FormData();
                  formData.append("file", file);

                  // 模拟上传文件，生成本地 URL（你可以改为真实上传）
                  const imageUrl = URL.createObjectURL(file);
                  callback(imageUrl); // 返回图像 URL
                };
                input.click();
              },
            }}
            disabled={true} // 禁用编辑器，即只读模式
          />
        </>
      )}
    </div>
  );
};

export default MainContent;
