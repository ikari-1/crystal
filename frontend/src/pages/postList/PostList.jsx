import React, { useEffect, useState, useContext } from "react";
import styles from "./PostList.module.css";
import axios from "axios";
import Header from "../../components/header/Header";
import Leftbar from "../../components/leftbar/Leftbar";
import Rightbar from "../../components/rightbar/Rightbar";
import { Link, useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { AuthContext } from "../../context/AuthContext";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleLike = async (postId) => {
    try {
      const res = await axios.put(`/api/posts/${postId}/like`, { userId: user._id });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: res.data.likes } : post
        )
      );
    } catch (error) {
      console.error("いいねできませんでした", error);
    }
  };

  console.log(user);
  console.log(posts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("api/posts/all");
        setPosts(response.data);
      } catch (error) {
        console.error("エラー", error);
      }
    };
    fetchPosts();
  }, []);


  return (
    <>
      <Header />
      <main className={styles.postListMain}>
        <Leftbar />
        <div className={styles.postListCenter}>
          <ul>
            {posts.map((post) => (
              <li className={styles.post} key={post._id} onClick={() => navigate(`/post/${post._id}`)}>
                <div className={styles.postData}>
                  <span className={styles.createdUserName}>
                    {post.username}
                  </span>
                  <span className={styles.updatedAt}>
                    {(() => {
                      const date = new Date(post.updatedAt);
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2,"0");
                      const day = String(date.getDate()).padStart(2, "0");
                      return `${year}-${month}/${day}`;
                    })()}
                  </span>
                </div>
                <h3 className={styles.postTitle}>{post.title}</h3>
                <div className={styles.favorite}>
                  <div className={styles.favoriteIcon} onClick={(e) => { e.stopPropagation(); handleLike(post._id);}}>
                    {user && post.likes.includes(user._id)
                    ? <FavoriteIcon style={{ color: "red" }} />
                    : <FavoriteBorderIcon /> }
                  </div>
                  <span className={styles.likesLength}>{post.likes.length}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <Rightbar>
          <Link to="/createPost" className={styles.btn}>
            新規投稿
          </Link>
        </Rightbar>
      </main>
    </>
  );
}
