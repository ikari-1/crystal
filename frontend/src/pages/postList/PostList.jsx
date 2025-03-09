import React from 'react';
import "./PostList.css";

export default function PostList() {
  return (
    <div className="postListWrapper">
      <header className="postListHeader">
        <h2 className="appTitle">Crystal</h2>
        <p className="userName">ユーザー名</p>
      </header>
      <main className="postListMain">
        <div className="postListLeft">
          <button className="newPostBtn">新規投稿</button>
        </div>
        <div className="postListCenter">
          <div className="post">
            <div className="postData">
              <span className="createdUserName">投稿者のユーザーネーム</span>
              <span className="updatedAt">投稿日or更新日</span>
            </div>
            <h3 className="postTitle">タイトル</h3>
          </div>
          <div className="post">
            <div className="postData">
              <span className="createdUserName">投稿者のユーザーネーム</span>
              <span className="updatedAt">投稿日or更新日</span>
            </div>
            <h3 className="postTitle">タイトル</h3>
          </div>
          <div className="post">
            <div className="postData">
              <span className="createdUserName">投稿者のユーザーネーム</span>
              <span className="updatedAt">投稿日or更新日</span>
            </div>
            <h3 className="postTitle">タイトル</h3>
          </div>
          <div className="post">
            <div className="postData">
              <span className="createdUserName">投稿者のユーザーネーム</span>
              <span className="updatedAt">投稿日or更新日</span>
            </div>
            <h3 className="postTitle">タイトル</h3>
          </div>
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
    </div>
  )
}
