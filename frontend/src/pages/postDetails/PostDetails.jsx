import React, { useContext, useEffect, useState } from 'react'
import Header from '../../components/header/Header'
import Navigation from '../../components/navigation/Navigation'
import styles from "./PostDetails.module.css"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TextButton from '../../components/buttons/textButton/TextButton';
import OutlinedButton from '../../components/buttons/outlinedButton/OutlinedButton';
import FilledButton from '../../components/buttons/filledButton/FilledButton';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { AuthContext } from '../../context/AuthContext';

export default function PostDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ post, setPost ] = useState();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/posts/${id}`);
        setPost(res.data);
      } catch(err) {
        console.error("なんかエラー出たわ：", err);
      }
    };
    fetchPost();
  }, [id]);

  // 投稿削除ハンドラ
  const handleDelete = async () => {
    if (!window.confirm('本当にこの投稿を削除しますか？')) {
      return;
    }

    try {
      await axios.delete(`/api/posts/${id}`, {
        data: { userId: user._id }  // DELETE リクエストの場合、dataオブジェクトとして送信(axiosの仕様。これがないとデータが送信されないバグに悩む可能性が出てくる)
      });

      alert('投稿が削除されました');
      navigate('/postList');
    } catch (err) {
      console.error('削除エラー:', err);
      let errorMessage = '投稿の削除に失敗しました。';

      if (err.response && err.response.data) {
        errorMessage += ` ${err.response.data}`;
      }

      alert(errorMessage);
    }
  };

  return (
    <>
      <Header />
      <main>
        <Navigation />
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.userInfo}>
              <div className={styles.userIcon} onClick={(e) => { e.stopPropagation(); navigate(`/profile/${post.userId}`)}}>
                {post?.profilePicture ? (
                  <img
                    src={(typeof post?.profilePicture === 'string' ? post?.profilePicture : URL.createObjectURL(user?.profilePicture))}
                    alt=""
                    className={styles.profileImg}
                  />
                ) : (
                  <AccountCircleIcon sx={{width: "100%", height: "100%"}} />
                )}
              </div>
              <span className={styles.username} onClick={(e) => { e.stopPropagation(); navigate(`/profile/${post.userId}`)}}>{post?.username}</span>
              <span>
                {(() => {
                  const date = new Date(post?.updatedAt);
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2,"0");
                  const day = String(date.getDate()).padStart(2, "0");
                  return `${year}-${month}/${day}`;
                })()}
              </span>
            </div>
            <h1 className={styles.title}>{post?.title}</h1>
            <p className={styles.content}>{post?.content}</p>
            <div className={styles.imgs}>
              {post?.images?.map((imgPath, index) => (
                <img
                  key={index}
                  src={imgPath}
                  alt={`投稿画像${index + 1}`}
                  className={styles.img}
                />
              ))}
            </div>
            <div className={styles.btns}>
              <OutlinedButton text="戻る" onClick={() => navigate(-1)}/>
              { user?._id === post?.userId ? (
                <div className={styles.actionBtns}>
                  <TextButton text="削除" onClick={handleDelete}/>
                  <FilledButton text="編集" onClick={() => navigate(`/posts/${id}/edit`)}/>
                </div>
              ) : ""}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
