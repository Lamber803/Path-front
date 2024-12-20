import React, { useState } from "react";
import { Layout } from "antd";
import CustomHeader from "../custom-header/CustomHeader"; // 保留自定义 Header
import DocumentsList from "./DocumentsList"; // 引入 DocumentList 组件
import DocumentContent from "./DocumentContent"; // 引入 DocumentDetail 组件

const { Sider, Content } = Layout;

interface DocumentsPageProps {
  userId: number; // Expecting userId to be passed as a prop
}

const DocumentsPage: React.FC<DocumentsPageProps> = ({ userId }) => {
  const [selectedDocument, setSelectedDocument] = useState<number | null>(null); // 当前选择的文档 ID

  // 选择文档时的回调
  const handleSelectDocument = (id: number) => {
    setSelectedDocument(id);
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f7f4f1" }}>
      {/* Header */}
      <CustomHeader
        bgColor="#e9af88"
        menuColor={{ frontColor: "#000000", hoverColor: "#fff" }}
      />

      <Layout>
        {/* Sidebar */}
        <Sider
          width={250}
          style={{
            background: "#f7f4f1",
            padding: "20px",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflowY: "auto", // 使 Sider 可滚动
              maxHeight: "85vh", // 确保 Sider 不会超出屏幕高度
            }}
          >
            {/* Render Document List */}
            <DocumentsList
              userId={userId}
              onSelectDocument={handleSelectDocument} // Pass the selection handler
            />
          </div>
        </Sider>

        {/* Content */}
        <Layout style={{ padding: "20px" }}>
          <Content
            style={{
              background: "#fff",
              padding: "20px",
              margin: "0 16px",
              borderRadius: "8px",
            }}
          >
            {/* Display document detail if one is selected */}
            {selectedDocument ? (
              <DocumentContent documentId={selectedDocument} />
            ) : (
              <div>请选择一个文档以查看详情</div>
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DocumentsPage;
