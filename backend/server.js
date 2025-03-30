const express = require("express");
const app = express();
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const PORT = 3001;
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");
const fs = require("fs");

//データベース接続
mongoose
  .connect(process.env.MONGOURL)
  .then(() => {
    console.log("DBと接続中・・・");
  })
  .catch((err) => {
    console.log(err);
  });

//ミドルウェア
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

//フロントエンドからのアクセスを許可する設定
const allowedOrigin = process.env.NODE_ENV === 'production'
  ? process.env.PRODUCTION_CLIENT_URL
  : 'http://localhost:3000';
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

//画像ファイルを見せるための設定
//app.use('/images', express.static('public/images'));

//キャッシュを使って画像を表示させない設定 ＆ 画像ファイルを見せるための設定
// （backendフォルダで画像ファイル削除した際、キャッシュから古い画像が返されて、その実際のファイルをサーバーに確認するときにファイルなしエラーが出てしまったので）
app.use('/images', (req, res, next) => {
  const filePath = path.join(__dirname, 'public/images', req.url);
  console.log('Requested URL:', req.url); // debug
  console.log('File path:', filePath); // debug
  console.log('File exists:', fs.existsSync(filePath)); // debug
  if (fs.existsSync(filePath)) {
    res.set('Cache-Control', 'no-store, nocache, must-revalidate, proxy-revalidate');
    next();
  } else {
    res.redirect('/images/default/noAvatar.png');
  }
}, express.static('public/images'));

//listen PORT
app.listen(PORT, () => console.log("サーバーが起動しました"));