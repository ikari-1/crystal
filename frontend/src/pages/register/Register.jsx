import React, { useRef } from 'react';
import styles from './Register.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FilledButton from '../../components/buttons/filledButton/FilledButton';
import OutlinedButton from '../../components/buttons/outlinedButton/OutlinedButton';

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordConfirmation = useRef();

  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    if (passwordConfirmation.current.value !== password.current.value) {
      passwordConfirmation.current.setCustomValidity("パスワードが一致しません");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await axios.post("/api/auth/register", user);
        navigate('/login');
      } catch (err) {
        console.log(err);
      }
    }
  };

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
          <form className={styles.loginBox} onSubmit={(e) => handleClick(e)}>
            <p className={styles.loginMsg}>新規登録はこちら</p>
            <input
              type="text"
              placeholder="ユーザー名"
              className={styles.registerInput}
              minLength="2"
              required
              ref={username}
            />
            <input
              type="email"
              placeholder="Eメール"
              className={styles.registerInput}
              required
              ref={email}
            />
            <input
              type="password"
              placeholder="パスワード"
              className={styles.registerInput}
              required
              minLength="4"
              ref={password}
            />
            <input
              type="password"
              placeholder="パスワード再入力"
              className={styles.registerInput}
              required
              minLength="4"
              ref={passwordConfirmation}
            />
            <FilledButton text="サインアップ" />
            <OutlinedButton text="ログイン画面へ" onClick={() => navigate("/login")} />
          </form>
        </div>
      </div>
    </div>
  )
}
