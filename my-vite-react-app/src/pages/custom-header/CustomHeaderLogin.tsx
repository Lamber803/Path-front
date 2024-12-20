// CustomHeader.tsx
import React from "react";
import { Layout, Menu, Button } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";

const { Header } = Layout;

// 使用 styled-components 定義樣式
const StyledHeader = styled(Header)<{ bgColor?: string }>`
  background: ${(props) => props.bgColor || "#f5e4d8"}; /* 設定背景顏色 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const StyledButton = styled(Button)`
  background-color: #b86159; /* 註冊按鈕顏色 */
  border-color: #b86159; /* 註冊按鈕邊框顏色 */
  color: #fff;

  &:hover {
    background-color: #85312b !important; /* Hover時的顏色 */
    border-color: #85312b !important;
  }
`;
const StyledMenuItem = styled(Menu.Item)<{
  menuColor?: { frontColor: string; hoverColor: string };
}>`
  .ant-menu-title-content {
    color: ${(props) =>
      props.menuColor?.frontColor || "#923c3c"}; /* 設置標題顏色 */
  }

  &:hover .ant-menu-title-content {
    color: ${(props) =>
      props.menuColor?.hoverColor || "#6f6262"}; /* hover 時顏色變化 */
  }
`;
// StyledLoginButton 用來設置登入按鈕的顏色，並使用 menuColor 對象中的 frontColor
const StyledLoginButton = styled(Button)<{
  menuColor?: { frontColor: string; hoverColor: string };
}>`
  color: ${(props) =>
    props.menuColor?.frontColor || "#000"}; /* 使用 menuColor 中的 frontColor */

  &:hover {
    color: ${(props) =>
      props.menuColor?.hoverColor ||
      "#000"}; /* hover 顏色也使用 menuColor.hoverColor */
  }
`;

const CustomHeader: React.FC<{
  bgColor?: string;
  menuColor?: { frontColor: string; hoverColor: string };
}> = ({ bgColor, menuColor }) => {
  return (
    <StyledHeader bgColor={bgColor}>
      <div
        style={{
          fontSize: 24,
          paddingLeft: 10,
          paddingRight: 10,
          color: "#fff",
        }}
      >
        🅱
      </div>

      {/* 導航選單 */}
      <Menu
        mode="horizontal"
        theme="light"
        style={{ flex: 1, background: "transparent" }}
      >
        <StyledMenuItem key="menu" menuColor={menuColor}>
          <Link to="/">介紹</Link>
        </StyledMenuItem>
        {/* <StyledMenuItem key="calender" menuColor={menuColor}>
          <Link to="/calender">行事曆</Link>
        </StyledMenuItem>
        <StyledMenuItem key="clock" menuColor={menuColor}>
          <Link to="/clock">蕃茄鐘</Link>
        </StyledMenuItem>
        <StyledMenuItem key="search" menuColor={menuColor}>
          <Link to="/search">筆記管理</Link>
        </StyledMenuItem>
        <StyledMenuItem key="card" menuColor={menuColor}>
          <Link to="/card">字卡學習</Link>
        </StyledMenuItem>
        <StyledMenuItem key="char" menuColor={menuColor}>
          <Link to="/char">任務進度</Link>
        </StyledMenuItem> */}
      </Menu>

      {/* 登入/註冊按鈕 */}
      <div>
        <StyledLoginButton type="text" menuColor={menuColor}>
          <Link to="/login">登入</Link>
        </StyledLoginButton>
        <StyledButton>
          <Link to="/register" style={{ color: "#fff" }}>
            註冊
          </Link>
        </StyledButton>
      </div>
    </StyledHeader>
  );
};

export default CustomHeader;
