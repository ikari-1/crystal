import React, { useRef } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Crystal</h3>
          <span className="loginDesc">
            知の結晶が、ここに生まれる。
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={(e) => handleClick(e)}>
            <p className="loginMsg">新規登録はこちら</p>
            <input 
              type="text"
              placeholder="ユーザー名"
              className="registerInput"
              minLength="2"
              required
              ref={username}
            />
            <input 
              type="email"
              placeholder="Eメール"
              className="registerInput"
              required
              ref={email}
            />
            <input
              type="password"
              placeholder="パスワード"
              className="registerInput"
              required
              minLength="4"
              ref={password}
            />
            <input
              type="password"
              placeholder="パスワード再入力"
              className="registerInput"
              required
              minLength="4"
              ref={passwordConfirmation}
            />
            <button className="registerButton">サインアップ</button>
          </form>
        </div>
      </div>
    </div>
  )
}
