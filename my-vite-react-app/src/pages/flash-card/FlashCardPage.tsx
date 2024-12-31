import React, { useState, useEffect, useCallback } from "react";
import {
  Layout,
  Input,
  Button,
  Card,
  Typography,
  message,
  Modal,
  Row,
  Col,
  List,
} from "antd";
import axios from "axios";
import {
  UploadOutlined,
  DeleteOutlined,
  StarOutlined,
} from "@ant-design/icons";
import CustomHeader from "../custom-header/CustomHeader";
import styled from "styled-components";

const { Title, Text } = Typography;
const { Header, Footer, Sider, Content } = Layout;

interface FlashCardPageProps {
  userId: number; // 父组件传入的 userId
}

interface FlashcardDTO {
  flashcardId?: number;
  groupId: number;
  word: string;
  definition: string;
  isFavorite: boolean;
}

interface FlashcardGroupDTO {
  groupId?: number;
  userId: number;
  groupName: string;
  flashcards?: FlashcardDTO[];
}

const FlashCardPage: React.FC<FlashCardPageProps> = ({ userId }) => {
  const [flashcardGroups, setFlashcardGroups] = useState<FlashcardGroupDTO[]>(
    []
  );
  const [newGroupName, setNewGroupName] = useState<string>("");
  const [newWord, setNewWord] = useState<string>("");
  const [newDefinition, setNewDefinition] = useState<string>("");
  const [isGroupModalVisible, setIsGroupModalVisible] =
    useState<boolean>(false);
  const [isCardModalVisible, setIsCardModalVisible] = useState<boolean>(false);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState<number | null>(
    null
  );
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [learningMode, setLearningMode] = useState<"sequence" | "random">(
    "sequence"
  );
  const [quizMode, setQuizMode] = useState<boolean>(false);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [isViewingFavorites, setIsViewingFavorites] = useState<boolean>(false); // 控制是否查看收藏庫

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // 假設在這裡你會發送 API 請求來加載收藏庫

  useEffect(() => {
    if (userId) {
      setLoading(true);
      setError(null);

      // 發送 API 請求查詢文檔
      axios
        .get(
          `http://localhost:8080/api/flashcard-group/user?userId=${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        )
        .then((response) => {
          const data = response.data;
          console.log(data); // 查看返回的數據結構

          // 檢查返回的數據是否為陣列
          if (Array.isArray(data)) {
            setFlashcardGroups(data);
          } else {
            setError("返回的數據格式無效");
          }
        })
        .catch(() => {
          setError("無法加載字卡組");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId]);

  // 查詢該字卡組下的所有字卡
  useEffect(() => {
    if (selectedGroupIndex !== null) {
      setLoading(true);
      setError(null);

      const groupId = flashcardGroups[selectedGroupIndex]?.groupId;

      if (groupId) {
        axios
          .get(`http://localhost:8080/api/flashcard/group?groupId=${groupId}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          })
          .then((response) => {
            const data = response.data;
            console.log("返回的字卡數據:", data);

            // 更新选中的字卡组
            setFlashcardGroups((prevGroups) =>
              prevGroups.map((group, index) =>
                index === selectedGroupIndex
                  ? { ...group, flashcards: data }
                  : group
              )
            );
          })
          .catch(() => {
            setError("無法加載字卡");
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [selectedGroupIndex]); // 只依赖 selectedGroupIndex

  // 創建字卡組別
  const handleCreateGroup = useCallback(() => {
    if (newGroupName) {
      const newGroupData: FlashcardGroupDTO = {
        groupName: newGroupName,
        userId: userId, // 当前用户的 ID
        flashcards: [], // 初始时字卡组为空
      };

      setLoading(true);

      // 发送 API 请求来创建字卡组
      axios
        .post(
          "http://localhost:8080/api/flashcard-group/create", // 后端的创建字卡组接口
          newGroupData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        )
        .then((response) => {
          // 请求成功后，更新字卡组列表
          const createdGroup = response.data;
          setFlashcardGroups((prevGroups) => [...prevGroups, createdGroup]);
          setNewGroupName(""); // 清空输入框
          setIsGroupModalVisible(false); // 关闭模态框
          message.success("字卡組別創建成功！");
        })
        .catch(() => {
          message.error("創建字卡组失敗，請稍候再試！");
        })
        .finally(() => setLoading(false));
    } else {
      message.error("請輸入組別名稱");
    }
  }, [newGroupName, userId]);

  // 刪除字卡組別
  const handleDeleteGroup = (index: number) => {
    Modal.confirm({
      title: "確認刪除",
      content: "確定要刪除這個字卡組別嗎？此操作無法恢復。",
      okText: "刪除",
      cancelText: "取消",
      onOk: () => {
        const groupId = flashcardGroups[index].groupId; // Get the groupId of the selected group
        setLoading(true);

        axios
          .delete(
            `http://localhost:8080/api/flashcard-group/delete?groupId=${groupId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // Ensure the token is passed
              },
            }
          )
          .then(() => {
            const updatedGroups = flashcardGroups.filter((_, i) => i !== index); // Remove the group from the list
            setFlashcardGroups(updatedGroups); // Update state with the new list
            setSelectedGroupIndex(null); // Clear selected group index
            message.success("字卡組別已刪除！"); // Show success message
          })
          .catch((error) => {
            if (error.response) {
              if (error.response.status === 404) {
                message.error("字卡組別不存在，請確認是否已被刪除！");
              } else if (error.response.status === 500) {
                message.error("伺服器錯誤，刪除字卡組別失敗！");
              } else {
                message.error("刪除字卡組別失敗，請稍後再試！");
              }
            } else {
              message.error("網絡錯誤，請檢查您的網絡連接！");
            }
          })
          .finally(() => setLoading(false));
      },
    });
  };

  const handleAddCard = useCallback(() => {
    if (selectedGroupIndex !== null && newWord && newDefinition) {
      const selectedGroup = flashcardGroups[selectedGroupIndex];

      if (!selectedGroup) {
        message.error("無效的組別，請選擇一個有效的組別");
        return;
      }

      const groupId = selectedGroup.groupId;

      if (!groupId) {
        message.error("該組別無效，請選擇一個有效的組別");
        return;
      }

      const newFlashcardDTO: FlashcardDTO = {
        word: newWord,
        definition: newDefinition,
        groupId: groupId,
        isFavorite: false,
      };

      // Sending the POST request to create a new flashcard
      axios
        .post(
          "http://localhost:8080/api/flashcard/create", // Backend API endpoint
          newFlashcardDTO,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        )
        .then((response) => {
          // Update the state with the newly created flashcard
          const createdFlashcard = response.data;

          const updatedGroups = [...flashcardGroups];
          updatedGroups[selectedGroupIndex].flashcards?.push(createdFlashcard); // Add the new flashcard to the group

          setFlashcardGroups(updatedGroups); // Update the flashcard groups state

          // Clear the input fields and close the modal
          setNewWord("");
          setNewDefinition("");
          setIsCardModalVisible(false);

          message.success("字卡創建成功！");
        })
        .catch(() => {
          message.error("創建字卡失敗，請稍後再試！");
        })
        .finally(() => setLoading(false));
    } else {
      message.error("請填寫字卡的單字和意思，並選擇一個組別");
    }
  }, [selectedGroupIndex, newWord, newDefinition, flashcardGroups]);

  // 將字卡添加/移除收藏庫
  // 将 toggleFavorite 函数优化
  const toggleFavorite = (cardId: number) => {
    if (selectedGroupIndex !== null) {
      const updatedGroups = [...flashcardGroups];
      const group = updatedGroups[selectedGroupIndex];

      const card = group.flashcards?.find(
        (card) => card.flashcardId === cardId
      );
      if (!card) {
        message.error("字卡未找到，無法更新收藏狀態");
        return;
      }

      // 切换收藏状态
      const newFavoriteStatus = !card.isFavorite;
      card.isFavorite = newFavoriteStatus;

      // 更新本地状态
      setFlashcardGroups(updatedGroups);
      message.success(
        newFavoriteStatus ? "字卡已加入收藏庫！" : "字卡已從收藏庫移除！"
      );

      // 发起 API 请求更新收藏状态
      axios
        .post("http://localhost:8080/api/flashcard/toggle-favorite", null, {
          params: {
            flashcardId: card.flashcardId,
            isFavorite: newFavoriteStatus,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        })
        .then(() => {
          console.log("字卡收藏狀態已更新", card.flashcardId);
        })
        .catch((err) => {
          console.error("更新收藏狀態失敗", err);
          // 如果更新失败，恢复原来的状态
          card.isFavorite = !newFavoriteStatus;
          setFlashcardGroups(updatedGroups);
          message.error("更新收藏狀態失敗，請稍後再試！");
        });
    }
  };

  // 學習模式切換
  const handleModeChange = () => {
    setLearningMode(learningMode === "sequence" ? "random" : "sequence");
    setCurrentCardIndex(0); // 切換模式時重置當前卡片索引
  };

  // 切換字卡背面
  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  // 下一張字卡
  const handleNextCard = () => {
    setIsFlipped(false);
    if (selectedGroupIndex !== null) {
      const currentGroup = flashcardGroups[selectedGroupIndex];
      if (learningMode === "sequence") {
        if (currentCardIndex < currentGroup.flashcards?.length - 1) {
          setCurrentCardIndex(currentCardIndex + 1);
        } else {
          message.success("已完成所有字卡！");
          setCurrentCardIndex(0);
        }
      } else if (learningMode === "random") {
        const randomIndex = Math.floor(
          Math.random() * currentGroup.flashcards!.length
        );
        setCurrentCardIndex(randomIndex);
      }
    }
  };

  // 刪除字卡
  const handleDeleteCard = async (cardId: number) => {
    if (selectedGroupIndex !== null) {
      const updatedGroups = [...flashcardGroups];
      const currentGroup = updatedGroups[selectedGroupIndex];

      // 找到当前要删除的字卡
      const cardToDelete = currentGroup.flashcards?.find(
        (card) => card.flashcardId === cardId
      );

      if (!cardToDelete) {
        message.error("字卡未找到，無法刪除");
        return;
      }

      Modal.confirm({
        title: "刪除字卡",
        content: `確認要刪除字卡 "${cardToDelete.word}" 嗎？`,
        onOk: async () => {
          try {
            // 获取 JWT token
            const jwtToken = localStorage.getItem("jwtToken");
            if (!jwtToken) {
              message.error("請先登入！");
              return;
            }

            // 调用 API 删除字卡
            const response = await axios.delete(
              `http://localhost:8080/api/flashcard/delete?flashcardId=${cardToDelete.flashcardId}`,
              {
                headers: {
                  Authorization: `Bearer ${jwtToken}`,
                },
              }
            );

            if (response.status === 200) {
              // 删除字卡后，更新本地状态
              currentGroup.flashcards = currentGroup.flashcards?.filter(
                (card) => card.flashcardId !== cardToDelete.flashcardId
              );

              setFlashcardGroups(updatedGroups);
              message.success("字卡刪除成功！");

              // 处理删除后当前卡片的边界情况
              if (currentGroup.flashcards.length === 0) {
                setCurrentCardIndex(0);
                message.warning("字卡組為空，請添加字卡。");
              }
            } else {
              throw new Error("刪除字卡失敗");
            }
          } catch (error: any) {
            console.error(
              "刪除字卡時發生錯誤:",
              error.response ? error.response.data : error.message
            );
            message.error(
              `刪除字卡時發生錯誤：${
                error.response ? error.response.data : error.message
              }`
            );
          }
        },
      });
    }
  };

  // 開始測驗模式
  const startQuizMode = () => {
    setQuizMode(true);
    setScore(0); // 每次開始測驗時重置分數
    setUserAnswer("");
  };

  // 結束測驗
  const endQuizMode = () => {
    setQuizMode(false);
    setScore(0); // 根據需求，可以選擇是否保留得分
  };

  // 提交測驗答案
  const submitQuiz = () => {
    if (
      userAnswer.trim().toLowerCase() ===
      flashcardGroups[selectedGroupIndex!].flashcards[
        currentCardIndex
      ].definition
        .trim()
        .toLowerCase()
    ) {
      setScore(score + 1);
      message.success("回答正確！");
    } else {
      message.error("回答錯誤！");
    }
    setUserAnswer("");
    handleNextCard();
  };

  const showGroupModal = () => {
    setIsGroupModalVisible(true);
  };

  const showCardModal = (groupIndex: number) => {
    setSelectedGroupIndex(groupIndex);
    setIsCardModalVisible(true);
  };

  const currentCard =
    selectedGroupIndex !== null &&
    flashcardGroups[selectedGroupIndex]?.flashcards?.length > 0
      ? flashcardGroups[selectedGroupIndex].flashcards[currentCardIndex]
      : null;

  const currentFavorites =
    selectedGroupIndex !== null
      ? flashcardGroups[selectedGroupIndex].favoriteFlashcards
      : [];

  // Get the current flashcards list
  // Get the current flashcards list based on whether we are viewing favorites or not
  const renderCardList = isViewingFavorites
    ? (flashcardGroups[selectedGroupIndex]?.flashcards || []).filter(
        (card) => card.isFavorite // 只顯示收藏的字卡
      )
    : flashcardGroups[selectedGroupIndex]?.flashcards || [];

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: "#fff0e6",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CustomHeader
        bgColor="#f2c2b3"
        menuColor={{ frontColor: "#923c3c", hoverColor: "#6f6262" }}
      />
      {/* 設定背景顏色 */}
      <Layout style={{ display: "flex", flex: 1 }}>
        {/* 左側字卡組別和創建區域 */}
        <Sider
          width={250}
          style={{
            backgroundColor: "#fef0f2",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflowY: "auto", // 使 Sider 可滾動
              maxHeight: "80vh", // 確保 Sider 不會超過屏幕高度
            }}
          >
            <style>
              {`
          /* 自定義滾動條 */
          ::-webkit-scrollbar {
            width: 10px; /* 滾動條寬度 */
          }

          ::-webkit-scrollbar-track {
            background: #f2c2b3; /* 滾動條軌道顏色 */
          }

          ::-webkit-scrollbar-thumb {
            background-color: #d47a84; /* 滾動條顏色 */
            border-radius: 10px; /* 圓角效果 */
          }

          ::-webkit-scrollbar-thumb:hover {
            background-color: #ef7f7f; /* 滾動條滑鼠懸停顏色 */
          }
        `}
            </style>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={showGroupModal}
              style={{
                backgroundColor: "#d47a84",
                borderColor: "#d47a84",
                color: "#fff",
                marginBottom: "20px",
              }}
            >
              創建字卡組別
            </Button>

            <List
              style={{ marginTop: "20px", flex: 1, overflowY: "auto" }}
              bordered
              dataSource={flashcardGroups}
              renderItem={(group, index) => (
                <List.Item
                  key={group.groupId}
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div
                    onClick={() => setSelectedGroupIndex(index)}
                    style={{
                      cursor: "pointer",
                      fontWeight: "bold",
                      display: "inline-block",
                    }}
                  >
                    {group.groupName}
                  </div>
                  <div>
                    <Button
                      type="text"
                      icon={<StarOutlined />}
                      onClick={() => setIsViewingFavorites(!isViewingFavorites)}
                      // style={{ marginRight: "5px" }}
                    ></Button>
                    <Button
                      type="text"
                      icon={<UploadOutlined />}
                      onClick={() => showCardModal(index)}
                      // style={{ marginRight: "10px" }}
                    />
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteGroup(index)}
                      style={{ color: "#ff6666" }}
                    />
                  </div>
                </List.Item>
              )}
            />
          </div>
        </Sider>

        {/* 右側字卡和學習區 */}
        <Layout style={{ padding: "20px", flex: 1 }}>
          <Content
            style={{
              background: "#fff",
              padding: "20px",
              margin: "0 16px",
              borderRadius: "8px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <Text style={{ color: "#923c3c" }}>
                請先選擇字卡組別來開始學習或查看收藏庫。
              </Text>
            </div>

            {selectedGroupIndex !== null && renderCardList.length > 0 && (
              <Card
                title={
                  isViewingFavorites
                    ? `收藏 ${currentCardIndex + 1} / ${renderCardList.length}`
                    : `字卡 ${currentCardIndex + 1} / ${renderCardList.length}`
                }
                style={{
                  width: 400,
                  margin: "0 auto",
                  textAlign: "center",
                  marginTop: 50,
                }}
              >
                <div style={{ marginBottom: "20px" }}>
                  <Button
                    type="primary"
                    onClick={handleFlipCard}
                    style={{
                      marginBottom: "20px",
                      backgroundColor: isFlipped ? "#ff9999" : "#ffbb99", // 只有字卡的按鈕背景色變
                      color: isFlipped ? "#fff" : "#000",
                    }}
                  >
                    {isFlipped
                      ? renderCardList[currentCardIndex].definition
                      : renderCardList[currentCardIndex].word}
                  </Button>
                </div>

                <Row gutter={16}>
                  <Col span={12}>
                    <Button
                      type="primary"
                      onClick={handleNextCard}
                      style={{
                        width: "100%",
                        backgroundColor: "#d47a84",
                        borderColor: "#d47a84",
                      }}
                    >
                      下一張字卡
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button
                      type="primary"
                      onClick={quizMode ? endQuizMode : startQuizMode}
                      style={{
                        width: "100%",
                        backgroundColor: "#ffbb99",
                        borderColor: "#ffbb99",
                      }}
                    >
                      {quizMode ? "結束測驗" : "開始測驗"}
                    </Button>
                  </Col>
                </Row>

                {/* 收藏字卡的按鈕 */}
                <div style={{ marginTop: "20px" }}>
                  <Button
                    type={
                      renderCardList[currentCardIndex] &&
                      renderCardList[currentCardIndex].isFavorite
                        ? "default" // 已收藏
                        : "primary" // 未收藏
                    }
                    onClick={() => {
                      const currentCardId =
                        renderCardList[currentCardIndex]?.flashcardId; // 获取当前字卡的 ID
                      console.log("当前字卡 ID:", currentCardId); // 打印查看当前字卡 ID
                      if (currentCardId) {
                        toggleFavorite(currentCardId); // 传递给 toggleFavorite 函数
                      }
                    }}
                    style={{
                      width: "100%",
                      backgroundColor: "#ffeb3b", // 设置按钮颜色
                      borderColor: "#ffeb3b",
                    }}
                  >
                    {renderCardList[currentCardIndex] &&
                    renderCardList[currentCardIndex].isFavorite
                      ? "取消收藏"
                      : "加入收藏"}
                  </Button>
                </div>

                <div style={{ marginTop: "20px" }}>
                  <Button
                    type="danger"
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      const currentCardId =
                        renderCardList[currentCardIndex]?.flashcardId; // 获取当前字卡的 ID
                      console.log("当前字卡 ID:", currentCardId); // 打印查看当前字卡 ID
                      if (currentCardId) {
                        handleDeleteCard(currentCardId); // 传递给 handleDeleteCard 函数
                      }
                    }}
                    style={{
                      width: "100%",
                      backgroundColor: "#ff6666",
                      borderColor: "#ff6666",
                    }}
                  >
                    刪除字卡
                  </Button>
                </div>

                {quizMode && (
                  <div style={{ marginTop: "20px" }}>
                    <Input
                      placeholder="請輸入答案"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                    />
                    <Button
                      type="primary"
                      onClick={submitQuiz}
                      style={{
                        marginTop: "10px",
                        backgroundColor: "#6f4f37", // Dark brown color
                        borderColor: "#6f4f37", // Dark brown color for border
                        color: "#fff", // White text for contrast
                      }}
                    >
                      提交
                    </Button>
                  </div>
                )}

                {quizMode && <Text>得分: {score}</Text>}

                {/* 學習模式切換按鈕 */}
                <Button
                  type="default"
                  onClick={handleModeChange}
                  style={{
                    marginTop: "20px",
                    backgroundColor: "#f1c6b7", // Light background for the mode toggle
                    borderColor: "#f1c6b7",
                    width: "100%",
                  }}
                >
                  切換至 {learningMode === "sequence" ? "隨機" : "順序"} 模式
                </Button>
              </Card>
            )}
          </Content>
        </Layout>
      </Layout>
      {/* 創建字卡組別的模態框 */}
      <Modal
        title="創建字卡組別"
        visible={isGroupModalVisible}
        onOk={handleCreateGroup}
        onCancel={() => setIsGroupModalVisible(false)}
      >
        <Input
          placeholder="請輸入組別名稱"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
        />
      </Modal>
      {/* 創建字卡的模態框 */}
      <Modal
        title="創建字卡"
        visible={isCardModalVisible}
        onOk={handleAddCard}
        onCancel={() => setIsCardModalVisible(false)}
      >
        <Input
          placeholder="請輸入單字"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
        />
        <Input
          placeholder="請輸入字卡定義"
          value={newDefinition}
          onChange={(e) => setNewDefinition(e.target.value)}
          style={{ marginTop: "10px" }}
        />
      </Modal>
    </Layout>
  );
};

export default FlashCardPage;
