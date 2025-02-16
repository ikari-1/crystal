import React from 'react';
import './Login.css';

export default function Login() {
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
          <form className="loginBox">
            <p className="loginMsg">ログインはこちら</p>
            <input 
              type="email"
              placeholder="Eメール"
              className="loginInput"
              required
            />
            <input
              type="password"
              placeholder="パスワード"
              className="loginInput"
              required
              minLength="4"
            />
            <button className="loginButton">ログイン</button>
            <span className="loginForgot">パスワードを忘れた方へ</span>
            <button className="loginRegisterButton">アカウントを作成</button>
          </form>
        </div>
      </div>
    </div>
  )
}
