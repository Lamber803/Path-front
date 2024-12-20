import React, { useEffect, useState } from "react";
import { Layout, Button, Spin, Modal, Input, message, Collapse } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  FolderAddOutlined,
} from "@ant-design/icons"; // 添加文件夹图标
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomHeader from "../custom-header/CustomHeader";

const { Sider, Content } = Layout;
const { Panel } = Collapse;

// 定义文档和文件夹类型
interface Document {
  documentId: number;
  title: string;
  parentId: number | null;
  url: string;
}

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]); // 存储文档列表
  const [loading, setLoading] = useState<boolean>(false); // 存储加载状态
  const [editingDocument, setEditingDocument] = useState<Document | null>(null); // 当前编辑的文档
  const [modalVisible, setModalVisible] = useState<boolean>(false); // 控制编辑弹窗
  const [creatingFolder, setCreatingFolder] = useState<boolean>(false); // 控制文件夹创建弹窗
  const navigate = useNavigate(); // 使用 useNavigate 来控制页面跳转

  // 假设用户ID已经获取
  const userId = 1; // 示例：当前用户ID

  useEffect(() => {
    // 获取用户的文档数据
    setLoading(true);
    axios
      .get(`/api/documents/search?userId=${userId}`)
      .then((response) => {
        setDocuments(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        message.error("加载文档失败");
      });
  }, [userId]);

  const handleDocumentClick = (documentId: number) => {
    console.log("Navigating to document:", documentId);
    navigate(`/documents/read?documentId=${documentId}`);
  };

  const handleEditClick = (document: Document) => {
    setEditingDocument(document);
    setModalVisible(true);
  };

  const handleDeleteClick = async (documentId: number) => {
    try {
      // 后端删除逻辑待后续实现
      setDocuments(documents.filter((doc) => doc.documentId !== documentId));
      message.success("文档删除成功");
    } catch (error) {
      console.error("Error deleting document:", error);
      message.error("删除文档失败");
    }
  };

  const handleCreateFolderClick = () => {
    setCreatingFolder(true);
  };

  const handleModalOk = async () => {
    if (!editingDocument?.title) {
      message.error("请输入文档标题");
      return;
    }
    try {
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
    setModalVisible(false);
  };

  const handleCreateFolderOk = (folderName: string) => {
    const newFolder = {
      documentId: Date.now(),
      title: folderName,
      parentId: null,
      url: "",
    };
    setDocuments([...documents, newFolder]);
    setCreatingFolder(false);
    message.success("文件夹创建成功");
  };

  const handleCreateFolderCancel = () => {
    setCreatingFolder(false);
  };

  // 递归渲染文档
  const renderDocuments = (parentId: number | null) => {
    return documents
      .filter((doc) => doc.parentId === parentId)
      .map((doc) => {
        if (!doc.title) return null;

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
                  fontSize: "14px",
                }}
              >
                {doc.title}
              </Button>
              <div>
                <Button
                  type="link"
                  onClick={() => handleEditClick(doc)}
                  icon={<EditOutlined />}
                  style={{ marginRight: 8, fontSize: 14 }}
                />
                <Button
                  type="link"
                  onClick={() => handleDeleteClick(doc.documentId)}
                  icon={<DeleteOutlined />}
                  danger
                  style={{ fontSize: 14, marginLeft: 8 }}
                />
              </div>
            </div>
          ),
          children: renderDocuments(doc.documentId),
        };
      });
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f7f4f1" }}>
      <CustomHeader
        bgColor="#e9af88"
        menuColor={{ frontColor: "#000000", hoverColor: "#fff" }}
      />

      <Layout>
        <Sider width={250} style={{ background: "#f7f4f1", padding: "20px" }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              maxHeight: "85vh",
            }}
          >
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
                items={renderDocuments(null)}
              />
            </Spin>
          </div>
        </Sider>

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

      <Modal
        title="编辑文档"
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Input
          value={editingDocument?.title || ""}
          onChange={(e) =>
            setEditingDocument({ ...editingDocument!, title: e.target.value })
          }
          placeholder="请输入文档标题"
        />
      </Modal>

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
