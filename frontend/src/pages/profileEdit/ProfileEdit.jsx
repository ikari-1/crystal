import React, { useEffect, useState, useContext, useRef } from 'react';
import Header from '../../components/header/Header';
import Navigation from '../../components/navigation/Navigation';
import styles from './ProfileEdit.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import TextButton from '../../components/buttons/textButton/TextButton';
import FilledButton from '../../components/buttons/filledButton/FilledButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function ProfileEdit() {
  const [username, setUsername] = useState('');
  const [profileText, setProfileText] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/users/${id}`);
        setUsername(res.data.username || '');
        setProfileText(res.data.profileText || '');
        setProfileImage(res.data.profilePicture || null)
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };
    fetchUser();
  }, [id]);

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      alert('ユーザー名は必須です');
      return;
    }

    const formData = new FormData();
    formData.append('userId', user._id);
    formData.append('username', username);
    formData.append('profileText', profileText);
    if (profileImage && typeof profileImage !== 'string') {
      formData.append('profilePicture', profileImage);
    }


    try {
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/users/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch({ type: "UPDATE_SUCCESS", payload: res.data });
      navigate(`/profile/${id}`);
      alert('プロフィールを更新しました');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('プロフィールを更新できませんでした');
    }
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <Navigation />
        <div className={styles.container}>
          <div className={styles.card}>
            <form onSubmit={handleSubmit} className={styles.editProfileForm} id="profileForm">
              <div className={styles.profileImgContainer}>
                {profileImage ? (
                  <img
                    src={(typeof profileImage === 'string' ? profileImage : URL.createObjectURL(profileImage))}
                    alt=""
                    className={styles.profileImg}
                  />
                ) : (
                  <AccountCircleIcon sx={{width: 150, height: 150}} />
                )}
                <input type="file" onChange={handleFileChange} ref={inputRef} style={{ display: 'none' }}/>
                <TextButton type="button" onClick={() => inputRef.current.click()} text="画像を変更" />
              </div>
              <div className={styles.userInfo}>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={styles.usernameInput} placeholder="ユーザー名" />
                <textarea value={profileText} onChange={(e) => setProfileText(e.target.value)} className={styles.profileTextInput} placeholder="自己紹介" />
              </div>
            </form>
            <div className={styles.buttons}>
              <TextButton text="キャンセル" onClick={() => navigate(-1)} />
              <FilledButton form="profileForm" type="submit" text="更新" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}