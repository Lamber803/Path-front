import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface TinyMCEEditorProps {
  value: string;
  onChange: (newValue: string) => void;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({ value, onChange }) => {
  const [files, setFiles] = useState<
    { file: File; blobUrl: string; fileType: string }[]
  >([]); // 存储上传的文件及其 Blob URL

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

      // 临时保存文件和 Blob URL
      setFiles((prevFiles) => [
        ...prevFiles,
        { file, blobUrl: fileUrl, fileType: meta.filetype },
      ]);

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

  // 提交前处理文件 URL
  const handleEditorSubmit = async () => {
    let contentWithPlaceholder = value;
    const formData = new FormData();

    // 在提交前上传文件并替换占位符URL
    const uploadPromises = files.map(async ({ file, blobUrl, fileType }) => {
      formData.append("files", file);
      try {
        const response = await fetch("/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const serverUrl = data.fileUrls[0]; // 后端返回的真实 URL

          // 替换编辑器中的 Blob URL 为真实的服务器 URL
          contentWithPlaceholder = contentWithPlaceholder.replace(
            blobUrl,
            serverUrl
          );
        }
      } catch (error) {
        console.error("上传失败", error);
      }
    });

    await Promise.all(uploadPromises);

    // 提交编辑器内容（含替换后的文件 URL）
    try {
      const submitResponse = await fetch("/submit-content", {
        method: "POST",
        body: JSON.stringify({ content: contentWithPlaceholder }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (submitResponse.ok) {
        alert("内容提交成功！");
      } else {
        alert("内容提交失败！");
      }
    } catch (error) {
      console.error("提交失败", error);
      alert("提交失败！");
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
    </div>
  );
};

export default TinyMCEEditor;
