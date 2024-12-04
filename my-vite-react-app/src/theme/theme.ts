// src/theme/theme.ts
import { createTheme } from "@mui/material/styles";
import { fontFamily } from "./typography"; // 引入自定义字体

const theme = createTheme({
  typography: {
    fontFamily,
    h1: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: 600,
    },
    // 可以根据需要继续定制
  },
});

export default theme;
