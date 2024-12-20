import React, { useState } from "react";
import { Button, Input, List, Checkbox, Popconfirm, message } from "antd";
import {
  EditOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const TodoApp = () => {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [isTodoCollapsed, setIsTodoCollapsed] = useState(false);
  const [isCompletedCollapsed, setIsCompletedCollapsed] = useState(false);

  // Handle add todo
  const handleAddTodo = () => {
    if (todo.trim()) {
      const newTodo = {
        id: Date.now(),
        text: todo,
        isCompleted: false,
      };
      setTodos([...todos, newTodo]);
      setTodo("");
    }
  };

  // Handle mark as completed
  const toggleCompletion = (id) => {
    const completedTodo = todos.find((todo) => todo.id === id);
    setTodos(todos.filter((todo) => todo.id !== id));
    setCompletedTodos([
      ...completedTodos,
      { ...completedTodo, isCompleted: true },
    ]);
  };

  // Handle mark as uncompleted
  const toggleUncompletion = (id) => {
    const todo = completedTodos.find((todo) => todo.id === id);
    setCompletedTodos(completedTodos.filter((todo) => todo.id !== id));
    setTodos([...todos, { ...todo, isCompleted: false }]);
  };

  // Handle delete todo
  const handleDelete = (id, isCompleted) => {
    if (isCompleted) {
      setCompletedTodos(completedTodos.filter((todo) => todo.id !== id));
    } else {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  // Handle edit todo
  const handleEdit = (id, newText, isCompleted) => {
    if (newText.trim()) {
      if (isCompleted) {
        setCompletedTodos(
          completedTodos.map((todo) =>
            todo.id === id ? { ...todo, text: newText } : todo
          )
        );
      } else {
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, text: newText } : todo
          )
        );
      }
    }
  };

  return (
    <div className="todo-app">
      <div className="input-section">
        <Input
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          placeholder="Add a new task..."
          style={{ marginBottom: "10px" }}
        />
        <Button
          type="primary"
          onClick={handleAddTodo}
          block
          style={{
            marginBottom: "10px",
            backgroundColor: "rgb(221 148 98)", // 可以根据需要设置按钮背景色
            borderColor: "rgb(221 148 98)", // 按钮边框颜色
          }}
        >
          新增任務
        </Button>
      </div>

      {/* Todo Section */}
      <div className="todo-section">
        <h3
          onClick={() => setIsTodoCollapsed(!isTodoCollapsed)}
          className="collapsible"
        >
          Todo {isTodoCollapsed ? "▲" : "▼"}
        </h3>
        {!isTodoCollapsed && (
          <div style={{ maxHeight: "250px", overflowY: "auto" }}>
            <List
              bordered
              dataSource={todos}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      type="link"
                      icon={<CheckCircleOutlined />}
                      onClick={() => toggleCompletion(item.id)}
                    >
                      {/* Done */}
                    </Button>,
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() =>
                        handleEdit(
                          item.id,
                          prompt("Edit task:", item.text),
                          false
                        )
                      }
                    >
                      {/* Edit */}
                    </Button>,
                    <Popconfirm
                      title="Are you sure to delete this task?"
                      onConfirm={() => handleDelete(item.id, false)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="link" icon={<DeleteOutlined />} danger>
                        {/* Delete */}
                      </Button>
                    </Popconfirm>,
                  ]}
                >
                  {item.text}
                </List.Item>
              )}
            />
          </div>
        )}
      </div>

      {/* Completed Section */}
      <div className="completed-section">
        <h3
          onClick={() => setIsCompletedCollapsed(!isCompletedCollapsed)}
          className="collapsible"
        >
          Completed {isCompletedCollapsed ? "▲" : "▼"}
        </h3>
        {!isCompletedCollapsed && (
          <div style={{ maxHeight: "250px", overflowY: "auto" }}>
            <List
              bordered
              dataSource={completedTodos}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      type="link"
                      icon={<CloseCircleOutlined />}
                      onClick={() => toggleUncompletion(item.id)}
                    >
                      {/* Undo */}
                    </Button>,
                    <Popconfirm
                      title="Are you sure to delete this task?"
                      onConfirm={() => handleDelete(item.id, true)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="link" icon={<DeleteOutlined />} danger>
                        {/* Delete */}
                      </Button>
                    </Popconfirm>,
                  ]}
                >
                  <span style={{ textDecoration: "line-through" }}>
                    {item.text}
                  </span>
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
