// src/api/document.ts
import axios from "axios";

export const createDocument = async (
  userId: number,
  title: string,
  editorContent: string,
  fileList: any[]
) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("htmlContent", editorContent);

  fileList.forEach((file) => {
    formData.append("files", file.originFileObj);
  });

  try {
    const response = await axios.post(
      `http://localhost:8080/api/documents/create?userId=${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );
    return response.data; // 返回後端響應數據
  } catch (error) {
    throw new Error("提交文檔失敗，請稍後再試！");
  }
};
