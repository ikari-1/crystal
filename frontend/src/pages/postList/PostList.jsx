import React, { useEffect, useState } from 'react';
import "./PostList.css";
import axios from "axios";
import Header from "../../components/header/Header"
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
      <main className="postListMain">
        <Leftbar />
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
        </div>
        <Rightbar />
      </main>
    </>
  )
}
