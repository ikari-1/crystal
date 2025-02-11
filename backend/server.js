const express = require("express");
const app = express();
const PORT = 3000;
const mongoose = require("mongoose");
require("dotenv").config();

//データベース接続
mongoose
  .connect(process.env.MONGOURL)
  .then(() => {
    console.log("DBと接続中・・・");
  })
  .catch((err) => {
    console.log(err);
  });

//test
app.get("/", (req, res) => {
  res.send("hello express");
});

//listen PORT
app.listen(PORT, () => console.log("サーバーが起動しました"));