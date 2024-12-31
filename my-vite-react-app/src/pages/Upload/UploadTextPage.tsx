import React from "react";
import { Layout } from "antd";
import CustomHeader from "../custom-header/CustomHeader";
import DocumentForm from "./DocumentForm"; // 引入刚才创建的 DocumentForm 组件
import { Input, Button, Upload, Card, Tag, Typography, message } from "antd";

const { Sider, Content } = Layout;

interface UploadTextPageProps {
  userId: number; // 父组件传入的 userId
}

const UploadTextPage: React.FC<UploadTextPageProps> = ({ userId }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <CustomHeader
        bgColor="#e9af88"
        menuColor={{ frontColor: "#000000", hoverColor: "#fff" }}
      />

      <Layout>
        {/* Sidebar */}
        <Sider width={250} style={{ background: "#f7f4f1", padding: 20 }}>
          <h3>已选标签</h3>
          <div>
            {["创新", "高效", "现代"].map((tag) => (
              <Tag color="blue" closable key={tag}>
                {tag}
              </Tag>
            ))}
          </div>
        </Sider>

        {/* Content */}
        <Content style={{ padding: "20px", background: "#fff" }}>
          {/* 使用 DocumentForm 组件 */}
          <DocumentForm userId={userId} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default UploadTextPage;
