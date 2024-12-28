import React, { useState } from "react";
import { Layout, Button, Modal, Select } from "antd";
import Chart from "./Chart";
import CustomHeader from "../custom-header/CustomHeader";

const { Content } = Layout;

const ChartPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [layout, setLayout] = useState<string>("full"); // 預設為滿版佈局
  const [subLayout, setSubLayout] = useState<string>("horizontal"); // 用於二分和三分的子佈局
  const [showButton, setShowButton] = useState(true); // 控制按鈕顯示狀態

  const handleLayoutChange = (value: string) => {
    setLayout(value);
    setIsModalVisible(false);
  };

  const handleSubLayoutChange = (value: string) => {
    setSubLayout(value);
  };

  const handleButtonClick = () => {
    setIsModalVisible(true);
    setShowButton(false); // 隱藏按鈕
  };

  return (
    <Layout style={{ minHeight: "100vh", overflow: "hidden" }}>
      <CustomHeader
        bgColor="#7490b9"
        menuColor={{ frontColor: "#ffe6e6", hoverColor: "#d0c1c1" }}
      />
      <Layout style={{ padding: "20px", position: "relative" }}>
        {showButton && (
          <Button
            style={{
              position: "absolute",
              top: "28px",
              right: "45px",
              zIndex: 1000,
              backgroundColor: "#7490b9",
              color: "#fff",
            }}
            onClick={() => setIsModalVisible(true)}
          >
            Layout
          </Button>
        )}

        <Content
          style={{
            background: "#fff",
            padding: "20px",
            margin: "0 16px",
            borderRadius: "8px",
            display: "grid",
            gridTemplateColumns:
              layout === "full"
                ? "1fr"
                : layout === "two"
                ? subLayout === "horizontal"
                  ? "1fr 1fr"
                  : "1fr"
                : layout === "three"
                ? subLayout === "horizontal"
                  ? "1fr 1fr"
                  : "1fr 1fr"
                : layout === "four"
                ? "1fr 1fr 1fr 1fr"
                : "1fr 1fr 1fr 1fr 1fr 1fr", // 六等份
            gridGap: "20px",
            height: "calc(100vh - 120px)", // 設置高度防止滾動條
            overflow: "hidden",
          }}
        >
          {layout === "full" && <Chart />}
          {layout === "two" && (
            <>
              <Chart />
              <Chart />
            </>
          )}
          {layout === "three" && (
            <>
              {subLayout === "horizontal" ? (
                <>
                  <Chart />
                  <Chart />
                </>
              ) : (
                <>
                  <Chart />
                  <Chart />
                </>
              )}
            </>
          )}
          {layout === "four" && (
            <>
              <Chart />
              <Chart />
              <Chart />
              <Chart />
            </>
          )}
          {layout === "six" && (
            <>
              <Chart />
              <Chart />
              <Chart />
              <Chart />
              <Chart />
              <Chart />
            </>
          )}
        </Content>
      </Layout>

      <Modal
        title="Select Layout"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Select
          style={{ width: "100%" }}
          value={layout}
          onChange={handleLayoutChange}
        >
          <Select.Option value="full">Full Width</Select.Option>
          <Select.Option value="two">2 Columns</Select.Option>
          <Select.Option value="three">3 Columns</Select.Option>
          <Select.Option value="four">4 Columns</Select.Option>
          <Select.Option value="six">6 Columns</Select.Option>
        </Select>
        {layout === "two" || layout === "three" ? (
          <div style={{ marginTop: "20px" }}>
            <Select
              style={{ width: "100%" }}
              value={subLayout}
              onChange={handleSubLayoutChange}
            >
              <Select.Option value="horizontal">Horizontal Split</Select.Option>
              <Select.Option value="vertical">Vertical Split</Select.Option>
            </Select>
          </div>
        ) : null}
      </Modal>
    </Layout>
  );
};

export default ChartPage;
