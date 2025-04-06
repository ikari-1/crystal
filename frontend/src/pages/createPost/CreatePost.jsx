import React from 'react'
import Header from '../../components/header/Header'
import Leftbar from '../../components/leftbar/Leftbar'
import Rightbar from '../../components/rightbar/Rightbar'
import { Link, useNavigate } from 'react-router-dom'
import styles from './CreatePost.module.css'
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

  const navigate = useNavigate();
  const handleCancel = () => {
    navigate(-1);
  }

  return (
    <>
      <Header />
      <main>
        <Leftbar />
        <div className={styles.center}>
          <h2>新規投稿</h2>
          <form onSubmit={handleSubmit} className={styles.createPostForm}>
            <p className={styles.createPostTitle}>タイトル</p>
            <input type="text" value={title} onChange={handleTitleChange} className={styles.titleInput} />
            <p className={styles.createPostContent}>投稿内容</p>
            <input type="text" value={content} onChange={handleContentChange} className={styles.contentInput} />
            <div className={styles.imageWrapper}>
              {images.map((file, index) => (
                <img key={index} src={URL.createObjectURL(file)} alt={`画像${index + 1}`} className={styles.img} />
              ))}
            </div>
            <div className={styles.buttons}>
              <input type="file" multiple onChange={handleFileChange} className={styles.btn} />
              <button onClick={handleCancel} className={styles.btn}>キャンセル</button>
              <button type='submit' className={styles.btn}>投稿</button>
            </div>
          </form>
        </div>
        <Rightbar>
          <Link to="/postList">
            <button className={styles.rightbarBtn}>投稿一覧</button>
          </Link>
        </Rightbar>
      </main>
    </>
  )
}
