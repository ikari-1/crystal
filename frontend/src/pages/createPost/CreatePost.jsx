import React from 'react'
import Header from '../../components/header/Header'
import { useNavigate } from 'react-router-dom'
import styles from './CreatePost.module.css'
import { useState, useRef, useContext } from "react"
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import OutlinedButton from '../../components/buttons/outlinedButton/OutlinedButton'
import FilledButton from '../../components/buttons/filledButton/FilledButton'
import Navigation from '../../components/navigation/Navigation'
import TonalButton from '../../components/buttons/tonalButton/TonalButton'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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
      <main className={styles.main}>
        <Navigation />
        <div className={styles.center}>
          <div className={styles.card}>
            <div className={styles.userInfo}>
              <AccountCircleIcon/>
              <span>{user.username}</span>
            </div>
            <form onSubmit={handleSubmit} className={styles.createPostForm} id="postForm">
              <input type="text" value={title} onChange={handleTitleChange} className={styles.titleInput} placeholder="タイトル" />
              <textarea type="text" value={content} onChange={handleContentChange} className={styles.contentInput} placeholder="投稿内容" />
              <div className={styles.imageWrapper}>
                {images.map((file, index) => (
                  <img key={index} src={URL.createObjectURL(file)} alt={`画像${index + 1}`} className={styles.img} />
                ))}
              </div>
            </form>
            <div className={styles.buttons}>
              <OutlinedButton text="キャンセル" onClick={handleCancel} />
              <div className={styles.postBtns}>
                <TonalButton type="button" onClick={handleClick} text="ファイル選択" />
                <input type="file" multiple onChange={handleFileChange} ref={inputRef} style={{ display: 'none' }}/>
                <FilledButton form="postForm" type="submit" text="投稿" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
