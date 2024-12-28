import React, { useState } from "react";
import { Layout, Button, Modal, Select } from "antd";
import Chart from "./Chart";
import CustomHeader from "../custom-header/CustomHeader";
import axios from "axios";

const { Content } = Layout;
interface ChartPageProps {
  userId: number; // 父组件传入的 userId
}

const ChartPage: React.FC<ChartPageProps> = ({ userId }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [layout, setLayout] = useState<string>("full"); // 預設為滿版佈局
  const [showButton, setShowButton] = useState(true); // 控制按鈕顯示狀態

  const handleLayoutChange = (value: string) => {
    setLayout(value);
    setIsModalVisible(false); // 設置選擇後關閉模態框
  };

  // 根據選擇的布局來設置格子
  const generateChartGrids = () => {
    const charts = [];
    let numCharts = 0;

    // 定義每種布局需要的圖表數量
    if (layout === "full") {
      numCharts = 1;
    } else if (layout === "two") {
      numCharts = 2;
    } else if (layout === "four") {
      numCharts = 4;
    } else if (layout === "six") {
      numCharts = 6;
    }

    // 根據選擇的數量來生成對應的 Chart 元件
    for (let i = 0; i < numCharts; i++) {
      charts.push(<Chart key={i} />);
    }

    return charts;
  };

  return (
    <Layout style={{ minHeight: "100vh", overflow: "hidden" }}>
      <CustomHeader
        bgColor="#7490b9"
        menuColor={{ frontColor: "#ffe6e6", hoverColor: "#d0c1c1" }}
      />
      <Layout style={{ padding: "20px", position: "relative" }}>
        {/* 始終顯示 layout 按鈕 */}
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
            // 動態根據選擇的布局來設置列數
            gridTemplateColumns:
              layout === "full"
                ? "1fr"
                : layout === "two"
                ? "1fr 1fr"
                : layout === "four"
                ? "1fr 1fr" // 2列
                : "1fr 1fr 1fr", // 3列

            gridTemplateRows:
              layout === "full"
                ? "1fr"
                : layout === "two"
                ? "1fr"
                : layout === "four"
                ? "1fr 1fr" // 2行
                : "1fr 1fr", // 2行

            gridGap: "20px",
            height: "calc(100vh - 120px)", // 防止滾動條
            overflow: "hidden",
          }}
        >
          {generateChartGrids()}
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
          <Select.Option value="four">4 Columns (2x2)</Select.Option>
          <Select.Option value="six">6 Columns (2x3)</Select.Option>
        </Select>
      </Modal>
    </Layout>
  );
};

export default ChartPage;
