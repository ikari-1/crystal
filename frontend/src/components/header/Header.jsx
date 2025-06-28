import styles from "./Header.module.css";
import { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Logout } from '../../context/AuthActions';
import Searchbar from '../searchbar/Searchbar';
import OutlinedButton from '../buttons/outlinedButton/OutlinedButton';
import { ThemeContext } from '../../context/ThemeContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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
          <div className={styles.userInfo} onClick={() => navigate(`/profile/${user._id}`)} >
            <div className={styles.userIcon}>
              {user?.profilePicture ? (
                <img
                  src={(typeof user?.profilePicture === 'string' ? user?.profilePicture : URL.createObjectURL(user?.profilePicture))}
                  alt=""
                  className={styles.profileImg}
                />
              ) : (
                <AccountCircleIcon sx={{width: "100%", height: "100%"}} />
              )}
            </div>
            <span className={styles.username}>{user?.username || 'ユーザー名'}</span>
          </div>
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
