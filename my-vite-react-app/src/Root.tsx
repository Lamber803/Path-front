import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

const Root: React.FC = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default Root;
