import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { SearchProvider } from "./context/SearchContext";
import ThemeProvider from './context/ThemeContext';

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


