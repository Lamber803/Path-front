import axios from "axios";
// 封装更新 Pomodoro 设置的 API，使用同一个函数处理不同请求
export const updatePomodoroSettings = async (
  data: any,
  type: "name" | "timer" // 类型限制，确保 type 只能是 "name" 或 "timer"
) => {
  try {
    let response;

    // 判断更新类型，根据类型选择对应的 API 路径
    if (type === "name") {
      // 更新 Pomodoro 名称
      response = await axios.put(
        `http://localhost:8080/api/pomodoro/tasks/name`,
        data,
        {
          headers: {
            "Content-Type": "application/json", // 如果是JSON数据，使用application/json
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
    } else if (type === "timer") {
      // 更新 Pomodoro 计时器设置
      response = await axios.put(
        `http://localhost:8080/api/pomodoro/tasks/timer`,
        data,
        {
          headers: {
            "Content-Type": "application/json", // 如果是JSON数据，使用application/json
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
    } else {
      throw new Error("Invalid update type: " + type);
    }

    return response.data;
  } catch (error) {
    console.error("Pomodoro 更新错误:", error);
    throw error;
  }
};
