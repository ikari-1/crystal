import React from 'react'
import styles from "./Navigation.module.css";
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

export default function Navigation() {
  return (
    <>
      <aside className={styles.container}>
        <ul>
          <li className={`${styles.item} ${styles.select}`}>
            <Link to="/postList" className={styles.link}>
              <HomeIcon className={styles.icon} />
              <span className={styles.label}>ホーム</span>
            </Link>
          </li>
          <li className={styles.item}>
            <Link to="/profile" className={styles.link} >
              <PersonIcon className={styles.icon} />
              <span className={styles.label}>プロフィール</span>
            </Link>
          </li>
          <li className={styles.item}>
            <Link to="/setting" className={styles.link} >
              <SettingsIcon className={styles.icon} />
              <span className={styles.label}>設定</span>
            </Link>
          </li>
        </ul>
      </aside>
    </>
  )
}
