import React, { useContext } from 'react'
import styles from "./Navigation.module.css";
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { useSelectedNav } from '../../context/SelectedNavContext';
import { AuthContext } from '../../context/AuthContext';

export default function Navigation() {
  const { selectedNav } = useSelectedNav();
  const { user } = useContext(AuthContext);
  return (
    <>
      <aside className={styles.container}>
        <ul>
          <li className={`${styles.item} ${selectedNav === "/postList" ? styles.select : ""}`}>
            <Link to="/postList" className={styles.link}>
              <HomeIcon className={styles.icon} />
              <span className={styles.label}>ホーム</span>
            </Link>
          </li>
          <li className={`${styles.item} ${selectedNav.startsWith(`/profile/${user._id}`) ? styles.select : ""}`}>
            <Link to={`/profile/${user._id}`} className={styles.link} >
              <PersonIcon className={styles.icon} />
              <span className={styles.label}>プロフィール</span>
            </Link>
          </li>
          <li className={`${styles.item} ${selectedNav === "/setting" ? styles.select : ""}`}>
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
