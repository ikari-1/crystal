import styles from "./Header.module.css";
import { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Logout } from '../../context/AuthActions';
import Searchbar from '../searchbar/Searchbar';
import OutlinedButton from '../buttons/outlinedButton/OutlinedButton';
import { ThemeContext } from '../../context/ThemeContext';

export default function Header() {
  const { user, dispatch } = useContext(AuthContext);
  const { setTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(Logout());
    localStorage.removeItem("user");
    localStorage.setItem("theme", "Diamond");
    setTheme("Diamond");
    navigate("/login");
  }

  return (
    <>
      <div className={styles.header}>
        <div className={styles.logoSection}>
          <h3 className={styles.logo}  onClick={() => navigate("/postList")} >Crystal</h3>
          <span className={styles.tagline}>知の結晶が、ここに生まれる。</span>
        </div>
        <Searchbar />
        <div className={styles.userSection}>
          <span className={styles.username}>{user?.username || 'ユーザー名'}</span>
          <div className={styles.actions}>
            { user ? (
              <OutlinedButton text="ログアウト" onClick={handleLogout} />
            ) : (
              <OutlinedButton text="ログイン" onClick={() => navigate("/login")} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
