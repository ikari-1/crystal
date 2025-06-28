const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { uploadProfile } = require("../middleware/upload");

// ユーザー情報の更新
router.put("/:id", uploadProfile, async (req, res) => {
  // リクエストしたユーザーIDとパラメータのIDが一致するか確認
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    //パスワードを更新する場合は暗号化
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }

    // 新しい画像ファイルがあれば、そのパスを保存
    if (req.file) {
      req.body.profilePicture = `/images/profiles/${req.file.filename}`;
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      }, { new: true });

      res.status(200).json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("アカウントの更新権限がありません");
  }
});

// ユーザー削除
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("アカウントが削除されました");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("自分のアカウントのみ削除できます");
  }
});

// ユーザー情報の取得
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json("ユーザーが見つかりません");
    }
    // パスワードとその他不要な情報を除外して返す
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ユーザーネームからユーザー情報を取得
router.get("/username/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json("ユーザーが見つかりません");
    }

    // パスワードとその他不要な情報を除外して返す
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ユーザーの投稿一覧を取得（ユーザープロフィールから取得するのでuser.jsに記載）
router.get("/:id/posts", async (req, res) => {
  try {
    const Posts = require("../models/Post")
    const userId = req.params.id;
    const user = await User.findById(userId);
    if(!user) return res.status(404).json({ message: "ユーザーが見つかりません"});

    const posts = await Posts.find({ userId: userId });
    res.json({ user, posts });
  } catch(err) {
    res.status(500).json({ message: "サーバーエラー"});
  }
});

module.exports = router;