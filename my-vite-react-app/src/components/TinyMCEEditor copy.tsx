import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface TinyMCEEditorProps {
  value: string;
  onChange: (newValue: string) => void;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({ value, onChange }) => {
  const [files, setFiles] = useState<File[]>([]); // 存储上传的文件

  // 处理文件选择
  const filePickerCallback = async (callback: any, value: any, meta: any) => {
    const input = document.createElement("input");
    input.type = "file";

    if (meta.filetype === "image") {
      input.accept = "image/*"; // 图片文件
    } else if (meta.filetype === "file") {
      // 允许选择 PDF、Word（.docx）、Excel（.xlsx）、PowerPoint（.ppt、.pptx）等文件
      input.accept = ".pdf,.docx,.xlsx,.ppt,.pptx,.txt";
    }

    input.onchange = async () => {
      const file = input.files![0];
      const fileUrl = URL.createObjectURL(file); // 创建 Blob URL

      // 临时保存文件
      setFiles((prevFiles) => [...prevFiles, file]);

      // 插入临时文件 URL
      if (meta.filetype === "image") {
        callback(fileUrl); // 插入图片
      } else if (meta.filetype === "file") {
        const fileLink = `<a href="${fileUrl}" target="_blank">点击下载文件: ${file.name}</a>`;
        callback(fileLink); // 插入文件链接
      }
    };
    input.click();
  };

  // 处理提交文件
  const handleSubmit = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    // 上传文件到服务器
    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert("文件上传成功：" + data.fileUrls.join(", "));
      } else {
        alert("文件上传失败");
      }
    } catch (error) {
      console.error("文件上传失败:", error);
      alert("文件上传失败");
    }
  };

  return (
    <div style={{ marginBottom: "0px" }}>
      <Editor
        apiKey="fjnm5g2otneaagwyv2ar146jny63sai9ft966tr14yt3gcyc"
        value={value}
        onEditorChange={(newValue) => onChange(newValue)} // 更新编辑器内容
        init={{
          height: 600,
          menubar: true,
          language: "zh_TW",
          plugins: [
            "advlist",
            "anchor",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "table",
            "fontselect",
            "fontsizeselect",
          ],
          toolbar:
            "undo redo | bold italic | alignleft aligncenter alignright | fontselect fontsizeselect | link image | table | code | insertfile | anchor | bullist numlist", // 添加 anchor 和 lists 插件
          image_advtab: true,
          file_picker_types: "image, file", // 允许选择图片和文件
          file_picker_callback: filePickerCallback, // 上传文件时调用的回调
          i18n: {
            Bold: "加粗",
            Italic: "斜体",
            Undo: "撤销",
            Redo: "重做",
            "Align left": "左对齐",
            "Align center": "居中对齐",
            "Align right": "右对齐",
            Link: "插入链接",
            Image: "插入图片",
            Code: "查看代码",
            Table: "插入表格",
            Font: "字体",
            "Font size": "字体大小",
            "Insert file": "插入文件",
            Anchor: "插入锚点",
            "Insert list": "插入列表",
          },
        }}
      />
      {/* <button onClick={handleSubmit}>提交文件</button> */}
    </div>
  );
};

export default TinyMCEEditor;