import React from "react";
import { Layout } from "antd";
import PomodoroTimer from "./PomodoroTimer";
import CustomHeader from "../custom-header/CustomHeader";

interface PomodoroPageProps {
  userId: number; // 這是父組件傳遞給子組件的 userId
}
const { Header, Content } = Layout;

const PomodoroPage: React.FC<PomodoroPageProps> = ({ userId }) => {
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
          <PomodoroTimer userId={userId} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default PomodoroPage;
