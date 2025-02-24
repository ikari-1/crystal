import React, { useContext, useRef } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { loginCall } from '../../apiCalls';

export default function Login() {
  const email = useRef();
  const password = useRef();
  const { user, isFetching, error, dispatch } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    loginCall(
      {
        email: email.current.value,
        password: password.current.value,
      },
      dispatch
    );
  };

  console.log(user);

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
          <form className="loginBox" onSubmit={(e) => handleSubmit(e)}>
            <p className="loginMsg">ログインはこちら</p>
            <input 
              type="email"
              placeholder="Eメール"
              className="loginInput"
              required
              ref={email}
            />
            <input
              type="password"
              placeholder="パスワード"
              className="loginInput"
              required
              minLength="4"
              ref={password}
            />
            <button className="loginButton">ログイン</button>
            <span className="loginForgot">パスワードを忘れた方へ</span>
            <Link to="/register" className="loginRegisterLink">
              <button className="loginRegisterButton">アカウントを作成</button>
            </Link>
            {/* <button className="loginRegisterButton">アカウントを作成</button> */}
          </form>
        </div>
      </div>
    </div>
  )
}
