import React, { useEffect, useState } from 'react';
import styles from "./PostList.module.css";
import axios from "axios";
import Header from "../../components/header/Header";
import Leftbar from "../../components/leftbar/Leftbar"
import Rightbar from "../../components/rightbar/Rightbar"

export default function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("api/posts/all");
        setPosts(response.data);
      } catch (error) {
        console.error("エラー", error);
      }
    }
    fetchPosts();
  },[]);

  return (
    <>
      <Header />
      <main className={styles.postListMain}>
        <Leftbar>
          <a href='/createPost'>
            <button className={styles.newPostBtn}>新規投稿</button>
          </a>
        </Leftbar>
        <div className="postListCenter">
          <ul>
            {posts.map((post) => (
              <li className={styles.post} key={post._id}>
                <div className={styles.postData}>
                  <span className={styles.createdUserName}>投稿者のユーザーネーム</span>
                  <span className={styles.updatedAt}>{post.updatedAt}</span>
                </div>
                <h3 className={styles.postTitle}>{post.title}</h3>
              </li>
            ))}
          </ul>
        </div>
        <Rightbar />
      </main>
    </>
  )
}
