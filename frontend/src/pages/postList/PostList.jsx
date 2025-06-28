import React, { useEffect, useState, useContext } from "react";
import styles from "./PostList.module.css";
import axios from "axios";
import Header from "../../components/header/Header";
import { Link, useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { AuthContext } from "../../context/AuthContext";
import { SearchContext } from "../../context/SearchContext";
import FAB from "../../components/buttons/FAB/FAB";
import Navigation from "../../components/navigation/Navigation";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { result, query } = useContext(SearchContext);

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

  const displayPosts = query ? result : posts;

  return (
    <>
      <Header />
      <main className={styles.main}>
        <Navigation />
        <div className={styles.postListCenter}>
          <ul>
            {Array.isArray(posts) && displayPosts.map((post) => (
              <li className={styles.post} key={post._id} onClick={() => navigate(`/posts/${post._id}`)}>
                <div className={styles.postHeader}>
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
                  <div className={styles.postData}>
                    <span className={styles.createdUserName} onClick={(e) => { e.stopPropagation(); navigate(`/profile/${post.userId}`)}}>
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
                </div>
                <h3 className={styles.title}>{post.title}</h3>
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
        <Link to="/createPost">
          <FAB />
        </Link>
      </main>
    </>
  );
}
