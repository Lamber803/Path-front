import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 当子组件抛出错误时更新 state
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // 可以将错误信息记录到外部错误报告服务
    console.error("捕获到错误:", error, info);
  }

  render() {
    if (this.state.hasError) {
      // 错误时显示备用 UI
      return <h1>出错了！</h1>;
    }

    // 正常渲染子组件
    return this.props.children;
  }
}

export default ErrorBoundary;
