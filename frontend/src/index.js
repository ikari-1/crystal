import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { SearchProvider } from "./context/SearchContext";
import ThemeProvider from './context/ThemeContext';
// 本番Vercel環境ではproxy機能がないため、相対パスが自動変換されず、バックエンドと通信できない。この問題を解決するためにaxiosのbaseURLを設定する。
import axios from 'axios';
if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = process.env.REACT_APP_API_URL;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <SearchProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </SearchProvider>
    </AuthContextProvider>
  </React.StrictMode>
);


