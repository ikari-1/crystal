import React, { useContext, useEffect, useState } from 'react'
import Header from '../../components/header/Header'
import Navigation from '../../components/navigation/Navigation'
import FAB from '../../components/buttons/FAB/FAB'
import { Link, useNavigate, useParams } from 'react-router-dom'
import styles from "./Profile.module.css"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import OutlinedButton from '../../components/buttons/outlinedButton/OutlinedButton'
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function Profile() {
  const { id } = useParams();
  const [ profileUser, setProfileUser ] = useState(null);
  const [ posts, setPosts ] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect (() => {
    axios.get(`/api/users/${id}/posts`)
    .then(res => {
      setProfileUser(res.data.user);
      setPosts(res.data.posts);
    })
    .catch(err => {
      console.error(err);
    });
  }, [id]);

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

  return (
    <>
      <Header />
      <main>
        <Navigation />
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.userInfo}>
              <div className={styles.userIcon}>
                {profileUser?.profilePicture ? (
                  <img
                    src={(typeof profileUser?.profilePicture === 'string' ? profileUser?.profilePicture : URL.createObjectURL(user?.profilePicture))}
                    alt=""
                    className={styles.profileImg}
                  />
                ) : (
                  <AccountCircleIcon sx={{width: "100%", height: "100%"}} />
                )}
              </div>
              <div className={styles.userDesc}>
                <span className={styles.userName}>{profileUser?.username}</span>
                <div className={styles.follows}>
                  <span>おきにユーザー</span>
                  <span>100</span>
                  <span>おきに投稿</span>
                  <span>50</span>
                </div>
              </div>
            </div>
            <p className={styles.introduce}>{profileUser?.profileText}</p>
            <div className={styles.editBtn}>
              {user?._id === profileUser?._id && (
                <Link to={`/profile/${profileUser._id}/edit`}>
                  <OutlinedButton text="編集" />
                </Link>
              )}
            </div>
          </div>
          <div className={styles.lists}>
            <ul className={styles.list}>
              {posts?.length === 0 ? (
                <p>No Posts yeah!</p>
              ) : (
                posts?.map((post) => (
                <li className={styles.item} key={post._id} onClick={() => navigate(`/posts/${post._id}`)}>
                  <span className={styles.postDate}>
                    {(() => {
                      const date = new Date(post.updatedAt);
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2,"0");
                      const day = String(date.getDate()).padStart(2, "0");
                      return `${year}-${month}/${day}`;
                    })()}
                  </span>
                  <h3 className={styles.postTtl}>{post.title}</h3>
                  <div className={styles.favorite}>
                    <div className={styles.favoriteIcon} onClick={(e) => { e.stopPropagation(); handleLike(post._id);}}>
                      {user && post.likes.includes(user._id)
                      ? <FavoriteIcon style={{ color: "red" }} />
                      : <FavoriteBorderIcon /> }
                    </div>
                    <span className={styles.likes}>{post.likes.length}</span> 
                  </div>
                </li>
              )))}
            </ul>
          </div>
        </div>
        <Link to="/createPost">
          <FAB />
        </Link>
      </main>
    </>
  )
}
