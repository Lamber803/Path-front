import React, { useState, useEffect } from "react";
import { Modal, Button, Input, List, message } from "antd";
import axios from "axios";
import {
  StopOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import tomatoImage1 from "./image/tomato.png";
import tomatoImage2 from "./image/tomato2.png";
import tomatoImage3 from "./image/tomato3.png";
import tomatoImage4 from "./image/tomato4.png";
import tomatoImage5 from "./image/tomato5.png";
import tomatoImage6 from "./image/tomato6.png";

const PomodoroTimer: React.FC = () => {
  const [pomodoroVisible, setPomodoroVisible] = useState(false); // 控制 Pomodoro 計時器視窗顯示
  const [isCreatingTask, setIsCreatingTask] = useState(false); // 是否在創建新任務的狀態
  const [currentTask, setCurrentTask] = useState<string>(""); // 當前選中的任務名稱
  const [tasks, setTasks] = useState<
    {
      id: string;
      task: string;
      totalTime: number;
      workDuration: number;
      breakDuration: number;
      hover: boolean;
      isTimeAdded: boolean;
    }[]
  >([]); // 存儲任務列表和累計時長

  const [isRunning, setIsRunning] = useState(false); // 是否運行中
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 預設工作時間 25 分鐘
  const [workDuration, setWorkDuration] = useState(25 * 60); // 工作時間
  const [breakDuration, setBreakDuration] = useState(5 * 60); // 休息時間
  const [timeElapsed, setTimeElapsed] = useState(0); // 經過的時間
  const [isWorkPhase, setIsWorkPhase] = useState(true); // 是否在工作階段
  const [planName, setPlanName] = useState(""); // 用戶自定義計劃名稱
  const [isEditable, setIsEditable] = useState(true); // 是否可以編輯計劃名稱

  // 計時邏輯
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            if (isWorkPhase) {
              message.success("工作時間結束！休息一下。");
              setIsWorkPhase(false);
              return breakDuration; // 進入休息時間
            } else {
              message.success("休息時間結束！繼續學習。");
              setIsWorkPhase(true);

              return workDuration; // 返回工作時間
            }
          } else {
            return prevTime - 1; // 減少一秒
          }
        });
        // 每秒鐘增加經過的時間
        if (isWorkPhase) {
          setTimeElapsed((prevTime) => prevTime + 1); // 每秒增加經過的時間
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval); // 清理計時器
  }, [isRunning, isWorkPhase, workDuration, breakDuration]);

  // 當用戶點擊「新增學習任務」按鈕時，顯示番茄鐘設定彈窗
  const handleCreateTask = () => {
    setIsCreatingTask(true); // 開啟創建任務的彈窗
    setPomodoroVisible(true); // 顯示 Pomodoro 計時器視窗
  };
  // 保存任務後自動添加到任務列表
  const handleSaveTask = () => {
    if (!planName) {
      message.warning("請輸入任務名稱！");
      return;
    }
    const newTask = {
      id: `${Date.now()}`, // 用時間戳作為任務 ID
      task: planName,
      totalTime: 0,
      workDuration: workDuration, // 儲存用戶自定義的工作時間
      breakDuration: breakDuration, // 儲存用戶自定義的休息時間
      hover: false,
    };
    setTasks([...tasks, newTask]); // 將新任務添加到任務列表
    setPomodoroVisible(false); // 關閉彈窗
    setIsCreatingTask(false); // 關閉創建任務的狀態
    setPlanName(""); // 清空任務名稱
    setWorkDuration(25 * 60); // 重置工作時間
    setBreakDuration(5 * 60); // 重置休息時間
  };
  // 用戶編輯計劃名稱
  const handleEditPlanName = () => {
    setIsEditable(!isEditable);
    if (isEditable) {
      const updatedTasks = tasks.map((task) => {
        if (task.task === currentTask) {
          return { ...task, task: planName }; // 即時更新計劃名稱
        }
        return task;
      });
      setTasks(updatedTasks);
    }
  };

  // 用戶輸入計劃名稱
  const handlePlanNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlanName(e.target.value);
  };

  // 開始/暫停計時器
  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  // 重置計時器
  const handleReset = () => {
    setTimeLeft(workDuration); // 重置為設定的工作時間
    setTimeElapsed(0); // 重置經過的時間
    setIsRunning(false); // 停止計時
    setIsWorkPhase(true); // 重置為工作階段
  };

  // 完成任務，將時間記錄下來
  const handleComplete = () => {
    // 以分鐘為單位，四捨五入
    const roundedTime = Math.round(timeElapsed / 60); // 四捨五入到最接近的分鐘數

    if (roundedTime < 1) {
      message.warning("學習時間未滿 5 分鐘，未保存。");
      return; // 不保存這段時間
    }

    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) => {
        if (task.task === currentTask && !task.isTimeAdded) {
          return {
            ...task,
            totalTime: task.totalTime + roundedTime, // 累加總時長
            isTimeAdded: false, // 記錄這個時間已經累加過
          };
        }
        return task;
      });
      return updatedTasks;
    });

    message.success(`${currentTask} 完成，總時長：${roundedTime} 分鐘`);
    setTimeElapsed(0);

    setPomodoroVisible(false); // 關閉 Pomodoro 計時器視窗
  };

  // 刪除任務
  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    message.success("任務已刪除");
  };

  // 用戶設置工作時間和休息時間
  const handleWorkDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isRunning) {
      // 只有在計時器未運行時才能更改工作時間
      const newWorkDuration = parseInt(e.target.value) * 60;
      setWorkDuration(newWorkDuration);
      setTimeLeft(newWorkDuration); // 立即更新倒計時
    } else {
      message.warning("計時中，無法更改工作時間！");
    }
  };

  const handleBreakDurationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newBreakDuration = parseInt(e.target.value) * 60;
    setBreakDuration(newBreakDuration);
  };

  // 格式化顯示為分鐘:秒
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // 更新單個任務的 hover 狀態
  const handleTaskHover = (taskId: string, isHovered: boolean) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, hover: isHovered } : task
      )
    );
  };

  // 根據剩餘時間選擇圖片
  const getTomatoImage = () => {
    const timeFraction = timeLeft / workDuration;
    if (timeFraction > 5 / 6) return tomatoImage1;
    if (timeFraction > 4 / 6) return tomatoImage2;
    if (timeFraction > 3 / 6) return tomatoImage3;
    if (timeFraction > 2 / 6) return tomatoImage4;
    if (timeFraction > 1 / 6) return tomatoImage5;
    return tomatoImage6;
  };

  return (
    <>
      {/* 顯示 Pomodoro 計時器視窗 */}
      <Modal
        title={isCreatingTask ? "創建學習任務" : "Pomodoro 計劃"}
        visible={pomodoroVisible}
        onCancel={() => {
          setPomodoroVisible(false);
          setIsCreatingTask(false); // 關閉創建任務的狀態
        }}
        footer={null}
        width={400}
      >
        <div style={{ textAlign: "center", fontSize: "18px" }}>
          {isEditable ? (
            <Input
              value={planName}
              onChange={handlePlanNameChange}
              placeholder="輸入計劃名稱"
              style={{ marginBottom: "20px" }}
            />
          ) : (
            <h3>{planName || "請編輯計劃名"}</h3>
          )}
          <Button onClick={handleEditPlanName} style={{ marginTop: "10px" }}>
            {isEditable ? "保存計劃名" : "編輯計劃名"}
          </Button>
        </div>

        <div style={{ marginTop: "30px" }}>
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <label>工作時間 (分鐘)：</label>
            <Input
              type="number"
              min={1}
              value={workDuration / 60}
              onChange={handleWorkDurationChange}
              style={{
                width: "100px",
                marginLeft: "10px",
                display: "inline-block",
              }}
            />
          </div>
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <label>休息時間 (分鐘)：</label>
            <Input
              type="number"
              min={1}
              value={breakDuration / 60}
              onChange={handleBreakDurationChange}
              style={{
                width: "100px",
                marginLeft: "10px",
                display: "inline-block",
              }}
            />
          </div>
        </div>

        {/* 動態蕃茄圖示 */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <div
            style={{
              marginBottom: "20px",
              position: "relative",
              height: "100px",
              width: "100px",
              margin: "0 auto",
            }}
          >
            <img
              src={getTomatoImage()}
              alt="Pomodoro"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                transition: "transform 1s ease-in-out",
                // transform: `scale(${Math.max(0.5, timeLeft / workDuration)})`,
              }}
            />
          </div>

          {/* 計時顯示 */}
          <h2>{formatTime(timeLeft)}</h2>
          <p>{isWorkPhase ? "工作時間" : "休息時間"}</p>
        </div>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Button
            type="primary"
            icon={isRunning ? <StopOutlined /> : <PlayCircleOutlined />}
            size="large"
            onClick={handleStartPause}
            style={{
              marginRight: "10px",
              backgroundColor: "#ad4545",
              borderColor: "#ad4545",
            }}
            disabled={isCreatingTask} // 創建任務時禁用開始按鈕
          >
            {isRunning ? "暫停" : "開始"}
          </Button>
          <Button
            icon={<ReloadOutlined />}
            size="large"
            onClick={handleReset}
            style={{ marginLeft: "10px" }}
          >
            重置
          </Button>
        </div>

        <div style={{ marginTop: "20px" }}>
          <Button
            type="dashed"
            onClick={() => {
              if (isCreatingTask) {
                handleSaveTask(); // 創建任務時，保存任務
              } else {
                handleComplete(); // 完成計時時，保存任務
              }
            }}
            size="large"
            block
            disabled={!planName}
          >
            完成
          </Button>
        </div>
      </Modal>

      {/* 新增學習任務按鈕 */}
      <Button
        type="primary"
        onClick={handleCreateTask}
        style={{
          marginTop: "20px",
          backgroundColor: "#ad4545",
          borderColor: "#ad4545",
          marginLeft: 20,
        }}
      >
        新增學習任務
      </Button>

      {/* 顯示任務列表，並加上滾動條 */}
      <div
        style={{
          marginTop: "20px",
          maxHeight: "500px", // 設定最大高度
          maxWidth: "98%",
          overflowY: "auto", // 顯示垂直滾動條
        }}
      >
        <style>
          {`
          /* 自定義滾動條 */
          ::-webkit-scrollbar {
            width: 8px; /* 滾動條寬度 */
          }

          ::-webkit-scrollbar-track {
            background: #f0f0f0; /* 滾動條軌道顏色 */
          }

          ::-webkit-scrollbar-thumb {
            background-color: #ad4545; /* 滾動條顏色 */
            border-radius: 10px; /* 圓角效果 */
          }

          ::-webkit-scrollbar-thumb:hover {
            background-color: #ef7f7f; /* 滾動條滑鼠懸停顏色 */
          }
        `}
        </style>
        <List
          style={{ marginLeft: 45 }}
          dataSource={tasks}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  type="primary"
                  onClick={() => {
                    setCurrentTask(item.task);
                    setPlanName(item.task);
                    setPomodoroVisible(true); // 顯示 Pomodoro 計時器
                  }}
                  style={{
                    backgroundColor: item.hover ? "#ef7f7f" : "#ad4545", // 根據 hover 狀態改變背景顏色
                    borderColor: item.hover ? "#ef7f7f" : "#ad4545", // 根據 hover 狀態改變邊框顏色
                  }}
                  onMouseEnter={() => handleTaskHover(item.id, true)} // 當鼠標進入時設置 hover 為 true
                  onMouseLeave={() => handleTaskHover(item.id, false)} // 當鼠標離開時設置 hover 為 false
                >
                  開始 Pomodoro
                </Button>,
                <Button
                  type="default"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteTask(item.id)} // 刪除任務的函數
                  style={{ marginLeft: 8 }}
                >
                  刪除
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={item.task}
                description={`累計時長：${item.totalTime} 分鐘`}
              />
            </List.Item>
          )}
        />
      </div>
    </>
  );
};

export default PomodoroTimer;
