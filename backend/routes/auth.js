const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//ユーザー登録
router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      isPasswordHashed: true,
    });
    const user = await newUser.save();
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//ログイン
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("ユーザーが見つかりません");


    //途中からパスワードをハッシュ化する時の二重認証戦略（開発時のみ）
    let isValidPassword = false;
    if (user.isPasswordHashed) {
      isValidPassword = await bcrypt.compare(req.body.password, user.password);
    } else {
      isValidPassword = req.body.password === user.password;
      if (isValidPassword) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await User.updateOne(
          { _id: user._id },
          {
            $set: {
              password: hashedPassword,
              isPasswordHashed: true,
            }
          }
        );
      }
    }

    //最初からパスワードをハッシュ化している場合（本番ではこちらを使う）
    // const isValidPassword = await bcrypt.compare(req.body.password, user.password);

    //ハッシュ化済みユーザー数の確認
    const hashedUsers = await User.countDocuments({ isPasswordHashed: true });
    const totalUsers = await User.countDocuments();
    const migrationProgress = (hashedUsers / totalUsers) * 100;
    console.log(`ハッシュ化済みユーザー数: ${hashedUsers}`);
    console.log(`全ユーザー数: ${totalUsers}`);
    console.log(`進捗: ${migrationProgress}%`);

    //以降は共通
    if (!isValidPassword) return res.status(400).json("パスワードが違います");
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;