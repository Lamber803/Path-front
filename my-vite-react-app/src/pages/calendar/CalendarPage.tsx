import React, { useState, useEffect } from "react";
import {
  Layout,
  Modal,
  Input,
  message,
  Form,
  Radio,
  Select,
  Button,
  Popconfirm,
  DatePicker,
} from "antd";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { SmileOutlined, MehOutlined, FrownOutlined } from "@ant-design/icons";
import TodoApp from "./ToDo";
import CustomHeader from "../custom-header/CustomHeader";
import styled from "styled-components";
import axios from "axios"; // 引入 axios

const { Content, Sider } = Layout;
const { Option } = Select;

const StyledRadioButton = styled(Radio.Button)<{
  checked?: boolean;
  selectedColor?: string;
}>`
  background-color: transparent !important;

  /* 选中时的背景色 */
  &.ant-radio-button-wrapper-checked::before {
    background-color: ${(props) =>
      props.checked ? props.selectedColor || "#e74c3c" : "#d9d9d9"};
    z-index: -1;
  }
  /* 增加选中时的边框宽度和样式 */
  &.ant-radio-button-wrapper-checked {
    border-color: ${(props) =>
      props.checked ? props.selectedColor || "#e74c3c" : "#d9d9d9"};
  }

  /* 禁用 checked 状态下的 hover 效果 */
  &.ant-radio-button-wrapper-checked:hover {
    border-color: ${(props) =>
      props.checked ? props.selectedColor || "#e74c3c" : "#a2e38c"};
  }
  /* 针对第一个按钮的样式 */
  &:first-child.ant-radio-button-wrapper-checked {
    border-color: ${(props) =>
      props.checked
        ? props.selectedColor || "#a2e38c"
        : "#d9d9d9"}; /* 为第一个按钮设置选中边框颜色 */
  }
`;
const localizer = momentLocalizer(moment); // 使用 moment 來設置本地化

interface CalendarPageProps {
  userId: number; // Expecting userId to be passed as a prop
}

