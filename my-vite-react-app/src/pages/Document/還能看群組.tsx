import React, { useState } from "react";
import { Collapse, Button, Modal, Input, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // 使用 useNavigate 代替 useHistory

// 模擬的群組資料和文檔資料
const mockGroups = [
  { groupId: 1, groupName: "群組1" },
  { groupId: 2, groupName: "群組2" },
  { groupId: 3, groupName: "群組3" },
];

const mockDocuments = {
  1: [
    { documentId: 1, title: "文檔1-1" },
    { documentId: 2, title: "文檔1-2" },
  ],
  2: [],
  3: [
    { documentId: 3, title: "文檔3-1" },
    { documentId: 4, title: "文檔3-2" },
  ],
};

const { Panel } = Collapse;

const DocumentsList = ({ onSelectDocument }) => {
  const navigate = useNavigate(); // 使用 useNavigate 代替 useHistory
  const [groups, setGroups] = useState(mockGroups); // 模擬群組資料
  const [documents, setDocuments] = useState(mockDocuments); // 模擬文檔資料
  const [newGroupName, setNewGroupName] = useState(""); // 用於保存新群組的名稱
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false); // 控制顯示創建群組的模態框

  // 創建群組
  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      message.error("群組名稱不能為空！");
      return;
    }

    // 模擬群組創建
    const newGroup = {
      groupId: groups.length + 1,
      groupName: newGroupName,
    };
    setGroups((prevGroups) => [...prevGroups, newGroup]);

    // 關閉模態框並清空輸入框
    setShowCreateGroupModal(false);
    setNewGroupName("");
    message.success("群組創建成功！");
  };

  // 刪除群組
  const handleDeleteGroup = (groupId) => {
    // 刪除群組前的確認提示
    Modal.confirm({
      title: "確定要刪除此群組嗎？",
      content: "刪除群組後，所有該群組下的文檔也將被刪除。",
      onOk: () => {
        // 刪除群組
        setGroups((prevGroups) =>
          prevGroups.filter((group) => group.groupId !== groupId)
        );
        delete documents[groupId]; // 刪除群組下的文檔
        setDocuments({ ...documents }); // 更新文檔狀態
        message.success("群組已刪除！");
      },
      onCancel: () => {
        message.info("取消刪除");
      },
    });
  };

  // 跳轉到上傳頁面
  const handleGoToUpload = () => {
    navigate("/upload"); // 使用 navigate 來跳轉到上傳頁面
  };

  return (
    <div className="document-list">
      {/* 創建群組按鈕 */}
      <div style={{ marginBottom: "20px" }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowCreateGroupModal(true)}
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
            style={{ marginRight: "10px" }}
          >
            創建
          </Button>
          <Button onClick={() => setShowCreateGroupModal(false)}>取消</Button>
        </div>
      </Modal>

      {/* 顯示群組列表 */}
      {groups.length === 0 ? (
        <p>沒有群組。</p>
      ) : (
        <Collapse defaultActiveKey={[]} bordered>
          {groups.map((group) => (
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
                    onClick={handleGoToUpload}
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
              // extra={<span>點擊折疊/展開</span>}
            >
              {/* 展開群組，顯示文檔列表 */}
              {documents[group.groupId]?.length > 0 ? (
                <ul>
                  {documents[group.groupId].map((doc) => (
                    <li
                      key={doc.documentId}
                      style={{ cursor: "pointer" }}
                      onClick={() => onSelectDocument(doc.documentId)} // 選擇文檔時傳遞文檔 ID
                    >
                      <h3>{doc.title}</h3>
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
      {groups.length === 0 && <p>沒有群組和文檔。</p>}
    </div>
  );
};

export default DocumentsList;
