import React, { useState, useEffect } from "react";
import { Modal, Button, Input, List, message } from "antd";
import axios from "axios";
import {
  StopOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import tomatoImage1 from "./image/tomato.png";
import tomatoImage2 from "./image/tomato2.png";
import tomatoImage3 from "./image/tomato3.png";
import tomatoImage4 from "./image/tomato4.png";
import tomatoImage5 from "./image/tomato5.png";
import tomatoImage6 from "./image/tomato6.png";
import { updatePomodoroSettings } from "./PomodoroApi";

interface PomodoroPageProps {
  userId: number; // 父组件传入的 userId
}
interface PomodoroDTO {
  pomodoroId: number;
  pomodoroName: string;
  workDuration: number;
  breakDuration: number;
  totalTime: number;
  userId: number; // 或者根据实际数据结构调整
}
const HoverButton = styled(Button)`
  background-color: #ad4545;
  border-color: #ad4545;

  &:hover {
    background-color: rgb(190, 99, 99) !important;
    border-color: rgb(190, 99, 99) !important;
  }
`;
const PomodoroTimer: React.FC<PomodoroPageProps> = ({ userId }) => {
  const [pomodoroVisible, setPomodoroVisible] = useState(false); // 控制 Pomodoro 計時器視窗顯示
  const [isCreatingTask, setIsCreatingTask] = useState(false); // 是否在創建新任務的狀態
  const [currentTask, setCurrentTask] = useState<string>(""); // 當前選中的任務名稱
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null); // 当前任务ID
  const [tasks, setTasks] = useState<PomodoroDTO[]>([]); // 初始化为空数组 // 存儲任務列表和累計時長

  const [isRunning, setIsRunning] = useState(false); // 是否運行中
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 預設工作時間 25 分鐘
  const [workDuration, setWorkDuration] = useState(25 * 60); // 工作時間
  const [breakDuration, setBreakDuration] = useState(5 * 60); // 休息時間
  const [timeElapsed, setTimeElapsed] = useState(0); // 經過的時間
  const [isWorkPhase, setIsWorkPhase] = useState(true); // 是否在工作階段
  const [planName, setPlanName] = useState(""); // 用戶自定義計劃名稱
  const [isEditable, setIsEditable] = useState(true); // 是否可以編輯計劃名稱
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 計時邏輯
  useEffect(() => {
    if (userId) {
      setLoading(true);
      setError(null);

      // 發送 API 請求查詢文檔
      axios
        .get(`http://localhost:8080/api/pomodoro/tasks?userId=${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        })
        .then((response) => {
          const data = response.data;
          console.log(data); // 查看返回的數據結構

          // 檢查返回的數據是否為陣列
          if (Array.isArray(data)) {
            setTasks(data); // 設置為 pomodoros
            // 假设返回的数据中包含了全局的工作时间和休息时间配置
            // 只要任务列表非空，设置工作时间和休息时间
          } else {
            setError("返回的數據格式無效");
          }
        })
        .catch(() => {
          setError("無法加載文檔");
        })
        .finally(() => {
          setLoading(false);
        });
    }
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
  }, [userId, isRunning, isWorkPhase, workDuration, breakDuration]);

  // 當用戶點擊「新增學習任務」按鈕時，顯示番茄鐘設定彈窗
  const handleCreateTask = () => {
    setIsCreatingTask(true); // 開啟創建任務的彈窗
    setCurrentTaskId(null); // 或者设置为空字符串/初始状态
    setPomodoroVisible(true); // 顯示 Pomodoro 計時器視窗
  };
  // 保存任務後自動添加到任務列表
  const handleSaveTask = async () => {
    if (!planName) {
      message.warning("請輸入任務名稱！");
      return;
    }
    const newPomodoroDTO = {
      userId: userId,
      pomodoroName: planName, // 任務名稱
      workDuration: workDuration, // 工作時間
      breakDuration: breakDuration, // 休息時間
      totalTime: 0, // 初始時累積時間為 0
    };
    try {
      const response = await axios.post(
        `http://localhost:8080/api/pomodoro/tasks`,
        newPomodoroDTO,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      console.log(response.data); // 打印响应数据

      setTasks([...tasks, response.data]); // 將新任務添加到任務列表
      setPomodoroVisible(false); // 關閉彈窗
      setIsCreatingTask(false); // 關閉創建任務的狀態
      setPlanName(""); // 清空任務名稱
      setWorkDuration(25 * 60); // 重置工作時間
      setBreakDuration(5 * 60); // 重置休息時間
      return response.data; // 返回後端響應數據
    } catch (error) {
      console.error("提交失敗，請稍後再試！", error);
      message.error("提交失敗，請稍後再試！"); // 顯示錯誤訊息
      throw new Error("提交失敗，請稍後再試！");
    }
  };
  // 用戶編輯計劃名稱
  const handleEditPlanName = async () => {
    console.log("edit!");
    setIsEditable((prev) => !prev); // 正确更新状态
    if (currentTaskId !== null) {
      console.log("checker");
      const data = {
        pomodoroId: currentTaskId, // 包含 pomodoroId
        pomodoroName: planName, // 更新名稱
        userId: userId, // 用戶ID（需要傳遞給後端）
      };
      try {
        console.log("send api");
        const result = await updatePomodoroSettings(data, "name");
        console.log("名稱更新成功:", result);

        // 更新前端本地状态
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.pomodoroId === currentTaskId
              ? { ...task, pomodoroName: planName }
              : task
          )
        );
      } catch (error) {
        console.error("更新名稱失败:", error);
      }
    } else {
      console.log("currentTaskId === null");
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
  const handleComplete = async () => {
    // 以分鐘為單位，四捨五入
    const roundedTime = Math.round(timeElapsed / 60); // 四捨五入到最接近的分鐘數

    // if (roundedTime < 1) {
    //   message.warning("學習時間未滿 5 分鐘，未保存。");
    //   return; // 不保存這段時間
    // }

    if (currentTaskId !== null) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.pomodoroId === currentTaskId
            ? {
                ...task,
                totalTime: task.totalTime + roundedTime,
              }
            : task
        )
      );
      // 调用 API 更新任务的总时长到数据库
      const data = {
        pomodoroId: currentTaskId, // 包含 pomodoroId
        workDuration: workDuration,
        breakDuration: breakDuration,
        totalTime: roundedTime,
        userId: userId, // 用戶ID（需要傳遞給後端）
      };
      try {
        await updatePomodoroSettings(data, "timer");
        message.success(`${currentTask} 完成，總時長：${roundedTime} 分鐘`);
      } catch (error) {
        console.error("保存任务时间失败:", error);
        message.error("任务保存失败，请稍后再试");
      }
      await fetchTasks(); // 重新请求任务列表并更新前端
    }

    setTimeElapsed(0);
    setPomodoroVisible(false); // 關閉 Pomodoro 計時器視窗
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/pomodoro/tasks?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      setTasks(response.data); // 假设返回的数据格式符合你的需求
    } catch (error) {
      console.error("获取任务列表失败:", error);
      message.error("获取任务列表失败，请稍后再试");
    }
  };

  // 刪除任務
  const handleDeleteTask = async (taskId: number) => {
    try {
      // 发送 DELETE 请求到后端
      const response = await axios.delete(
        `http://localhost:8080/api/pomodoro/tasks/delete`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // 添加用户的JWT token
          },
          data: {
            pomodoroId: taskId, // 传递要删除的任务ID
            userId: userId, // 传递当前用户ID
          },
        }
      );

      // 如果请求成功，更新前端列表
      if (response.status === 204) {
        const updatedTasks = tasks.filter(
          (task) => task.pomodoroId !== currentTaskId
        );
        setTasks(updatedTasks);
        message.success("任務已刪除");
      }
    } catch (error) {
      console.error("刪除任務失敗:", error);
      message.error("刪除任務失敗，請稍後再試");
    }
    await fetchTasks();
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
          <HoverButton
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
          </HoverButton>
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
      <HoverButton
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
      </HoverButton>

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
          renderItem={(task) => (
            <List.Item
              actions={[
                <HoverButton
                  type="primary"
                  onClick={() => {
                    setCurrentTask(task.pomodoroName);
                    setCurrentTaskId(task.pomodoroId);
                    setPlanName(task.pomodoroName);
                    setBreakDuration(task.breakDuration);
                    setWorkDuration(task.workDuration);
                    setTimeLeft(task.workDuration);
                    setPomodoroVisible(true); // 顯示 Pomodoro 計時器
                  }}
                  key={task.pomodoroId}
                >
                  開始 Pomodoro
                </HoverButton>,
                <Button
                  type="default"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteTask(task.pomodoroId)} // 刪除任務的函數
                  style={{ marginLeft: 8 }}
                >
                  刪除
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={task.pomodoroName}
                description={`累計時長：${task.totalTime} 分鐘`}
              />
            </List.Item>
          )}
        />
      </div>
    </>
  );
};

export default PomodoroTimer;
