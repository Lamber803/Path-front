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

  /* 選中時樣式 */
  &.ant-radio-button-wrapper-checked::before {
    background-color: ${(props) =>
      props.checked ? props.selectedColor || "#e74c3c" : "#d9d9d9"};
    z-index: -1;
  }

  &.ant-radio-button-wrapper-checked {
    border-color: ${(props) =>
      props.checked ? props.selectedColor || "#e74c3c" : "#d9d9d9"};
  }

  /* 禁用 checked 狀態下的 hover 效果 */
  &.ant-radio-button-wrapper-checked:hover {
    border-color: ${(props) =>
      props.checked ? props.selectedColor || "#e74c3c" : "#a2e38c"};
  }
  /* 針對第一個按鈕 */
  &:first-child.ant-radio-button-wrapper-checked {
    border-color: ${(props) =>
      props.checked ? props.selectedColor || "#a2e38c" : "#d9d9d9"};
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
  eventLocation?: string; // 地點
  eventStartTime?: Date;
  eventEndTime?: Date;
  eventMood?: string; // 心情
  eventColor: string; // 顏色
  eventRepeat?: string; // 重複選項
  isCompleted?: boolean; // 是否已完成
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
        // eventRepeat: "none", // 默認無重複
        isCompleted: false, // 默認未完成
        userId: userId,
      }
    );

    setStartTime(moment(eventStartTime)); // 設置開始時間
    setEndTime(moment(eventEndTime)); // 設置結束時間
    setModalVisible(true);
  };

  // 處理保存事件
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
      // eventRepeat: values.repeat,
      isCompleted: currentEvent?.isCompleted || false, // 保持完成狀態
      userId: userId,
    };
    console.log(newEvent);
    try {
      // 把前端的 event 數據發送到后端 API
      const response = await axios.post(
        "http://localhost:8080/api/calendar/events",
        newEvent,
        {
          headers: {
            "Content-Type": "application/json", // 改為 application/json
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      // 將新保存的事件添加到事件列表
      setEvents((prevEvents) => [...prevEvents, response.data]);
      setModalVisible(false);
      message.success("事件已保存");
      setCurrentEvent(null);
    } catch (error) {
      console.error("保存事件失敗:", error);
      message.error("保存事件失敗，請稍後再試");
      setCurrentEvent(null);
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
  const markEventAsCompleted = async () => {
    if (!currentEvent) return;

    const newCompletionStatus = !currentEvent.isCompleted;

    // 确保 eventId 是有效的
    if (!currentEvent.eventId) {
      console.error("Event ID is missing or invalid.");
      message.error("事件ID无效，请重试");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/calendar/events/complete`,
        {
          eventId: currentEvent.eventId,
          userId: userId,
          isCompleted: newCompletionStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      // 更新事件状态
      const updatedEvents = events.map((event) =>
        event.eventId === currentEvent.eventId
          ? { ...event, isCompleted: newCompletionStatus }
          : event
      );
      setEvents(updatedEvents); // 更新本地事件列表

      setModalVisible(false);
      message.success(
        newCompletionStatus ? "事件已標記成完成" : "事件已取消標記完成"
      );
    } catch (error) {
      console.error("更新事件失敗:", error);
      message.error("更新事件失敗，請稍後再試");
    }
  };

  // 刪除事件
  const deleteEvent = async () => {
    if (!currentEvent) return;

    try {
      const response = await axios.delete(
        `http://localhost:8080/api/calendar/events`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
          data: {
            eventId: currentEvent.eventId,
            userId: userId, // 確保傳遞用戶ID
          },
        }
      );

      if (response.status === 204) {
        // 刪除成功後更新本地事件
        const updatedEvents = events.filter(
          (event) => event.eventId !== currentEvent.eventId
        );
        setEvents(updatedEvents);
        setModalVisible(false); // 關閉彈窗
        message.success("事件已刪除");
      }
    } catch (error) {
      console.error("刪除事件失敗:", error);
      message.error("刪除事件失敗，請稍後再試");
    }
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
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // 如果有需要，可以添加認證token
            },
          }
        );

        // 打印返回的數據
        console.log("API Response Data:", response.data);

        // 如果有數據，映射它们並轉換時間格式
        if (response.data && Array.isArray(response.data)) {
          const formattedEvents = response.data.map((event: any) => ({
            ...event,
            eventStartTime: new Date(event.eventStartTime), // 轉換為 Date 对象
            eventEndTime: new Date(event.eventEndTime), // 轉換為 Date 对象
            start: new Date(event.eventStartTime), // 兼容 react-big-calendar 需要的字段
            end: new Date(event.eventEndTime), // 兼容 react-big-calendar 需要的字段
            title: event.eventTitle,
          }));
          setEvents(formattedEvents); // 更新事件數據
        } else {
          console.log("No events found for this user.");
          setEvents([]); // 如果没有事件，清空事件
        }
      } catch (error) {
        console.error("獲取事件失敗:", error);
        message.error("獲取事件失敗，請稍候再試");
      }
    };

    fetchEvents(); // 調用事件函數

    // 禁用 Agenda 日期染色
    const style = document.createElement("style");
    style.innerHTML = `
      .rbc-agenda-date-cell {
        background-color: white !important;
      }
      .rbc-agenda-time-cell {
        background-color: white !important;
      }
      .rbc-agenda-event-cell {
        background-color: white !important;
    `;
    document.head.appendChild(style);

    // 動態設置日曆高度
    const handleResize = () => {
      setCalendarHeight(window.innerHeight - 200); // 根據需要改變 200
    };

    handleResize(); // 初始化高度設置
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [userId]); // 監聽使用者id變化

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
          <TodoApp userId={userId} />
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
                }} // 日期範圍彈窗
                selectable
                eventPropGetter={eventStyleGetter} // 事件顏色設置
                onSelectEvent={handleEventClick} // 點擊事件編輯
                views={{ month: true, week: true, day: true, agenda: true }} // 禁用month視圖下功能
                onView={setView} // 更新视图
              />
            </div>

            {/* 工具欄: 新增事件按鈕 */}
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
                  backgroundColor: "rgb(221 148 98)",
                  borderColor: "rgb(221 148 98)",
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
        onCancel={() => {
          setModalVisible(false);
          setCurrentEvent(null);
        }}
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
          {/* <Form.Item label="重複" name="repeat">
            <Radio.Group>
              <Radio.Button value="none">無</Radio.Button>
              <Radio.Button value="daily">每天</Radio.Button>
              <Radio.Button value="weekly">每週</Radio.Button>
              <Radio.Button value="monthly">每月</Radio.Button>
            </Radio.Group>
          </Form.Item> */}
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
              {currentEvent ? "更新事件" : "保存事件"}
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
              title="你確定要刪除這個事件嗎?"
              onConfirm={deleteEvent}
              okText="刪除"
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
