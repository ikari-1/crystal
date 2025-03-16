const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const upload = require("../middleware/upload");

// ユーザー情報の更新
router.put("/:id", async (req, res) => {
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

// ユーザープロフィール画像のアップロード
router.post("/:id/profileImage", upload.single("profileImage"), async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      // ファイルがアップロードされたか確認
      if (!req.file) {
        return res.status(400).json("画像ファイルがありません");
      }

      // 画像パスをユーザープロフィールに設定
      const imagePath = `/images/profiles/${req.file.filename}`;

      const user = await User.findByIdAndUpdate(req.params.id, {
        profilePicture: imagePath
      }, { new: true });

      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
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

module.exports = router;