import React, { useState, useContext, useRef, useEffect } from 'react';
import styles from './PostDetails.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import Header from '../../components/header/Header';

export default function Post_details() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams(); // URLからポストIDを取得

  // 投稿の状態管理
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // 画像プレビューのための状態
  const [previewUrls, setPreviewUrls] = useState([]);
  const [keepImages, setKeepImages] = useState([]);

  // 投稿データの取得
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        if (id) {
          // 実際のAPIから投稿を取得
          const res = await axios.get(`/api/posts/${id}`);
          setPost(res.data);
          setTitle(res.data.title);
          setContent(res.data.content);
          setKeepImages(res.data.images || []);

          // 既存画像のプレビューURLを設定
          const imageUrls = res.data.images.map(img => img.startsWith('http') ? img : `${process.env.REACT_APP_API_URL}${img}`);
          setPreviewUrls(imageUrls);
        } else {
          // 開発用：IDがない場合はダミーデータを使用
          console.log('開発モード: ダミーデータを使用します');

          // 開発用ダミーデータ
          const dummyPost = {
            _id: 'dummy123',
            title: 'VSCode(VisualStudioCode)の定番機能を一挙解説',
            content: 'そもそもVSCodeって？\n\nVSCode（VisualStudioCode）はMicrosoftが提供する無償のコードエディタです。2015年リリースですが、着々とユーザーを増やしており、2023年現在、世界で最もポピュラーなコードエディタの1つとなっています。\n\nコードエディタって？\n字や記号などのテキストで構成されているファイルを編集するソフトのことをテキストエディタと呼びます。その中でも、ソースコードの編集を主な目的としたものがコードエディタと呼ばれます。',
            userId: user?._id || 'dummyUser',
            images: [
              'https://placeholder.pics/svg/300x200/DEDEDE/555555/Sample%20Image%201',
              'https://placeholder.pics/svg/300x200/DEDEDE/555555/Sample%20Image%202'
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          setPost(dummyPost);
          setTitle(dummyPost.title);
          setContent(dummyPost.content);
          setKeepImages(dummyPost.images);
          setPreviewUrls(dummyPost.images);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("投稿取得エラー:", err);
        setError("投稿の取得に失敗しました");
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, user]);

  // 画像選択ハンドラ
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // 最大4枚までの制限（既存画像＋新規画像）
      const remainingSlots = 4 - keepImages.length;
      const selectedFiles = files.slice(0, remainingSlots);

      if (selectedFiles.length === 0) {
        alert('最大4枚までしか画像を追加できません');
        return;
      }

      // 画像プレビューURLの生成
      const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
      const newUrls = [...previewUrls, ...newPreviewUrls];

      setPreviewUrls(newUrls);
      setImageFiles([...imageFiles, ...selectedFiles]);
    }
  };

  // 既存画像削除ハンドラ
  const handleRemoveExistingImage = (index) => {
    const updatedKeepImages = [...keepImages];
    const removedImage = updatedKeepImages.splice(index, 1)[0];

    // プレビューURLからも削除
    const updatedPreviews = previewUrls.filter(url => !url.includes(removedImage));

    setKeepImages(updatedKeepImages);
    setPreviewUrls(updatedPreviews);
  };

  // 新規追加画像削除ハンドラ
  const handleRemoveNewImage = (index) => {
    const existingImagesCount = keepImages.length;
    const newImageIndex = index - existingImagesCount;

    if (newImageIndex >= 0) {
      const updatedFiles = [...imageFiles];

      // プレビューURLのオブジェクトURLを解放
      URL.revokeObjectURL(previewUrls[index]);

      // 該当する新規画像を削除
      updatedFiles.splice(newImageIndex, 1);

      // プレビューURLからも削除
      const updatedPreviews = [...previewUrls];
      updatedPreviews.splice(index, 1);

      setImageFiles(updatedFiles);
      setPreviewUrls(updatedPreviews);
    }
  };

  // 画像アップロードボタンハンドラ
  const handleImageUploadClick = () => {
    fileInputRef.current.click();
  };

  // キャンセルボタンハンドラ
  const handleCancel = () => {
    if (editMode) {
      // 編集モードをキャンセルして表示モードに戻る
      setEditMode(false);
      setTitle(post.title);
      setContent(post.content);

      // 画像状態をリセット
      setKeepImages(post.images || []);
      const imageUrls = post.images.map(img => img.startsWith('http') ? img : `${process.env.REACT_APP_API_URL}${img}`);
      setPreviewUrls(imageUrls);
      setImageFiles([]);
    } else {
      // ホームページまたはメインページに戻る
      navigate('/');
    }
  };

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
      navigate('/');
    } catch (err) {
      console.error('削除エラー:', err);
      let errorMessage = '投稿の削除に失敗しました。';

      if (err.response && err.response.data) {
        errorMessage += ` ${err.response.data}`;
      }

      alert(errorMessage);
    }
  };

  // 投稿更新ハンドラ
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('タイトルを入力してください');
      return;
    }

    try {
      // FormDataの作成（画像アップロードのため）
      const formData = new FormData();
      formData.append('userId', user._id);
      formData.append('title', title);
      formData.append('content', content);

      // 残す既存画像のパスを追加
      keepImages.forEach(imgPath => {
        formData.append('keepImages', imgPath);
      });

      // 新規追加画像ファイルの追加
      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      // ローディング状態を設定
      setIsLoading(true);

      // APIリクエスト
      const response = await axios.put(`/api/posts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // 成功メッセージを表示
      alert('投稿が更新されました！');

      // 更新された投稿情報を設定
      setPost(response.data);

      // 編集モードを終了
      setEditMode(false);
      setIsLoading(false);
    } catch (err) {
      console.error('更新エラー:', err);
      setIsLoading(false);

      let errorMessage = '投稿の更新に失敗しました。もう一度お試しください。';

      if (err.response) {
        if (err.response.status === 413) {
          errorMessage = 'ファイルサイズが大きすぎます。画像は1枚あたり5MB以下でお試しください。';
        } else if (err.response.data) {
          errorMessage = `エラー: ${err.response.data}`;
        }
      }

      alert(errorMessage);
    }
  };

  // 編集モード切替ハンドラ
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  // ロード中の表示
  if (isLoading) {
    return (
      <div className={`${styles.postDetailsContainer} ${styles.loading}`}>
        <div className={styles.loadingMessage}>ロード中...</div>
      </div>
    );
  }

  // エラー表示
  if (error) {
    return (
      <div className={`${styles.postDetailsContainer} ${styles.error}`}>
        <div className={styles.errorMessage}>{error}</div>
        <button onClick={() => navigate('/')} className={styles.backBtn}>戻る</button>
      </div>
    );
  }

  // 投稿が見つからない場合
  if (!post) {
    return (
      <div className={`${styles.postDetailsContainer} ${styles.error}`}>
        <div className={styles.errorMessage}>投稿が見つかりません</div>
        <button onClick={() => navigate('/')} className={styles.backBtn}>戻る</button>
      </div>
    );
  }

  return (
    <div className={styles.postDetailsContainer}>
      <Header />

      <div className={styles.postContainer}>
        {editMode ? (
          // 編集モード
          <form className={styles.postForm} onSubmit={handleUpdate}>
            <h2 className={styles.formTitle}>投稿の編集</h2>

            <div className={styles.formGroup}>
              <label htmlFor="post-title">タイトル</label>
              <input
                type="text"
                id="post-title"
                className={styles.titleInput}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="タイトルを入力してください"
                maxLength={100}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="post-content">投稿内容</label>
              <textarea
                id="post-content"
                className={styles.contentInput}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="投稿内容を入力してください"
                maxLength={5000}
                rows={10}
              />
            </div>

            <div className={styles.formGroup}>
              <label>画像（最大4枚）</label>
              <div className={styles.imagePreviewContainer}>
                {/* 既存画像とプレビュー表示 */}
                {previewUrls.map((url, index) => (
                  <div key={index} className={styles.imagePreview}>
                    <img src={url} alt={`プレビュー ${index + 1}`} />
                    <button
                      type="button"
                      className={styles.removeImageBtn}
                      onClick={() => {
                        if (index < keepImages.length) {
                          handleRemoveExistingImage(index);
                        } else {
                          handleRemoveNewImage(index);
                        }
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* 空のプレビューボックスを表示（最大4枚まで） */}
                {Array(Math.max(0, 4 - previewUrls.length)).fill().map((_, index) => (
                  <div key={`empty-${index}`} className={styles.emptyImagePreview}>
                    <span>画像</span>
                  </div>
                ))}
              </div>
            </div>

            <input
              type="file"
              multiple
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleImageSelect}
            />

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.imageUploadBtn}
                onClick={handleImageUploadClick}
                disabled={previewUrls.length >= 4}
              >
                画像追加
              </button>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={handleCancel}
              >
                キャンセル
              </button>
              <button
                type="submit"
                className={styles.submitBtn}
              >
                更新
              </button>
            </div>
          </form>
        ) : (
          // 表示モード
          <div className={styles.postDetails}>
            <h2 className={styles.post-title}>{post.title}</h2>

            <div className={styles.postMeta}>
              <span className={styles.postDate}>
                {new Date(post.createdAt).toLocaleDateString('ja-JP')}
              </span>
            </div>

            <div className={styles.postContent}>
              {post.content}
            </div>

            {post.images && post.images.length > 0 && (
              <div className={styles.postImages}>
                {post.images.map((img, index) => (
                  <div key={index} className={styles.postImageContainer}>
                    <img
                      src={img.startsWith('http') ? img : `${process.env.REACT_APP_API_URL}${img}`} 
                      alt={`投稿画像 ${index + 1}`}
                      className={styles.postImage}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 投稿者本人の場合のみ編集・削除ボタンを表示 */}
            {user && post.userId === user._id && (
              <div className={styles.postActions}>
                <button onClick={toggleEditMode} className={styles.editBtn}>編集</button>
                <button onClick={handleDelete} className={styles.deleteBtn}>削除</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}