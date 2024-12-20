import React from "react";
import { Layout, Button, Card, Typography, Row, Col, Divider } from "antd";
import { Link } from "react-router-dom";
import {
  FileTextOutlined,
  AppstoreAddOutlined,
  SearchOutlined,
  ClockCircleOutlined, // 番茄時鐘圖標
  CalendarOutlined, // 行事曆圖標
} from "@ant-design/icons";
import styled from "styled-components";
import CustomHeaderLogin from "../custom-header/CustomHeaderLogin";

const { Header, Footer, Content } = Layout;
const { Title, Text } = Typography;

// 使用 styled-components 定義樣式
const StyledHeader = styled(Header)<{ bgColor?: string }>`
  background: ${(props) => props.bgColor || "#f5e4d8"};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const StyledButton = styled(Button)`
  background-color: #b86159;
  border-color: #b86159;
  color: #fff;

  &:hover {
    background-color: #85312b !important;
    border-color: #85312b !important;
  }
`;

const StyledCard = styled(Card)`
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Menu: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <CustomHeaderLogin
        menuColor={{ frontColor: "#923c3c", hoverColor: "#6f6262" }}
      />

      <Content style={{ padding: "40px 20px", background: "#fff" }}>
        <Row gutter={16}>
          <Col span={8}>
            <StyledCard style={{ marginTop: 20, marginBottom: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FileTextOutlined style={{ fontSize: 40, color: "#b86159" }} />
              </div>
              <Title level={4} style={{ textAlign: "center", marginTop: 10 }}>
                文檔創建
              </Title>
              <Text style={{ display: "block", textAlign: "center" }}>
                創建並管理您的文檔，提供簡單易用的文檔編輯。
              </Text>
              <div style={{ textAlign: "center", marginTop: 20 }}>
                {/* <Link to="/upload-text">
                  <StyledButton>創建文檔</StyledButton>
                </Link> */}
              </div>
            </StyledCard>
          </Col>
          <Col span={8}>
            <StyledCard style={{ marginTop: 20, marginBottom: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AppstoreAddOutlined
                  style={{ fontSize: 40, color: "#b86159" }}
                />
              </div>
              <Title level={4} style={{ textAlign: "center", marginTop: 10 }}>
                任務管理
              </Title>
              <Text style={{ display: "block", textAlign: "center" }}>
                管理您的任務進度，隨時追蹤各項任務。
              </Text>
              <div style={{ textAlign: "center", marginTop: 20 }}>
                {/* <Link to="/char">
                  <StyledButton>查看任務</StyledButton>
                </Link> */}
              </div>
            </StyledCard>
          </Col>
          <Col span={8}>
            <StyledCard style={{ marginTop: 20, marginBottom: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SearchOutlined style={{ fontSize: 40, color: "#b86159" }} />
              </div>
              <Title level={4} style={{ textAlign: "center", marginTop: 10 }}>
                強化學習
              </Title>
              <Text style={{ display: "block", textAlign: "center" }}>
                提供注意力工具，及學習互動功能，學習一條龍。
              </Text>
              <div style={{ textAlign: "center", marginTop: 20 }}>
                {/* <Link to="/search">
                  <StyledButton>查看筆記</StyledButton>
                </Link> */}
              </div>
            </StyledCard>
          </Col>
        </Row>

        <Divider style={{ marginTop: 50, marginBottom: 50 }} />

        <Row gutter={16} justify="center">
          {/* 左側的 Card - 番茄時鐘 */}
          <Col span={8}>
            <StyledCard style={{ marginTop: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ClockCircleOutlined
                  style={{ fontSize: 40, color: "#b86159" }}
                />
              </div>
              <Title
                level={4}
                style={{ textAlign: "center", marginTop: 15, marginBottom: 15 }}
              >
                番茄鐘
              </Title>
              <Text
                style={{
                  display: "block",
                  textAlign: "center",
                  marginBottom: 10,
                  paddingBottom: 37,
                }}
              >
                使用番茄鐘進行時間管理，增加用戶成就感，提升工作效率，並為未來提供改進數據，讓任務進度可視化。
              </Text>
              <div style={{ textAlign: "center" }}>
                {/* <Link to="/pomodoro">
                  <StyledButton>開始計時</StyledButton>
                </Link> */}
              </div>
            </StyledCard>
          </Col>

          {/* 中間的 Card (原本的內容) */}
          <Col span={8}>
            <StyledCard style={{ marginTop: 20 }}>
              <Title level={3} style={{ textAlign: "center", marginTop: 20 }}>
                歡迎來到您的個人化平台
              </Title>
              <Text
                style={{
                  display: "block",
                  textAlign: "center",
                  marginBottom: 10,
                  paddingTop: 20,
                  paddingBottom: 20,
                }}
              >
                在這裡，您可以揮灑泉湧的文思，系統規劃自己的足跡。
                <br />
                時間沖淡過去，由我帶你緬懷。
              </Text>
              <div style={{ textAlign: "center" }}>
                <Link to="/login">
                  <StyledButton>即刻登入</StyledButton>
                </Link>
              </div>
            </StyledCard>
          </Col>

          {/* 右側的 Card - 行事曆 */}
          <Col span={8}>
            <StyledCard style={{ marginTop: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CalendarOutlined style={{ fontSize: 40, color: "#b86159" }} />
              </div>
              <Title
                level={4}
                style={{ textAlign: "center", marginTop: 15, marginBottom: 15 }}
              >
                行事曆
              </Title>
              <Text
                style={{
                  display: "block",
                  textAlign: "center",
                  marginBottom: 10,
                  paddingBottom: 37,
                }}
              >
                讓您輕鬆管理每日行程，追蹤重要日程，提供代辦事項清單，心情紀錄功能，不只規劃高效生活，更享受生活。
              </Text>
              <div style={{ textAlign: "center" }}>
                {/* <Link to="/calendar">
                  <StyledButton>查看行程</StyledButton>
                </Link> */}
              </div>
            </StyledCard>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Menu;
