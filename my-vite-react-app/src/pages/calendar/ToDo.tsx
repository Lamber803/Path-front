import React, { useState, useEffect } from "react";
import { Button, Input, List, Popconfirm, message } from "antd";
import {
  EditOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import axios from "axios"; // 引入 axios

interface Todo {
  todoId: number;
  todoText: string;
  isCompleted: boolean;
  userId: number;
}

interface TodoAppProps {
  userId: number;
}

const TodoApp: React.FC<TodoAppProps> = ({ userId }) => {
  const [todoText, setTodoText] = useState(""); // 當前輸入的任務文本
  const [todos, setTodos] = useState<Todo[]>([]); // 待辦任務列表
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]); // 已完成任務列表
  const [isTodoCollapsed, setIsTodoCollapsed] = useState(false); // 控制待辦列表是否折疊
  const [isCompletedCollapsed, setIsCompletedCollapsed] = useState(false); // 控制已完成任務列表是否折疊

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/todos/user?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        const todosData: Todo[] = response.data;
        setTodos(todosData.filter((todo) => !todo.isCompleted)); // 設置待辦事項
        setCompletedTodos(todosData.filter((todo) => todo.isCompleted)); // 設置已完成事項
      } catch (error) {
        console.error("獲取待辦事項出錯:", error);
        message.error("獲取待辦事項時出錯");
      }
    };

    fetchTodos();
  }, [userId]); // 在 userId 改變時重新獲取資料

  // 新增任務
  const handleAddTodo = async () => {
    if (!todoText.trim()) return; // 如果輸入為空，不新增任務

    const newTodo = {
      todoText,
      isCompleted: false,
      userId,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/todos",
        newTodo,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      if (response.status === 200) {
        const createdTodo: Todo = response.data; // 假設 API 返回創建的任務對象
        setTodos([...todos, createdTodo]); // 更新待辦任務列表
        setTodoText(""); // 清空輸入框
      } else {
        message.error("任務新增失敗");
      }
    } catch (error) {
      console.error("新增任務出錯:", error);
      message.error("新增任務時出錯");
    }
  };

  // 標記任務為已完成
  const toggleCompletion = async (id: number) => {
    try {
      // 創建 TodoDTO 物件，包含 todoId 和 isCompleted 狀態
      const todoDTO = {
        todoId: id,
        isCompleted: true,
      };

      // 發送 PUT 請求標記任務為已完成
      const response = await axios.put(
        "http://localhost:8080/api/todos/complete", // 假設這是後端的路徑
        todoDTO,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      if (response.status === 200) {
        const completedTodo = response.data;
        // 更新待辦任務列表，將已完成任務移到已完成列表
        setTodos(todos.filter((todo) => todo.todoId !== completedTodo.todoId));
        setCompletedTodos([...completedTodos, completedTodo]);
      } else {
        message.error("標記為完成失敗");
      }
    } catch (error) {
      console.error("標記為完成出錯:", error);
      message.error("標記為完成出錯");
    }
  };

  // 標記任務為未完成
  const toggleUncompletion = async (id: number) => {
    try {
      // 創建 TodoDTO 物件，包含 todoId 和 isCompleted 狀態
      const todoDTO = {
        todoId: id,
        isCompleted: false,
      };

      // 發送 PUT 請求標記任務為未完成
      const response = await axios.put(
        "http://localhost:8080/api/todos/complete", // 假設這是後端的路徑
        todoDTO,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      if (response.status === 200) {
        const uncompletedTodo = response.data;
        // 更新已完成任務列表，將未完成任務移回待辦列表
        setCompletedTodos(
          completedTodos.filter(
            (todo) => todo.todoId !== uncompletedTodo.todoId
          )
        );
        setTodos([...todos, uncompletedTodo]);
      } else {
        message.error("標記為未完成失敗");
      }
    } catch (error) {
      console.error("標記為未完成出錯:", error);
      message.error("標記為未完成出錯");
    }
  };

  // 刪除任務
  const handleDelete = async (id: number, isCompleted: boolean) => {
    try {
      // 發送 DELETE 請求刪除任務
      const response = await axios.delete(
        "http://localhost:8080/api/todos", // 假設這是後端的路徑
        {
          data: id, // 使用 data 發送請求體
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      // 刪除成功後，更新待辦事項列表
      if (response.status === 204) {
        if (isCompleted) {
          // 如果是已完成任務，從已完成任務列表中刪除
          setCompletedTodos(
            completedTodos.filter((todo) => todo.todoId !== id)
          );
        } else {
          // 如果是待辦任務，從待辦任務列表中刪除
          setTodos(todos.filter((todo) => todo.todoId !== id));
        }
      } else {
        message.error("刪除任務失敗");
      }
    } catch (error) {
      console.error("刪除任務時出錯:", error);
      message.error("刪除任務時出錯");
    }
  };

  // 編輯任務
  // 編輯任務
  const handleEdit = async (
    id: number,
    newText: string,
    isCompleted: boolean
  ) => {
    if (!newText.trim()) return;

    // 創建 TodoDTO 的對象
    const todoDTO = {
      todoId: id,
      todoText: newText,
    };

    try {
      // 發送 PUT 請求到後端
      const response = await axios.put(
        "http://localhost:8080/api/todos", // 假設這是後端的 API 路徑
        todoDTO,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      // 成功更新後，更新前端的待辦事項列表
      if (response.status === 200) {
        const updatedTodo = response.data;
        if (isCompleted) {
          // 如果是已完成任務，更新已完成任務列表
          setCompletedTodos(
            completedTodos.map((todo) =>
              todo.todoId === updatedTodo.todoId ? updatedTodo : todo
            )
          );
        } else {
          // 如果是待辦任務，更新待辦任務列表
          setTodos(
            todos.map((todo) =>
              todo.todoId === updatedTodo.todoId ? updatedTodo : todo
            )
          );
        }
      } else {
        message.error("更新任務失敗");
      }
    } catch (error) {
      console.error("更新任務時出錯:", error);
      message.error("更新任務時出錯");
    }
  };

  return (
    <div className="todo-app">
      <div className="input-section">
        <Input
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
          placeholder="輸入新任務..."
          style={{ marginBottom: "10px" }}
        />
        <Button
          type="primary"
          onClick={handleAddTodo}
          block
          style={{
            marginBottom: "10px",
            backgroundColor: "rgb(221 148 98)",
            borderColor: "rgb(221 148 98)",
          }}
        >
          新增任務
        </Button>
      </div>

      {/* 待辦任務區 */}
      <div className="todo-section" style={{ marginBottom: 10 }}>
        <h3
          onClick={() => setIsTodoCollapsed(!isTodoCollapsed)}
          className="collapsible"
        >
          待辦任務 {isTodoCollapsed ? "▲" : "▼"}
        </h3>
        {!isTodoCollapsed && (
          <div style={{ maxHeight: "250px", overflowY: "auto" }}>
            <List
              bordered
              dataSource={todos}
              renderItem={(item) => (
                <List.Item
                  style={{
                    display: "flex", // 使用 Flexbox 布局
                    justifyContent: "space-between", // 分開文字區域和按鈕區域
                    padding: "0px", // 去除多餘的內邊距
                  }}
                >
                  {/* 文字區域 */}
                  <div
                    style={{
                      fontSize: "14px",
                      flex: 1, // 文字區域占據剩餘空間
                      padding: "10px", // 內邊距
                      paddingLeft: "20px",
                      whiteSpace: "nowrap", // 不換行
                      overflow: "hidden", // 超出內容隱藏
                      textOverflow: "ellipsis", // 超出部分顯示省略號
                    }}
                  >
                    {item.todoText}
                  </div>

                  {/* 按鈕區域 */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Button
                      type="link"
                      size="small"
                      style={{ paddingLeft: "0px", paddingRight: "20px" }}
                      icon={<CheckCircleOutlined />}
                      onClick={() => toggleCompletion(item.todoId)}
                    />
                    <Button
                      type="link"
                      size="small"
                      style={{ paddingLeft: "0px", paddingRight: "20px" }}
                      icon={<EditOutlined />}
                      onClick={() =>
                        handleEdit(
                          item.todoId,
                          prompt("編輯任務:", item.todoText) || item.todoText,
                          false
                        )
                      }
                    />
                    <Popconfirm
                      title="確認刪除任務?"
                      onConfirm={() => handleDelete(item.todoId, false)}
                      okText="是"
                      cancelText="否"
                    >
                      <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        danger
                        size="small"
                        style={{ paddingLeft: "0px", paddingRight: "20px" }}
                      />
                    </Popconfirm>
                  </div>
                </List.Item>
              )}
            />
          </div>
        )}
      </div>

      {/* 已完成任務區 */}
      <div className="completed-section">
        <h3
          onClick={() => setIsCompletedCollapsed(!isCompletedCollapsed)}
          className="collapsible"
        >
          已完成任務 {isCompletedCollapsed ? "▲" : "▼"}
        </h3>
        {!isCompletedCollapsed && (
          <div style={{ maxHeight: "250px", overflowY: "auto" }}>
            <List
              bordered
              dataSource={completedTodos}
              renderItem={(item) => (
                <List.Item
                  style={{
                    display: "flex", // 使用 Flexbox 布局
                    justifyContent: "space-between", // 分開文字區域和按鈕區域
                    padding: "0px", // 去除多餘的內邊距
                  }}
                >
                  {/* 文字區域 */}
                  <div
                    style={{
                      fontSize: "14px",
                      flex: 1, // 文字區域占據剩餘空間
                      padding: "10px", // 內邊距
                      paddingLeft: "20px",
                      whiteSpace: "nowrap", // 不換行
                      overflow: "hidden", // 超出內容隱藏
                      textOverflow: "ellipsis", // 超出部分顯示省略號
                      textDecoration: "line-through", // 已完成任務顯示刪除線
                    }}
                  >
                    {item.todoText}
                  </div>

                  {/* 按鈕區域 */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Button
                      type="link"
                      size="small"
                      style={{ paddingLeft: "0px", paddingRight: "20px" }}
                      icon={<CloseCircleOutlined />}
                      onClick={() => toggleUncompletion(item.todoId)}
                    ></Button>
                    <Popconfirm
                      title="確認刪除任務?"
                      onConfirm={() => handleDelete(item.todoId, true)}
                      okText="是"
                      cancelText="否"
                    >
                      <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        danger
                        size="small"
                        style={{ paddingLeft: "0px", paddingRight: "20px" }}
                      />
                    </Popconfirm>
                  </div>
                </List.Item>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoApp;
