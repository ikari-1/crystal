import React from 'react'
import Header from '../../components/header/Header'
import Leftbar from '../../components/leftbar/Leftbar'
import Rightbar from '../../components/rightbar/Rightbar'
import { Link, useNavigate } from 'react-router-dom'
import styles from './CreatePost.module.css'
import { useState, useRef, useContext } from "react"
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.click();
  }

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleContentChange = (e) => setContent(e.target.value);
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
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
    formData.append("userId", user._id);
    formData.append("title", title);
    formData.append("content", content);
    images.forEach((file) => formData.append("images", file));

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/posts`, formData, {
        hesders: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/postList");
      alert(res.data.message || "投稿しました");
    } catch (error) {
      console.error("エラー：", error);
      alert("投稿できませんでした");
    }
  };

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
          <form onSubmit={handleSubmit} className={styles.createPostForm} id="postForm">
            <p className={styles.createPostTitle}>タイトル</p>
            <input type="text" value={title} onChange={handleTitleChange} className={styles.titleInput} />
            <p className={styles.createPostContent}>投稿内容</p>
            <input type="text" value={content} onChange={handleContentChange} className={styles.contentInput} />
            <div className={styles.imageWrapper}>
              {images.map((file, index) => (
                <img key={index} src={URL.createObjectURL(file)} alt={`画像${index + 1}`} className={styles.img} />
              ))}
            </div>
          </form>
          <div className={styles.buttons}>
            <div className={styles.postBtns}>
              <button type='submit' form="postForm" className={styles.btn}>投稿</button>
              <button type="button" onClick={handleClick} className={styles.btn}>ファイル選択</button>
              <input type="file" multiple onChange={handleFileChange} ref={inputRef} style={{ display: 'none' }}/>
            </div>
            <button onClick={handleCancel} className={`${styles.btn} ${styles.cancel}`}>キャンセル</button>
          </div>
        </div>
        <Rightbar>
          <Link to="/postList" className={styles.btn}>
              投稿一覧
          </Link>
        </Rightbar>
      </main>
    </>
  )
}
