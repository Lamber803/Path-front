// TinyMCEEditor.tsx
import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

// 定义 TinyMCEEditor 组件的 Props 类型
interface TinyMCEEditorProps {
  value: string;
  onChange: (newValue: string) => void;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({ value, onChange }) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <Editor
        apiKey="fjnm5g2otneaagwyv2ar146jny63sai9ft966tr14yt3gcyc" // TinyMCE API Key
        value={value}
        onEditorChange={(newValue) => onChange(newValue)} // 更新编辑器内容
        init={{
          height: 400,
          menubar: true,
          language: "zh_TW",
          plugins: [
            "advlist",
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
            "undo redo | bold italic | alignleft aligncenter alignright | fontselect fontsizeselect | link image | table | code",
          image_advtab: true, // 启用图片的更多选项
          extraPlugins: [], // 自定义上传适配器插件（如有）
          file_picker_types: "image", // 允许选择图片文件
          file_picker_callback: (callback: any, value: any, meta: any) => {
            // 打开文件选择框
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = async () => {
              const file = input.files![0];
              const formData = new FormData();
              formData.append("file", file);

              // 不上传到后端，直接插入本地 URL
              const imageUrl = URL.createObjectURL(file); // 创建本地的临时 URL
              callback(imageUrl); // 直接插入图片 URL
            };
            input.click();
          },
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
          },
        }}
      />
    </div>
  );
};

export default TinyMCEEditor;