// 定義事件結構
interface Event {
  eventId?: number;
  eventTitle: string;
  eventLocation: string; // 地點
  eventStartTime: Date;
  eventEndTime: Date;
  eventMood: string; // 心情
  eventColor: string; // 顏色
  eventRepeat: string; // 重複選項
  isCompleted: boolean; // 是否已完成
  userId: number;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ userId }) => {
  const [events, setEvents] = useState<Event[]>([]); // 存儲日曆事件
  const [modalVisible, setModalVisible] = useState(false); // 控制新增事件的彈窗顯示
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null); // 當前正在編輯的事件
  const [startTime, setStartTime] = useState<moment.Moment | null>(null); // 用來存儲開始時間
  const [endTime, setEndTime] = useState<moment.Moment | null>(null); // 用來存儲結束時間
  const [calendarHeight, setCalendarHeight] = useState<number>(700); // 設定日曆的高度
  const [view, setView] = useState<string>("month"); // 記錄當前視圖
  const [value, setValue] = useState("");
  console.log(userId);

  // 打開新建事件的彈窗
  const openModal = (
    eventStartTime: Date,
    eventEndTime: Date,
    eventToEdit?: Event
  ) => {
    setCurrentEvent(
      eventToEdit || {
        eventTitle: "",
        eventLocation: "",
        eventStartTime,
        eventEndTime,
        eventMood: "",
        eventColor: "",
        eventRepeat: "none", // 默認無重複
        isCompleted: false, // 默認未完成
        userId: userId,
      }
    );

    setStartTime(moment(eventStartTime)); // 設置開始時間
    setEndTime(moment(eventEndTime)); // 設置結束時間
    setModalVisible(true);
  };

  // 处理保存事件
  const handleSaveEvent = async (values: any) => {
    if (!values.title) {
      message.error("請輸入事件標題");
      return;
    }
    console.log(userId);

    const updatedStart = startTime
      ? startTime
          .set({ hour: startTime.hour(), minute: startTime.minute() })
          .toDate()
      : new Date(); // 默認為當前時間

    const updatedEnd = endTime
      ? endTime.set({ hour: endTime.hour(), minute: endTime.minute() }).toDate()
      : new Date(); // 默認為當前時間

    const newEvent: Event = {
      ...currentEvent,
      eventTitle: values.title,
      eventLocation: values.location,
      eventStartTime: updatedStart,
      eventEndTime: updatedEnd,
      eventMood: values.mood,
      eventColor: values.color,
      eventRepeat: values.repeat,
      isCompleted: currentEvent?.isCompleted || false, // 保持完成狀態
      userId: userId,
    };
    console.log(newEvent);
    try {
      // 把前端的 event 数据发送到后端 API
      const response = await axios.post(
        "http://localhost:8080/api/calendar/events",
        newEvent,
        {
          headers: {
            "Content-Type": "application/json", // 改为 application/json
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      // 将新保存的事件添加到事件列表
      setEvents((prevEvents) => [...prevEvents, response.data]);
      setModalVisible(false);
      message.success("事件已保存");
    } catch (error) {
      console.error("保存事件失败:", error);
      message.error("保存事件失败，请稍后再试");
    }
  };

  // 更新 generateRepeatedEvents 函數
  const generateRepeatedEvents = (event: Event) => {
    let repeatedEvents: Event[] = [event];

    switch (event.eventRepeat) {
      case "daily":
        // 每日重複，生成 7 天的事件
        repeatedEvents = Array.from({ length: 7 }).map((_, index) => ({
          ...event,
          eventId: event.eventId + index, // 確保每個事件有唯一的 eventId
          eventStartTime: moment(event.eventStartTime)
            .add(index, "days")
            .toDate(),
          eventEndTime: moment(event.eventEndTime).add(index, "days").toDate(),
        }));
        break;
      case "weekly":
        // 每週重複，生成 4 周的事件
        repeatedEvents = Array.from({ length: 4 }).map((_, index) => ({
          ...event,
          eventId: event.eventId + index, // 確保每個事件有唯一的 eventId
          eventStartTime: moment(event.eventStartTime)
            .add(index, "weeks")
            .toDate(),
          eventEndTime: moment(event.eventEndTime).add(index, "weeks").toDate(),
        }));
        break;
      case "monthly":
        // 每月重複，生成 3 個月的事件
        repeatedEvents = Array.from({ length: 3 }).map((_, index) => ({
          ...event,
          eventId: event.eventId + index, // 確保每個事件有唯一的 eventId
          eventStartTime: moment(event.eventStartTime)
            .add(index, "months")
            .toDate(),
          eventEndTime: moment(event.eventEndTime)
            .add(index, "months")
            .toDate(),
        }));
        break;
      default:
        break;
    }

    return repeatedEvents;
  };

  // 更新事件為完成
  const markEventAsCompleted = () => {
    if (!currentEvent) return;

    const updatedEvents = events.map((event) =>
      event.eventId === currentEvent.eventId
        ? { ...event, isCompleted: true } // 使用 isCompleted 而非 completed
        : event
    );
    setEvents(updatedEvents);
    setModalVisible(false); // 关闭模态框
    message.success("事件已標記為完成");
  };

  // 刪除事件
  const deleteEvent = () => {
    if (!currentEvent) return;

    const updatedEvents = events.filter(
      (event) => event.eventId !== currentEvent.eventId // 使用 eventId 而非 id
    );
    setEvents(updatedEvents);
    setModalVisible(false); // 关闭模态框
    message.success("事件已刪除");
  };

  // 事件樣式設定
  const eventStyleGetter = (event: Event) => {
    return {
      style: {
        backgroundColor: event.isCompleted ? "#BDC3C7" : event.eventColor, // 已完成事件顏色變灰
        borderBottom: `2px solid ${event.eventColor}`,
        textDecoration: event.isCompleted ? "line-through" : "none", // 已完成的任務顯示刪除線
      },
    };
  };

  const handleEventClick = (event: Event) => {
    openModal(event.eventStartTime, event.eventEndTime, event); // 打開模態框進行編輯
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/calendar/events?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // 如果有需要，可以添加认证token
            },
          }
        );
        setEvents(response.data); // 将获取的事件数据更新到 state
      } catch (error) {
        console.error("获取事件失败:", error);
        message.error("获取事件失败，请稍后再试");
      }
    };
    fetchEvents();
    // 动态添加样式来禁用Agenda日期染色
    const style = document.createElement("style");
    style.innerHTML = `
      .rbc-agenda-date-cell {
        background-color: white !important;
      }.rbc-agenda-time-cell {
        background-color: white !important;
      }
      .rbc-agenda-event-cell {
        background-color: white !important;
      }
  `;
    document.head.appendChild(style);

    // 动态设置日历高度
    const handleResize = () => {
      setCalendarHeight(window.innerHeight - 200); // 调整高度，根据需要改变200
    };

    handleResize(); // 初始化时设置高度
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [userId]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header */}
      <CustomHeader />

      <Layout>
        {/* Sidebar */}
        <Sider
          width={250}
          style={{
            background: "#f7f4f1",
            padding: "20px",
            borderRight: "1px solid #e0e0e0",
          }}
        >
          <TodoApp />
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
            {/* 直接使用日曆，去除Collapse包裹 */}
            <div style={{ padding: 20 }}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: calendarHeight }} // 使用動態計算的高度
                onSelectSlot={({ start, end }) => {
                  if (view !== "month") {
                    openModal(start, end);
                  } else {
                    message.error("請在非月視圖中創建事件");
                  }
                }} // 选取日期范围时打开弹窗
                selectable
                eventPropGetter={eventStyleGetter} // 设置事件颜色
                onSelectEvent={handleEventClick} // 点击事件进行编辑
                views={{ month: true, week: true, day: true, agenda: true }} // 这里禁用了 month 视图下的点击添加事件功能
                onView={setView} // 更新视图
              />
            </div>

            {/* 工具栏: 新增事件按钮 */}
            <div
              style={{
                textAlign: "center",
                marginRight: 85,
              }}
            >
              <Button
                type="primary"
                onClick={() => openModal(new Date(), new Date())}
                style={{
                  backgroundColor: "rgb(221 148 98)", // 可以根据需要设置按钮背景色
                  borderColor: "rgb(221 148 98)", // 按钮边框颜色
                }}
              >
                新增事件
              </Button>
            </div>
          </Content>
        </Layout>
      </Layout>

      {/* 新增事件的彈窗 */}
      <Modal
        title={currentEvent ? "編輯事件" : "新增日程"}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form onFinish={handleSaveEvent} initialValues={currentEvent || {}}>
          <Form.Item
            label="標題"
            name="title"
            rules={[{ required: true, message: "請輸入事件標題" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="心情" name="mood">
            <Radio.Group
              value={value}
              onChange={(e) => setValue(e.target.value)}
            >
              <StyledRadioButton
                value="happy"
                checked={value === "happy"}
                selectedColor={"#2ecc71"}
              >
                <SmileOutlined style={{ color: "#2ecc71" }} />
              </StyledRadioButton>
              <StyledRadioButton
                value="neutral"
                checked={value === "neutral"}
                selectedColor={"#95a5a6"}
              >
                <MehOutlined style={{ color: "#95a5a6" }} />
              </StyledRadioButton>
              <StyledRadioButton
                value="sad"
                checked={value === "sad"}
                selectedColor={"#e74c3c"}
              >
                <FrownOutlined style={{ color: "#e74c3c" }} />
              </StyledRadioButton>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="顏色" name="color">
            <Select>
              <Option value="#D98880">紅色</Option>
              <Option value="#F5B041">橙色</Option>
              <Option value="#F4D03F">金色</Option>
              <Option value="#935116">棕色</Option>
            </Select>
          </Form.Item>
          <Form.Item label="地點" name="location">
            <Input />
          </Form.Item>
          <Form.Item label="重複" name="repeat">
            <Radio.Group>
              <Radio.Button value="none">無</Radio.Button>
              <Radio.Button value="daily">每天</Radio.Button>
              <Radio.Button value="weekly">每週</Radio.Button>
              <Radio.Button value="monthly">每月</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="開始時間" name="startTime">
            <DatePicker
              value={startTime}
              onChange={setStartTime}
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item label="結束時間" name="endTime">
            <DatePicker
              value={endTime}
              onChange={setEndTime}
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              style={{ backgroundColor: "rgb(221 148 98)" }}
              htmlType="submit"
              block
            >
              保存事件
            </Button>
          </Form.Item>
        </Form>

        {/* 編輯/刪除/完成按鈕 */}
        {currentEvent && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 16,
            }}
          >
            <Button
              type="default"
              onClick={markEventAsCompleted}
              style={{ width: "45%" }}
            >
              標記為已完成
            </Button>
            <Popconfirm
              title="你确定要删除这个事件吗?"
              onConfirm={deleteEvent}
              okText="删除"
              cancelText="取消"
            >
              <Button type="default" danger style={{ width: "45%" }}>
                刪除事件
              </Button>
            </Popconfirm>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default CalendarPage;
