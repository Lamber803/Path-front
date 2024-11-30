import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const { register, handleSubmit } = useForm();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleVideoUrlChange = (e) => {
    setVideoUrl(e.target.value);
  };

  const onSubmitText = async () => {
    try {
      const response = await axios.post("/api/upload/text", { text });
      alert(response.data.message);
    } catch (error) {
      alert("Error uploading text");
    }
  };

  const onSubmitFile = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/upload/file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(response.data.message);
    } catch (error) {
      alert("Error uploading file");
    }
  };

  const onSubmitVideo = async () => {
    try {
      const response = await axios.post("/api/upload/video", { videoUrl });
      alert(response.data.message);
    } catch (error) {
      alert("Error uploading video URL");
    }
  };

  return (
    <div>
      <h2>Upload Text</h2>
      <form onSubmit={handleSubmit(onSubmitText)}>
        <textarea
          value={text}
          onChange={handleTextChange}
          {...register("text", { required: true })}
          placeholder="Enter your text (max 10,000 characters)"
          rows="10"
          cols="50"
        />
        <button type="submit">Upload Text</button>
      </form>

      <h2>Upload File</h2>
      <form onSubmit={handleSubmit(onSubmitFile)}>
        <input type="file" onChange={handleFileChange} {...register("file")} />
        <button type="submit">Upload File</button>
      </form>

      <h2>Upload Video URL</h2>
      <form onSubmit={handleSubmit(onSubmitVideo)}>
        <input
          type="text"
          value={videoUrl}
          onChange={handleVideoUrlChange}
          {...register("videoUrl", { required: true })}
          placeholder="Enter video URL"
        />
        <button type="submit">Upload Video URL</button>
      </form>
    </div>
  );
};

export default UploadForm;
