import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { Collapse, Button, Modal, Input, message } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // 使用 useNavigate 代替 useHistory

interface DocumentDTO {
  DocumentId?: number;
  groupId: number;
}

interface DocumentGroupDTO {
  groupId?: number;
  userId: number;
  groupName: string;
  documents?: DocumentDTO[];
}

interface DocumentsListProps {
  userId: number;
  onSelectDocument: (id: number) => void; // 选择文档的回调
  onCreateDocument: () => void; // 触发创建文档的回调
  onGroupIdChange: (id: number) => void; // 父组件传入的回调函数
}

const { Panel } = Collapse;

const DocumentsList: React.FC<DocumentsListProps> = ({
  userId,
  onSelectDocument,
  onCreateDocument,
  onGroupIdChange,
}) => {
  const navigate = useNavigate();
  const [documentGroups, setDocumentGroups] = useState<DocumentGroupDTO[]>([]); // 群組資料
  const [documents, setDocuments] = useState<{ [key: number]: Document[] }>({}); // 文檔資料
  const [newGroupName, setNewGroupName] = useState(""); // 新群組名稱
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false); // 控制顯示創建群組模態框
  const [editingDocument, setEditingDocument] = useState<number | null>(null); // 編輯中的文檔 ID
  const [editedTitle, setEditedTitle] = useState(""); // 編輯中的文檔標題
  const [loading, setLoading] = useState(false); // 定義 loading 狀態
  const [error, setError] = useState<string | null>(null); // 错误信息

  // 加載文檔組資料
  useEffect(() => {
    if (userId) {
      setLoading(true);
      setError(null);

      // 發送 API 請求查詢文檔組資料
      axios
        .get(`http://localhost:8080/api/document-groups/user`, {
          params: { userId },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // 使用 JWT Token 進行身份驗證
          },
        })
        .then((response) => {
          const data = response.data;

          // 如果返回的數據是陣列，則更新文檔組列表
          if (Array.isArray(data)) {
            setDocumentGroups(data);
          } else {
            setError("返回的數據格式無效");
          }
        })
        .catch((error) => {
          setError("無法加載文檔組資料");
          console.error("加載文檔組資料失敗：", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId]);

  // 創建群組
  const handleCreateGroup = useCallback(() => {
    if (newGroupName.trim()) {
      setLoading(true); // 開始加載
      const newGroupData = {
        groupName: newGroupName,
        userId: userId,
      };

      axios
        .post(
          "http://localhost:8080/api/document-groups/create",
          newGroupData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        )
        .then((response) => {
          const createdGroup = response.data;
          setDocumentGroups((prevGroups) => [...prevGroups, createdGroup]);
          setDocuments((prevDocuments) => ({
            ...prevDocuments,
            [createdGroup.groupId]: [], // 初始創建時該群組下沒有文檔
          }));
          setNewGroupName("");
          setShowCreateGroupModal(false);
          message.success("群組創建成功！");
        })
        .catch((error) => {
          if (error.response) {
            message.error(error.response.data.message || "創建群組失敗！");
          } else {
            message.error("網絡錯誤，請稍後再試！");
          }
        })
        .finally(() => {
          setLoading(false); // 結束加載
        });
    } else {
      message.error("群組名稱不能為空！");
    }
  }, [newGroupName, userId]);

  // 刪除群組
  const handleDeleteGroup = (groupId: number) => {
    Modal.confirm({
      title: "確定要刪除此文檔組嗎？",
      content: "刪除後此文檔組及其所有文檔將無法恢復。",
      onOk: () => {
        console.log(groupId);
        axios
          .delete("http://localhost:8080/api/document-groups", {
            params: { groupId },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            if (response.status === 204) {
              message.success("文檔組刪除成功");
              // 刪除成功後，更新 UI 或刷新頁面
              setDocumentGroups((prevGroups) =>
                prevGroups.filter((group) => group.groupId !== groupId)
              );
              setDocuments((prevDocs) => {
                const updatedDocs = { ...prevDocs };
                delete updatedDocs[groupId];
                return updatedDocs;
              });
            }
          })
          .catch((error) => {
            if (error.response?.status === 404) {
              message.error("文檔組不存在！");
            } else {
              message.error("刪除失敗，請稍後再試！");
            }
          });
      },
    });
  };

  const handlePanelChange = (activeKey: string | string[]) => {
    // 如果沒有展開的組，則不做任何操作
    const groupId = Array.isArray(activeKey) ? activeKey[0] : activeKey;
    if (groupId && !documents[groupId]) {
      setLoading(true);
      axios
        .get(`http://localhost:8080/api/documents/group?groupId=${groupId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        })
        .then((response) => {
          setDocuments((prevDocs) => ({
            ...prevDocs,
            [groupId]: response.data,
          }));
        })
        .catch((error) => {
          console.error("加載文檔失敗", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // 刪除文檔
  const handleDeleteDocument = (groupId: number, documentId: number) => {
    Modal.confirm({
      title: "確定要刪除此文檔嗎？",
      content: "刪除文檔後無法恢復。",
      onOk: () => {
        setLoading(true); // 開始加載

        // 發送刪除請求到後端 API
        axios
          .delete(`http://localhost:8080/api/documents/delete`, {
            params: { documentId },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            // 如果刪除成功，更新前端狀態
            if (response.status === 204) {
              setDocuments((prevDocs) => {
                const updatedDocs = { ...prevDocs };
                updatedDocs[groupId] = updatedDocs[groupId].filter(
                  (doc) => doc.documentId !== documentId
                );
                return updatedDocs;
              });
              message.success("文檔已刪除！");
            } else {
              message.error("文檔刪除失敗，請稍後再試。");
            }
          })
          .catch((error) => {
            // 處理錯誤情況
            if (error.response?.status === 404) {
              message.error("該文檔未找到！");
            } else {
              message.error("刪除文檔時出錯，請稍後再試！");
            }
          })
          .finally(() => {
            setLoading(false); // 結束加載
          });
      },
      onCancel: () => {
        message.info("取消刪除");
      },
    });
  };

  // 開始編輯文檔
  const handleEditDocument = (doc) => {
    setEditingDocument(doc.documentId);
    setEditedTitle(doc.title);
  };

  // 保存文檔編輯
  const handleSaveDocument = (groupId, documentId) => {
    if (!editedTitle.trim()) {
      message.error("文檔標題不能為空！");
      return;
    }

    setDocuments((prevDocs) => {
      const updatedDocs = { ...prevDocs };
      updatedDocs[groupId] = updatedDocs[groupId].map((doc) =>
        doc.documentId === documentId ? { ...doc, title: editedTitle } : doc
      );
      return updatedDocs;
    });
    setEditingDocument(null); // 結束編輯
    message.success("文檔標題已更新！");
  };

  return (
    <div className="document-list">
      {/* 創建群組按鈕 */}
      <div style={{ marginBottom: "20px" }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowCreateGroupModal(true)}
          style={{
            backgroundColor: "#b86159",
          }}
        >
          創建群組
        </Button>
      </div>

      {/* 創建群組的模態框 */}
      <Modal
        title="創建新群組"
        visible={showCreateGroupModal}
        onCancel={() => setShowCreateGroupModal(false)}
        footer={null}
        centered
      >
        <Input
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="請輸入群組名稱"
          style={{ marginBottom: "20px" }}
        />
        <div style={{ textAlign: "right" }}>
          <Button
            type="primary"
            onClick={handleCreateGroup}
            style={{ marginRight: "10px", backgroundColor: "#b86159" }}
          >
            創建
          </Button>
          <Button onClick={() => setShowCreateGroupModal(false)}>取消</Button>
        </div>
      </Modal>

      {/* 顯示群組列表 */}
      {documentGroups.length === 0 ? (
        <p>沒有群組。</p>
      ) : (
        <Collapse onChange={handlePanelChange}>
          {documentGroups.map((group) => (
            <Panel
              header={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: "0px",
                  }}
                >
                  <span style={{ paddingTop: "23px" }}>{group.groupName}</span>

                  {/* 小型上傳按鈕 */}
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={onCreateDocument}
                    style={{
                      fontSize: "16px", // 小型按鈕
                      padding: " 5px",
                      marginLeft: "50px",
                      marginTop: "23px",
                    }}
                  />
                  {/* 刪除圖標 */}
                  <DeleteOutlined
                    style={{
                      color: "red",
                      cursor: "pointer",
                      marginTop: "23px",
                    }}
                    onClick={() => handleDeleteGroup(group.groupId)}
                  />
                </div>
              }
              key={group.groupId}
              onClick={() => {
                // 触发回调，将选择的 groupId 传递给父组件
                onGroupIdChange(group.groupId); // 传递 groupId
              }}
            >
              {/* 展開群組，顯示文檔列表 */}
              {documents[group.groupId] ? (
                <ul>
                  {documents[group.groupId].map((doc) => (
                    <li
                      key={doc.documentId}
                      onClick={() => onSelectDocument(doc.documentId)}
                      style={{ cursor: "pointer" }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {/* 編輯文檔標題 */}
                        {editingDocument === doc.documentId ? (
                          <Input
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            style={{ width: "200px", marginRight: "10px" }}
                          />
                        ) : (
                          <h3
                            style={{ flex: 1 }}
                            onClick={() => onSelectDocument(doc.documentId)}
                          >
                            {doc.title}
                          </h3>
                        )}

                        {/* 編輯按鈕 */}
                        {editingDocument === doc.documentId ? (
                          <Button
                            type="link"
                            onClick={() =>
                              handleSaveDocument(group.groupId, doc.documentId)
                            }
                          >
                            保存
                          </Button>
                        ) : (
                          <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => handleEditDocument(doc)}
                          />
                        )}

                        {/* 刪除按鈕 */}
                        <Button
                          type="link"
                          icon={<DeleteOutlined />}
                          onClick={() =>
                            handleDeleteDocument(group.groupId, doc.documentId)
                          }
                          style={{ color: "red" }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                // 如果沒有文檔，顯示提示
                <p>此群組無文檔。</p>
              )}
            </Panel>
          ))}
        </Collapse>
      )}

      {/* 如果沒有群組和文檔，提示沒有資料 */}
      {/* {documentGroups.length === 0 && <p>沒有群組和文檔。</p>} */}
    </div>
  );
};

export default DocumentsList;
