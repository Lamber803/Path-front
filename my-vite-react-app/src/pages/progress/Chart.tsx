import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import { BarChart, Bar } from "recharts";
import { SketchPicker } from "react-color"; // 引入調色盤
import { Modal, Button, Select, Input, Form } from "antd"; // 使用 Ant Design Modal 和其他組件

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const chartTypes = [
  { label: "Area Chart", value: "area" },
  { label: "Pie Chart", value: "pie" },
  { label: "Stacked Bar Chart", value: "stacked-bar" },
  { label: "Bar Chart", value: "bar" },
];

const Chart = () => {
  const [chartType, setChartType] = useState("area");
  const [data, setData] = useState([]);
  const [chartName, setChartName] = useState("");
  const [charts, setCharts] = useState([]);
  const [chartColors, setChartColors] = useState(COLORS);
  const [isModalOpen, setIsModalOpen] = useState(false); // 控制彈窗顯示
  const [layout, setLayout] = useState("two"); // 預設佈局選擇
  const [showButton, setShowButton] = useState(true); // 控制按鈕顯示狀態
  const [editChartIndex, setEditChartIndex] = useState(null); // 控制編輯的圖表索引

  // 處理圖表類型變化
  const handleChartTypeChange = (value) => {
    setChartType(value);
    setData([]); // 重置數據
  };

  // 處理數據變化
  const handleDataChange = (e, index, field) => {
    const newData = [...data];
    newData[index][field] =
      field === "value" ? parseFloat(e.target.value) : e.target.value;
    setData(newData);
  };

  // 增加數據項
  const handleAddData = () => {
    let newData = { name: "", value: "" };

    if (chartType === "stacked-bar") {
      newData = { name: "", value: "", value2: "" };
    } else if (chartType === "pie") {
      newData = { name: "", value: 0 };
    }

    setData([...data, newData]);
  };

  // 移除數據項
  const handleRemoveData = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };

  // 保存圖表
  const handleSaveChart = () => {
    if (!chartName || data.length === 0) {
      alert("Please enter a chart name and data.");
      return;
    }

    if (charts.length >= 6) {
      alert("You can only create up to 6 charts.");
      return;
    }

    const newChart = {
      name: chartName,
      type: chartType,
      data: data,
      colors: chartColors,
      layoutPosition: layout,
    };

    const updatedCharts = [...charts];
    if (editChartIndex !== null) {
      // 如果是編輯模式，更新已有圖表
      updatedCharts[editChartIndex] = newChart;
    } else {
      // 否則新增圖表
      updatedCharts.push(newChart);
    }

    setCharts(updatedCharts);
    setData([]);
    setChartName("");
    setIsModalOpen(false); // 保存後關閉彈窗
    setShowButton(false); // 保存後顯示按鈕
    setEditChartIndex(null); // 清除編輯索引
  };

  // 顏色變化
  const handleColorChange = (color, index) => {
    const newColors = [...chartColors];
    newColors[index] = color.hex;
    setChartColors(newColors);
  };

  // 渲染圖表
  const renderChart = (chart) => {
    const { type, data, colors } = chart;

    if (type === "area") {
      return (
        <AreaChart width={300} height={200} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="value"
            stroke={colors[0]}
            fill={colors[0]}
          />
        </AreaChart>
      );
    } else if (type === "pie") {
      return (
        <PieChart width={300} height={200}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
        </PieChart>
      );
    } else if (type === "stacked-bar") {
      return (
        <BarChart width={300} height={200} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" stackId="a" fill={colors[0]} />
          <Bar dataKey="value2" stackId="a" fill={colors[1]} />
        </BarChart>
      );
    } else if (type === "bar") {
      return (
        <BarChart width={300} height={200} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill={colors[0]} />
        </BarChart>
      );
    }
  };

  // 佈局變化
  const handleLayoutChange = (value) => {
    setLayout(value);
  };

  // 編輯已存在圖表
  const handleEditChart = (index) => {
    const chartToEdit = charts[index];
    setChartName(chartToEdit.name);
    setChartType(chartToEdit.type);
    setData(chartToEdit.data);
    setChartColors(chartToEdit.colors);
    setLayout(chartToEdit.layoutPosition);
    setEditChartIndex(index); // 設置要編輯的圖表索引
    setIsModalOpen(true);
    setShowButton(false); // 隱藏按鈕
  };

  return (
    <div className="chart-container">
      {/* <h1>{chartName || "Chart Generator"}</h1> */}

      {showButton && (
        <Button
          type="primary"
          onClick={() => {
            setIsModalOpen(true);
            // setShowButton(true); // 點擊按鈕後隱藏按鈕
          }}
        >
          創建圖表
        </Button>
      )}

      <div className="charts-display">
        {charts.map((chart, index) => (
          <div
            key={index}
            className={`chart-item layout-${chart.layoutPosition}`}
          >
            <h3>{chart.name}</h3>
            {renderChart(chart)}
            <Button
              onClick={() => handleEditChart(index)}
              type="link"
              style={{ marginTop: "10px" }}
            >
              編輯
            </Button>
          </div>
        ))}
      </div>

      {/* Modal for creating/editing charts */}
      <Modal
        title={editChartIndex !== null ? "編輯圖表" : "創建圖表"}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical">
          <Form.Item label="圖表名">
            <Input
              value={chartName}
              onChange={(e) => setChartName(e.target.value)}
            />
          </Form.Item>

          {/* Chart Type Selector */}
          <Form.Item label="圖表類型">
            <Select
              value={chartType}
              onChange={handleChartTypeChange}
              options={chartTypes.map((type) => ({
                label: type.label,
                value: type.value,
              }))}
            />
          </Form.Item>

          {/* Color Picker for chart */}
          <div>
            {chartColors.map((color, index) => (
              <div key={index}>
                <p>自定義調色 {index + 1}</p>
                <SketchPicker
                  color={color}
                  onChangeComplete={(color) => handleColorChange(color, index)}
                />
              </div>
            ))}
          </div>

          {/* Data Input Section */}
          <div>
            <Button onClick={handleAddData} type="dashed">
              添加數據
            </Button>
            {data.map((entry, index) => (
              <div key={index}>
                <Form.Item label="Data Name">
                  <Input
                    value={entry.name}
                    onChange={(e) => handleDataChange(e, index, "name")}
                  />
                </Form.Item>
                <Form.Item label="Data Value">
                  <Input
                    type="number"
                    value={entry.value}
                    onChange={(e) => handleDataChange(e, index, "value")}
                  />
                </Form.Item>
                {chartType === "stacked-bar" && (
                  <Form.Item label="Second Value">
                    <Input
                      type="number"
                      value={entry.value2 || ""}
                      onChange={(e) => handleDataChange(e, index, "value2")}
                    />
                  </Form.Item>
                )}
                <Button
                  type="danger"
                  onClick={() => handleRemoveData(index)}
                  icon="delete"
                >
                  移除
                </Button>
              </div>
            ))}
          </div>

          {/* Layout Selection */}
          <Form.Item label="Select Layout">
            <Select
              value={layout}
              onChange={handleLayoutChange}
              options={[
                { label: "2 Columns", value: "two" },
                { label: "3 Columns", value: "three" },
                { label: "4 Columns", value: "four" },
                { label: "6 Columns", value: "six" },
              ]}
            />
          </Form.Item>

          <Button type="primary" onClick={handleSaveChart}>
            保存圖表
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Chart;
