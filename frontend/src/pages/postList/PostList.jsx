import React, { useEffect, useState } from 'react';
import "./PostList.css";
import axios from "axios";

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
      <header className="postListHeader">
        <h2 className="appTitle">Crystal</h2>
        <p className="userName">ユーザー名</p>
      </header>
      <main className="postListMain">
        <div className="postListLeft">
          <button className="newPostBtn">新規投稿</button>
        </div>

        <div className="postListCenter">
          <ul>
            {posts.map((post) => (
              <li className="post" key={post._id}>
                <div className="postData">
                  <span className="createdUserName">投稿者のユーザーネーム</span>
                  <span className="updatedAt">{post.updatedAt}</span>
                </div>
                <h3 className="postTitle">{post.title}</h3>
              </li>
            ))}
          </ul>

          <ul className="pageCounter">
            <li className="pageCount">＜</li>
            <li className="pageCount currentPage">1</li>
            <li className="pageCount">2</li>
            <li className="pageCount">3</li>
            <li className="pageCount">4</li>
            <li className="pageCount">＞</li>
          </ul>
        </div>
        <div className="postListRight">
          <button className="logoutBtn">ログアウト</button>
        </div>
      </main>
    </>
  )
}
