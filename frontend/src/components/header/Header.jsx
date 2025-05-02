import React from 'react'
import styles from "./Header.module.css"
import { useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type:"LOGOUT" });
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <>
      <div className={styles.header}>
        <div className={styles.logoSection}>
          <h3 className={styles.logo}>Crystal</h3>
          <span className={styles.tagline}>知の結晶が、ここに生まれる。</span>
        </div>
        <div className={styles.userSection}>
          <span className={styles.username}>{user?.username || 'ユーザー名'}</span>
          <div className={styles.actions}>
            { user ? (
              <button className={styles.btn}  onClick={handleLogout}>ログアウト</button>
            ) : (
              <button className={styles.btn} onClick={() => navigate("/login")}>ログイン</button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
