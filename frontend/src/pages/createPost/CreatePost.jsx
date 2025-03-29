import React from 'react'
import Header from '../../components/header/Header'
import Leftbar from '../../components/leftbar/Leftbar'
import Rightbar from '../../components/rightbar/Rightbar'
import { Link } from 'react-router-dom'
import './CreatePost.css'
import { useState } from "react"

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleContentChange = (e) => setContent(e.target.value);
  const handleFileChange = (e) => {
    const selectedFiles = Array.form(e.target.files);
    if (selectedFiles.length + images.length > 4) {
      alert("画像は４枚まで投稿できます");
      return;
    }
    setImages([...images, ...selectedFiles]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      alert("タイトルは記入してください");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    images.forEach((file) => formData.append("images", file));

    try {
      const res = await fetch("http://localhost:3001/api/posts/", {
        method: "post",
        body: formData,
      });

      const data = await res.json();
      alert(data.message);
    } catch (error) {
      console.error("エラー：", error);
      alert("投稿できませんでした");
    }
  };

  return (
    <>
      <Header />
      <main>
        <Leftbar />
        <div className="center">
          <h2>新規投稿</h2>
          <form onSubmit={handleSubmit} className="createPostForm">
            <p className="createPostTitle">タイトル</p>
            <input type="text" value={title} onChange={handleTitleChange} className="titleInput" />
            <p className="createPostContent">投稿内容</p>
            <input type="text" value={content} onChange={handleContentChange} className="contentInput" />
            <div className="imageWrapper">
              {images.map((file, index) => (
                <img key={index} src={URL.createObjectURL(file)} alt={`画像${index + 1}`} className="img" />
              ))}
            </div>
            <div className="buttons">
              <input type="file" multiple onChange={handleFileChange} className="btn" />
              <button type='reset' className="btn">キャンセル</button>
              <button type='submit' className="btn">投稿</button>
            </div>
          </form>
        </div>
        <Rightbar>
          <Link to="/postList">
            <button className="rightbarBtn">投稿一覧</button>
          </Link>
        </Rightbar>
      </main>
    </>
  )
}
