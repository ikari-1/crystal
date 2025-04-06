import React from 'react'
import styles from "./Header.module.css"
import { useContext } from "react";
import { AuthContext } from '../../context/AuthContext';

export default function Header() {
  const { user } = useContext(AuthContext);
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
            <button className={styles.logoutBtn}>ログアウト</button>
          </div>
        </div>
      </div>
    </>
  )
}
