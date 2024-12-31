import axios from "axios";

export const createDocument = async (
  userId: number,
  title: string,
  htmlContent: string,
  groupId: number,
  fileList: any[] = []
) => {
  const formData = new FormData();

  // 1. 添加 createDocumentDTO 为 JSON 字符串
  formData.append(
    "createDocumentDTO",
    JSON.stringify({
      title,
      htmlContent,
      groupId,
    })
  );

  // 2. 如果有文件，添加文件到 formData
  if (fileList.length > 0) {
    fileList.forEach((file) => {
      formData.append("files", file);
    });
  }

  try {
    const response = await axios.post(
      `http://localhost:8080/api/documents/create?userId=${userId}`,
      formData, // 发送 multipart/form-data 请求
      {
        headers: {
          "Content-Type": "multipart/form-data", // 设置为 multipart/form-data
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );
    console.log("文檔創建成功", response.data);
    return response.data; // 返回响应的数据
  } catch (error) {
    console.error("提交文檔失敗", error);
    throw error;
  }
};
