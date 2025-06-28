import React, { useEffect } from 'react'
import Header from '../../components/header/Header'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './PostEdit.module.css'
import { useState, useRef, useContext } from "react"
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import TextButton from '../../components/buttons/textButton/TextButton'
import FilledButton from '../../components/buttons/filledButton/FilledButton'
import Navigation from '../../components/navigation/Navigation'
import TonalButton from '../../components/buttons/tonalButton/TonalButton'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export default function PostEdit() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const inputRef = useRef(null);
  const [ profilePicture, setProfilePicture ] = useState("")

  useEffect(() => { 
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/posts/${id}`);
        setTitle(res.data.title || "");
        setContent(res.data.content || "");
        setImages(Array.isArray(res.data.images) ? res.data.images : []);
        setProfilePicture(res.data.profilePicture || "")
      } catch(err) {
        console.error("なんかエラー出たわ：", err);
      }
    };
    fetchPost();
  }, [id]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const existingImgs = images.filter(img => typeof img === "string");
    const newImgs = images.filter(img => typeof img !== "string");

    const totalCount = existingImgs.length + newImgs.length + selectedFiles.length;

    if (totalCount  > 4) {
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
    const existingImgs = images.filter(img => typeof img === "string");
    const newImgs = images.filter(img => typeof img !== "string");

    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("title", title);
    formData.append("content", content);
    existingImgs.forEach((imgPath) => {
      formData.append("keepImages", imgPath);
    });
    newImgs.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/posts/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/postList");
      alert(res.data.message || "投稿を更新しました");
    } catch (error) {
      console.error("エラー：", error);
      alert("投稿を更新できませんでした");
    }
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <Navigation />
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.userInfo}>
              <div className={styles.userIcon}>
                {profilePicture ? (
                  <img
                    src={(typeof profilePicture === 'string' ? profilePicture : URL.createObjectURL(profilePicture))}
                    alt=""
                    className={styles.profileImg}
                  />
                ) : (
                  <AccountCircleIcon sx={{width: "100%", height: "100%"}} />
                )}
              </div>
              <span>{user.username}</span>
            </div>
            <form onSubmit={handleSubmit} className={styles.createPostForm} id="postForm">
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={styles.titleInput} placeholder="タイトル" />
              <textarea type="text" value={content} onChange={(e) => setContent(e.target.value)} className={styles.contentInput} placeholder="投稿内容" />
              <div className={styles.imgs}>
                {Array.isArray(images) && images.map((file, index) => {
                  const src = typeof file === "string" ? file : URL.createObjectURL(file);
                  return (
                    <div className={styles.imgWrap}>
                      <img src={src} alt={`画像${index + 1}`} className={styles.img}/>
                      <button type="button" onClick={() => {setImages(images.filter((_, i) => i !== index ))}} className={styles.delBtn}>
                        <CancelIcon />
                      </button>
                    </div>
                  )
                })}
              </div>
            </form>
            <div className={styles.buttons}>
              <TextButton text="キャンセル" onClick={() => navigate(-1)} />
              <div className={styles.postBtns}>
                <TonalButton type="button" onClick={() => inputRef.current.click()} text="ファイル選択" />
                <input type="file" multiple onChange={handleFileChange} ref={inputRef} style={{ display: 'none' }}/>
                <FilledButton form="postForm" type="submit" text="更新" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
