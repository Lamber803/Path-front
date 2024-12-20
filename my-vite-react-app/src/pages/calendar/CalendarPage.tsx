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

const { Header, Content, Sider } = Layout;
const { Option } = Select;

const localizer = momentLocalizer(moment); // 使用 moment 來設置本地化

// 定義事件結構
interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  mood: string; // 心情
  actionPlan: string; // 行動計劃
  reflection: string; // 反思
  location: string; // 地點
  color: string; // 顏色
  repeat: string; // 重複選項
  completed: boolean; // 是否已完成
}

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]); // 存儲日曆事件
  const [modalVisible, setModalVisible] = useState(false); // 控制新增事件的彈窗顯示
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null); // 當前正在編輯的事件
  const [startTime, setStartTime] = useState<moment.Moment | null>(null); // 用來存儲開始時間
  const [endTime, setEndTime] = useState<moment.Moment | null>(null); // 用來存儲結束時間
  const [calendarHeight, setCalendarHeight] = useState<number>(700); // 設定日曆的高度
  const [view, setView] = useState<string>("month"); // 記錄當前視圖

  // 打開新建事件的彈窗
  const openModal = (start: Date, end: Date, eventToEdit?: Event) => {
    setCurrentEvent(
      eventToEdit || {
        id: `${start}-${end}`,
        title: "",
        start,
        end,
        mood: "",
        actionPlan: "",
        reflection: "",
        location: "",
        color: "#C0392B", // 默認顏色設為深紅色（較不飽和的暖色）
        repeat: "none", // 默認無重複
        completed: false, // 默認未完成
      }
    );

    setStartTime(moment(start)); // 設置開始時間
    setEndTime(moment(end)); // 設置結束時間
    setModalVisible(true);
  };

  // 处理保存事件
  const handleSaveEvent = (values: any) => {
    if (!values.title) {
      message.error("請輸入事件標題");
      return;
    }

    const updatedStart = startTime
      ?.set({
        hour: startTime?.hour(),
        minute: startTime?.minute(),
      })
      .toDate();

    const updatedEnd = endTime
      ?.set({
        hour: endTime?.hour(),
        minute: endTime?.minute(),
      })
      .toDate();

    const newEvent: Event = {
      ...currentEvent,
      title: values.title,
      mood: values.mood,
      actionPlan: values.actionPlan,
      reflection: values.reflection,
      location: values.location,
      color: values.color,
      repeat: values.repeat,
      start: updatedStart ?? currentEvent?.start,
      end: updatedEnd ?? currentEvent?.end,
      completed: currentEvent?.completed || false, // 保持完成狀態
    };

    const updatedEvents = events.filter(
      (event) => event.id !== currentEvent?.id
    );
    const repeatedEvents = generateRepeatedEvents(newEvent);

    setEvents([...updatedEvents, ...repeatedEvents]);
    setModalVisible(false);
    message.success("事件已保存");
  };

  const generateRepeatedEvents = (event: Event) => {
    let repeatedEvents: Event[] = [event];

    switch (event.repeat) {
      case "daily":
        repeatedEvents = Array.from({ length: 7 }).map((_, index) => ({
          ...event,
          id: `${event.id}-${index}`,
          start: moment(event.start).add(index, "days").toDate(),
          end: moment(event.end).add(index, "days").toDate(),
        }));
        break;
      case "weekly":
        repeatedEvents = Array.from({ length: 4 }).map((_, index) => ({
          ...event,
          id: `${event.id}-${index}`,
          start: moment(event.start).add(index, "weeks").toDate(),
          end: moment(event.end).add(index, "weeks").toDate(),
        }));
        break;
      case "monthly":
        repeatedEvents = Array.from({ length: 3 }).map((_, index) => ({
          ...event,
          id: `${event.id}-${index}`,
          start: moment(event.start).add(index, "months").toDate(),
          end: moment(event.end).add(index, "months").toDate(),
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
      event.id === currentEvent.id ? { ...event, completed: true } : event
    );
    setEvents(updatedEvents);
    setModalVisible(false); // 关闭模态框
    message.success("事件已標記為完成");
  };

  // 刪除事件
  const deleteEvent = () => {
    if (!currentEvent) return;

    const updatedEvents = events.filter(
      (event) => event.id !== currentEvent.id
    );
    setEvents(updatedEvents);
    setModalVisible(false); // 关闭模态框
    message.success("事件已刪除");
  };

  const eventStyleGetter = (event: Event) => {
    return {
      style: {
        backgroundColor: event.completed ? "#BDC3C7" : event.color, // 已完成事件顏色變灰
        borderBottom: `2px solid ${event.color}`,
        textDecoration: event.completed ? "line-through" : "none", // 已完成的任務顯示刪除線
      },
    };
  };

  const handleEventClick = (event: Event) => {
    openModal(event.start, event.end, event); // 打開模態框進行編輯
  };

  useEffect(() => {
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
  }, []);

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
            <Radio.Group>
              <Radio.Button value="happy">
                <SmileOutlined style={{ color: "#2ecc71" }} />
              </Radio.Button>
              <Radio.Button value="neutral">
                <MehOutlined style={{ color: "#95a5a6" }} />
              </Radio.Button>
              <Radio.Button value="sad">
                <FrownOutlined style={{ color: "#e74c3c" }} />
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="顏色" name="color">
            <Select defaultValue="#C0392B">
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
            <Button type="primary" htmlType="submit" block>
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
