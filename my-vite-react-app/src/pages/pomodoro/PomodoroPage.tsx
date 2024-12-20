import React from "react";
import { Layout } from "antd";
import PomodoroTimer from "./Pomodorotimer";
import CustomHeader from "../custom-header/CustomHeader";

const { Header, Content } = Layout;

const PomodoroPage: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <CustomHeader
        bgColor="#ad4545"
        menuColor={{ frontColor: "#ffe6e6", hoverColor: "#d0c1c1" }}
      />
      <Layout style={{ padding: "20px" }}>
        <Content
          style={{
            background: "#fff",
            padding: "20px",
            margin: "0 16px",
            borderRadius: "8px",
          }}
        >
          <PomodoroTimer />
        </Content>
      </Layout>
    </Layout>
  );
};

export default PomodoroPage;
