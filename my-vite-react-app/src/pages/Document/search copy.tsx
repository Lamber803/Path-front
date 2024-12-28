import React, { useEffect, useState } from "react";
import { Layout, Button, Spin, Modal, Input, message, Collapse } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  FolderAddOutlined,
} from "@ant-design/icons"; // 添加文件夹图标
import { useNavigate } from "react-router-dom";
import CustomHeader from "../custom-header/CustomHeader";

const { Sider, Content } = Layout;
const { Panel } = Collapse;

// 定义文档和文件夹类型
interface Document {
  documentId: number;
  title: string;
  parentId: number | null; // 用于表示文件夹层级，根级文件夹为null
  url: string; // 由于后端没有返回 url，url 可以为空
}

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]); // 存储文档列表
  const [loading, setLoading] = useState<boolean>(false); // 存储加载状态
  const [editingDocument, setEditingDocument] = useState<Document | null>(null); // 当前编辑的文档
  const [modalVisible, setModalVisible] = useState<boolean>(false); // 控制编辑弹窗
  const [creatingFolder, setCreatingFolder] = useState<boolean>(false); // 控制文件夹创建弹窗
  const navigate = useNavigate(); // 使用 useNavigate 来控制页面跳转

  useEffect(() => {
    // 数据加载逻辑将待后端 API 集成
    setLoading(true);
    setTimeout(() => {
      // 模拟加载完成
      setDocuments([]); // 初始为空，之后从后端获取数据
      setLoading(false);
    }, 1000);
  }, []);

  const handleDocumentClick = (documentId: number) => {
    console.log("Navigating to document:", documentId); // 确保 documentId 正确传递
    navigate(`/documents/read?documentId=${documentId}`); // 跳转到文档详情页
  };

  const handleEditClick = (document: Document) => {
    setEditingDocument(document);
    setModalVisible(true); // 打开编辑弹窗
  };

  const handleDeleteClick = async (documentId: number) => {
    try {
      // 后端删除逻辑待后续实现
      setDocuments(documents.filter((doc) => doc.documentId !== documentId)); // 删除成功后从列表中移除该文档
      message.success("文档删除成功");
    } catch (error) {
      console.error("Error deleting document:", error);
      message.error("删除文档失败");
    }
  };

  const handleCreateFolderClick = () => {
    setCreatingFolder(true); // 打开创建文件夹弹窗
  };

  const handleModalOk = async () => {
    if (!editingDocument?.title) {
      message.error("请输入文档标题");
      return;
    }
    try {
      // 后端编辑逻辑待后续实现
      setDocuments(
        documents.map((doc) =>
          doc.documentId === editingDocument.documentId
            ? { ...doc, title: editingDocument.title }
            : doc
        )
      );
      setModalVisible(false);
      message.success("文档编辑成功");
    } catch (error) {
      console.error("Error editing document:", error);
      message.error("编辑文档失败");
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false); // 关闭编辑弹窗
  };

  const handleCreateFolderOk = (folderName: string) => {
    const newFolder = {
      documentId: Date.now(), // 使用时间戳作为文件夹ID
      title: folderName,
      parentId: null,
      url: "",
    };
    setDocuments([...documents, newFolder]);
    setCreatingFolder(false);
    message.success("文件夹创建成功");
  };

  const handleCreateFolderCancel = () => {
    setCreatingFolder(false); // 关闭文件夹创建弹窗
  };

  // 递归渲染文档和文件夹
  const renderDocuments = (parentId: number | null) => {
    return documents
      .filter((doc) => doc.parentId === parentId)
      .map((doc) => {
        // 确保文档有标题
        if (!doc.title) return null; // 如果没有标题，则跳过该文档的渲染

        return {
          key: doc.documentId,
          label: (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "5px 0px",
              }}
            >
              <Button
                type="link"
                onClick={(e) => {
                  e.preventDefault();
                  handleDocumentClick(doc.documentId);
                }}
                style={{
                  color: "#5c6bc0",
                  fontWeight: "bold",
                  textAlign: "left",
                  paddingLeft: 0,
                  fontSize: "14px", // 调整字体大小
                }}
              >
                {doc.title}
              </Button>
              <div>
                <Button
                  type="link"
                  onClick={() => handleEditClick(doc)}
                  icon={<EditOutlined />}
                  style={{
                    marginRight: 8,
                    fontSize: 14, // 调整图标大小
                  }}
                />
                <Button
                  type="link"
                  onClick={() => handleDeleteClick(doc.documentId)}
                  icon={<DeleteOutlined />}
                  danger
                  style={{
                    fontSize: 14, // 调整图标大小
                    marginLeft: 8,
                  }}
                />
              </div>
            </div>
          ),
          children: renderDocuments(doc.documentId), // 递归渲染子文档
        };
      });
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
              overflowY: "auto", // 使 Sider 可滾動
              maxHeight: "85vh", // 确保 Sider 不会超出屏幕高度
            }}
          >
            {/* <h2 style={{ paddingLeft: "10px" }}>我的文档</h2>
            <Button
              type="primary"
              icon={<FolderAddOutlined />}
              onClick={handleCreateFolderClick}
              style={{ marginBottom: 16 }}
            >
              新建文件夹
            </Button>
            <Spin spinning={loading} tip="加载中...">
              <Collapse
                defaultActiveKey={["1"]}
                ghost
                items={renderDocuments(null)} // 渲染根文档
              />
            </Spin> */}
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
            <div>请选择一个文档以查看详情</div>
          </Content>
        </Layout>
      </Layout>

      {/* 编辑文档弹窗 */}
      <Modal
        title="编辑文档"
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Input
          value={editingDocument?.title || ""}
          onChange={(e) =>
            setEditingDocument({
              ...editingDocument!,
              title: e.target.value,
            })
          }
          placeholder="请输入文档标题"
        />
      </Modal>

      {/* 创建文件夹弹窗 */}
      <Modal
        title="新建文件夹"
        visible={creatingFolder}
        onOk={() => handleCreateFolderOk("新文件夹")}
        onCancel={handleCreateFolderCancel}
      >
        <Input placeholder="请输入文件夹名称" />
      </Modal>
    </Layout>
  );
};

export default DocumentsPage;
