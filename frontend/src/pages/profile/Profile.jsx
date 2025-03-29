import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import styles from './Profile.module.css';

export default function Profile() {
  const { username } = useParams();
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);

  //編集用の状態
  const [displayName, setDisplayName] = useState('');
  const [profileText, setProfileText] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      setLoading(true);
      try {
        // ユーザー情報を取得
        const userRes = await axios.get(`/api/users/username/${username}`);
        setUser(userRes.data);

        // フォーム用の状態を初期化
        setDisplayName(userRes.data.displayName || userRes.data.username);
        setProfileText(userRes.data.profileText || '');

        // ユーザーの投稿を取得
        const postsRes = await axios.get(`/api/users/${userRes.data._id}/posts`);
        setPosts(postsRes.data);

        setLoading(false);
      } catch (err) {
        console.log("Error fetching data:", err);
        setError("データの取得に失敗しました。もう一度お試しください。");
        setLoading(false);
      }
    };

    fetchUserAndPosts();
  }, [username]);

  // プロフィール画像選択ハンドラ
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // プロフィール画像アップロードボタンクリックハンドラ
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // プロフィール編集保存ハンドラ
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // プロフィール情報を更新
      const updatedUser = await axios.put(`/api/users/${user._id}`, {
        userId: currentUser._id,
        displayName,
        profileText
      });

      // プロフィール画像がある場合はアップロード
      if (profilePicture) {
        const formData = new FormData();
        formData.append("profileImage", profilePicture);
        formData.append("userId", currentUser._id);

        const pictureRes = await axios.post(`/api/users/${user._id}/profileImage`, formData);

        // 最新のユーザー情報を取得
        setUser(pictureRes.data);

        // 現在のユーザーの場合、AuthContextも更新
        if (currentUser._id === user._id) {
          dispatch({ type: "LOGIN_SUCCESS", payload: pictureRes.data });
        }
      } else {
        // プロフィール画像がない場合は、ユーザー情報を更新
        setUser(updatedUser.data);

        // 現在のユーザーの場合、AuthContextも更新
        if (currentUser._id === user._id) {
          dispatch({ type: "LOGIN_SUCCESS", payload: updatedUser.data });
        }
      }

      // 編集モードを終了
      setEditMode(false);

      // プレビューURLがある場合はクリーンアップ
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl('');
      }
    } catch (err) {
      console.log("Error updating profile:", err);
      alert("プロフィールの更新に失敗しました。もう一度お試しください。");
    }
  };

  // キャンセルボタンハンドラ
  const handleCancel = () => {
    setEditMode(false);
    setDisplayName(user.displayName || user.username);
    setProfileText(user.profileText || '');

    // プレビューURLがある場合はクリーンアップ
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }

    setProfilePicture(null);
  };

  // ログアウトハンドラ
  const handleLogout = () => {
    dispatch({ type: "LOGIN_START" });
    localStorage.removeItem("user");
    dispatch({ type: "LOGIN_SUCCESS", payload: null });
    navigate('/login');
  };

  // ロード中の表示
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.logoSection}>
            <h3 className={styles.logo}>Crystal</h3>
            <span className={styles.tagline}>知の結晶が、ここに生まれる。</span>
          </div>
        </div>
        <div className={`${styles.content} ${styles.centerd}`}>
          <p className={styles.message}>読み込み中...</p>
        </div>
      </div>
    );
  }

  // エラー表示
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.logoSection}>
            <h3 className={styles.logo}>Crystal</h3>
            <span className={styles.tagline}>知の結晶が、ここに生まれる。</span>
          </div>
        </div>
        <div className={`${styles.content} ${styles.centerd}`}>
          <p className={`${styles.message} ${styles.errorMessage}`}>{error}</p>
          <button
            onClick={() => navigate('/')}
            className={styles.backButton}
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* ヘッダー */}
      <div className={styles.header}>
        <div className={styles.logoSection}>
          <h3 className={styles.logo}>Crystal</h3>
          <span className={styles.tagline}>知の結晶が、ここに生まれる。</span>
        </div>
        <div className={styles.userActions}>
          <Link to="/postList">
            <button>投稿一覧</button>
          </Link>
          {currentUser && (
            <button onClick={handleLogout}>ログアウト</button>
          )}
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className={styles.content}>
        {/* プロフィールカード */}
        <div className={styles.card}>
          {!editMode ? (
            // 表示モード
            <>
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>
                  <img
                    src={user.profilePicture ?
                      (user.profilePicture.startsWith('http') ?
                        user.profilePicture :
                        `${process.env.REACT_APP_API_URL}${user.profilePicture}`) :
                      '/assets/person/noAvatar.png'}
                    alt={`${user.username}のプロフィール画像`}
                    className={styles.avatarImg}
                  />
                </div>
                <div className={styles.info}>
                  <h2 className={styles.name}>{user.displayName || user.username}</h2>
                  <div className={styles.meta}>
                    <span>@{user.username}</span>
                    <span>登録日: {new Date(user.createdAt).toLocaleDateString('ja-JP')}</span>
                  </div>
                  {currentUser && currentUser._id === user._id && (
                    <button className={styles.editButton} onClick={() => setEditMode(true)}>
                      プロフィールを編集
                    </button>
                  )}
                </div>
              </div>
              <p className={styles.bio}>
                {user.profileText || 'プロフィールがまだ設定されていません。'}
              </p>
            </>
          ) : (
          // 編集モード
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.uploadWrapper}>
                <div className={styles.avatarPreview}>
                  <img
                    src={previewUrl || (user.profilePicture ?
                      (user.profilePicture.startsWith('http') ?
                        user.profilePicture :
                        `${process.env.REACT_APP_API_URL}${user.profilePicture}`) :
                      '/assets/person/noAvatar.png')}
                    alt="プロフィール画像プレビュー"
                    className={styles.avatarImg}
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className={styles.uploadButton}
                  onClick={handleUploadClick}
                >
                  画像を変更
                </button>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="displayName">表示名</label>
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  maxLength={20}
                  placeholder="表示名を入力してください"
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="profileText">自己紹介</label>
                <textarea
                  id="profileText"
                  value={profileText}
                  onChange={(e) => setProfileText(e.target.value)}
                  maxLength={500}
                  placeholder="自己紹介を入力してください"
                  className={styles.input}
                  rows={5}
                />
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={handleCancel}
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                >
                  保存
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 投稿リスト */}
        <div className={styles.posts}>
          <h3 className={styles.postsHeader}>投稿一覧</h3>
          {posts.length > 0 ? (
            <ul className={styles.postList}>
              {posts.map(post => (
                <li
                  key={post._id}
                  className={styles.postItem}
                  onClick={() => navigate(`/postDetails/${post._id}`)}
                >
                  <h4 className={styles.postTitle}>{post.title}</h4>
                  <div className={styles.postMeta}>
                    <span>{new Date(post.createdAt).toLocaleDateString('ja-JP')}</span>
                  </div>
                  <p className={styles.postPreview}>
                    {post.content.substring(0, 100)}{post.content.length > 100 ? '...' : ''}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.emptyPosts}>
              <p>まだ投稿がありません。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}