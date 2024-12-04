// src/utils/MyUploadAdapterPlugin.ts
import axios from "axios";

class MyUploadAdapter {
  loader: any;

  constructor(loader: any) {
    this.loader = loader;
  }

  upload() {
    return new Promise((resolve, reject) => {
      const file = this.loader.file;
      const formData = new FormData();
      formData.append("file", file);

      // 假设上传到服务器并返回图片 URL
      axios
        .post("http://localhost:8080/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        })
        .then((response) => {
          // 假设服务器返回图片 URL
          const imageUrl = response.data.imageUrl;
          resolve({ default: imageUrl }); // 返回图片 URL，TinyMCE 会使用这个 URL 插入图片
        })
        .catch((error) => {
          console.error("文件上传失败:", error);
          reject("上传失败");
        });
    });
  }
}

// 注册上传适配器插件
export default function MyUploadAdapterPlugin(editor: any) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
    return new MyUploadAdapter(loader);
  };
}
