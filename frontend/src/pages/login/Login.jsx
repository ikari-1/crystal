import React, { useContext, useRef } from 'react';
import styles from './Login.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { loginCall } from '../../apiCalls';

export default function Login() {
  const email = useRef();
  const password = useRef();
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    loginCall(
      {
        email: email.current.value,
        password: password.current.value,
      },
      dispatch
    ).then((response) => {
      navigate('/postList');
    }).catch((err) => {
      console.error(err);
    });
  };

  console.log(user);

  return (
    <div className={styles.login}>
      <div className={styles.loginWrapper}>
        <div className={styles.loginLeft}>
          <h3 className={styles.loginLogo}>Crystal</h3>
          <span className={styles.loginDesc}>
            知の結晶が、ここに生まれる。
          </span>
        </div>
        <div className={styles.loginRight}>
          <form className={styles.loginBox} onSubmit={(e) => handleSubmit(e)}>
            <p className={styles.loginMsg}>ログインはこちら</p>
            <input
              type="email"
              placeholder="Eメール"
              className={styles.loginInput}
              required
              ref={email}
            />
            <input
              type="password"
              placeholder="パスワード"
              className={styles.loginInput}
              required
              minLength="4"
              ref={password}
            />
            <button className={styles.loginButton}>ログイン</button>
            <span className={styles.loginForgot}>パスワードを忘れた方へ</span>
            <Link to="/register" className={styles.loginRegisterLink}>
              <button className={styles.loginRegisterButton}>アカウントを作成</button>
            </Link>
            {/* <button className="loginRegisterButton">アカウントを作成</button> */}
          </form>
        </div>
      </div>
    </div>
  )
}
