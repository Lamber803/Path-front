import React, { useEffect, useState } from "react";
import {
  Layout,
  Button,
  Spin,
  Modal,
  Input,
  message,
  Collapse,
  Menu,
  Progress,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  FolderAddOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons"; // 添加图标
import { useNavigate } from "react-router-dom";

const { Header, Footer, Sider, Content } = Layout;
const { Panel } = Collapse;

// 定义目标、进度和提醒的类型
interface Goal {
  goalId: number;
  title: string;
  targetDate: string;
  completed: boolean;
}

interface ProgressTracking {
  progressId: number;
  goalId: number;
  progress: number; // 进度百分比
  status: string; // e.g. "In Progress", "Completed"
}

interface Reminder {
  reminderId: number;
  message: string;
  date: string; // 提醒的日期和时间
}

const LearningSidebar: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]); // 存储学习目标
  const [progressList, setProgressList] = useState<ProgressTracking[]>([]); // 存储进度
  const [reminders, setReminders] = useState<Reminder[]>([]); // 存储提醒
  const [loading, setLoading] = useState<boolean>(false); // 存储加载状态
  const [creatingGoal, setCreatingGoal] = useState<boolean>(false); // 控制目标创建弹窗
  const [modalVisible, setModalVisible] = useState<boolean>(false); // 控制编辑目标弹窗
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null); // 当前编辑的目标
  const [goalTitle, setGoalTitle] = useState<string>(""); // 目标标题
  const [goalDate, setGoalDate] = useState<string>(""); // 目标日期
  const navigate = useNavigate(); // 使用 useNavigate 来控制页面跳转

  const userId = 1; // 暂时硬编码 userId 为 1（替换为任何您需要的用户ID）

  // 模拟数据加载
  useEffect(() => {
    setLoading(true);
    // 假数据
    setGoals([
      {
        goalId: 1,
        title: "学习React基础",
        targetDate: "2024-12-15",
        completed: false,
      },
      {
        goalId: 2,
        title: "完成项目设计文档",
        targetDate: "2024-12-10",
        completed: true,
      },
    ]);
    setProgressList([
      { progressId: 1, goalId: 1, progress: 50, status: "In Progress" },
      { progressId: 2, goalId: 2, progress: 100, status: "Completed" },
    ]);
    setReminders([
      {
        reminderId: 1,
        message: "请在今天完成React学习任务！",
        date: "2024-12-06T09:00:00",
      },
      {
        reminderId: 2,
        message: "不要忘记提交项目设计文档！",
        date: "2024-12-06T12:00:00",
      },
    ]);
    setLoading(false);
  }, [userId]);

  // 处理点击目标
  const handleGoalClick = (goalId: number) => {
    navigate(`/goals/details?goalId=${goalId}`); // 跳转到目标详情页
  };

  // 打开编辑目标弹窗
  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setGoalTitle(goal.title);
    setGoalDate(goal.targetDate);
    setModalVisible(true);
  };

  // 处理删除目标
  const handleDeleteGoal = async (goalId: number) => {
    try {
      setGoals(goals.filter((goal) => goal.goalId !== goalId)); // 从列表中删除目标
      message.success("目标删除成功");
    } catch (error) {
      console.error("Error deleting goal:", error);
      message.error("删除目标失败");
    }
  };

  // 处理创建目标
  const handleCreateGoal = () => {
    setCreatingGoal(true);
  };

  // 处理编辑目标提交
  const handleModalOk = async () => {
    if (!goalTitle || !goalDate) {
      message.error("请输入目标标题和日期");
      return;
    }
    try {
      setGoals(
        goals.map((goal) =>
          goal.goalId === editingGoal?.goalId
            ? { ...goal, title: goalTitle, targetDate: goalDate }
            : goal
        )
      );
      setModalVisible(false);
      message.success("目标编辑成功");
    } catch (error) {
      console.error("Error editing goal:", error);
      message.error("编辑目标失败");
    }
  };

  // 处理编辑目标取消
  const handleModalCancel = () => {
    setModalVisible(false);
  };

  // 处理创建目标确认
  const handleCreateGoalOk = () => {
    if (!goalTitle || !goalDate) {
      message.error("请输入目标标题和日期");
      return;
    }
    const newGoal = {
      goalId: Date.now(),
      title: goalTitle,
      targetDate: goalDate,
      completed: false,
    };
    setGoals([...goals, newGoal]);
    setCreatingGoal(false);
    message.success("目标创建成功");
  };

  // 处理创建目标取消
  const handleCreateGoalCancel = () => {
    setCreatingGoal(false);
  };

  // 渲染学习目标
  const renderGoals = () => {
    return goals.map((goal) => {
      const progress = progressList.find((p) => p.goalId === goal.goalId);
      return (
        <Panel header={goal.title} key={goal.goalId}>
          <div>目标日期: {goal.targetDate}</div>
          <div>完成状态: {goal.completed ? "已完成" : "进行中"}</div>
          <Progress
            percent={progress ? progress.progress : 0}
            status={goal.completed ? "success" : "active"}
          />
          <Button
            type="link"
            onClick={() => handleEditGoal(goal)}
            icon={<EditOutlined />}
            style={{ marginTop: 10 }}
          >
            编辑目标
          </Button>
          <Button
            type="link"
            onClick={() => handleDeleteGoal(goal.goalId)}
            icon={<DeleteOutlined />}
            danger
            style={{ marginTop: 10, marginLeft: 10 }}
          >
            删除目标
          </Button>
        </Panel>
      );
    });
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f7f4f1" }}>
      {/* Header */}
      <Header
        style={{
          background: "#f5e4d8",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
        }}
      >
        <div style={{ fontSize: 24 }}>📚</div>
        <Menu
          mode="horizontal"
          theme="light"
          style={{ flex: 1, background: "transparent" }}
          items={["進度", "目標", "提醒"].map((item) => ({
            key: item,
            label: item,
          }))}
        />
        <div>
          <Button type="text">登入</Button>
          <Button
            type="primary"
            style={{ backgroundColor: "#d8a29d", borderColor: "#d8a29d" }}
          >
            註冊
          </Button>
        </div>
      </Header>

      <Layout>
        {/* Sidebar */}
        <Sider
          width={250}
          style={{
            background: "#f7f4f1",
            padding: "20px",
            borderRight: "1px solid #e0e0e0",
            height: "calc(100vh - 64px - 64px)",
            overflow: "auto",
          }}
        >
          <h2 style={{ paddingLeft: "10px" }}>學習管理</h2>
          <Button
            type="primary"
            icon={<FolderAddOutlined />}
            onClick={handleCreateGoal}
            style={{ marginBottom: 16 }}
          >
            新建目標
          </Button>
          <Collapse defaultActiveKey={["1"]}>{renderGoals()}</Collapse>
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
            <div>選擇一個學習目標以查看詳細信息</div>
          </Content>
        </Layout>
      </Layout>

      {/* 创建目标弹窗 */}
      <Modal
        title="编辑目标"
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Input
          value={goalTitle}
          onChange={(e) => setGoalTitle(e.target.value)}
          placeholder="请输入目标标题"
        />
        <Input
          value={goalDate}
          onChange={(e) => setGoalDate(e.target.value)}
          placeholder="请输入目标日期"
          style={{ marginTop: 10 }}
        />
      </Modal>

      {/* 创建目标弹窗 */}
      <Modal
        title="创建目标"
        visible={creatingGoal}
        onOk={handleCreateGoalOk}
        onCancel={handleCreateGoalCancel}
      >
        <Input
          value={goalTitle}
          onChange={(e) => setGoalTitle(e.target.value)}
          placeholder="请输入目标标题"
        />
        <Input
          value={goalDate}
          onChange={(e) => setGoalDate(e.target.value)}
          placeholder="请输入目标日期"
          style={{ marginTop: 10 }}
        />
      </Modal>
    </Layout>
  );
};

export default LearningSidebar;
