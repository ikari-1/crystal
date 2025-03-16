const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const upload = require("../middleware/upload");

// 投稿を更新
router.put("/:id", upload.array("images", 4), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // 投稿が存在するか確認
    if (!post) {
      return res.status(404).json("投稿が見つかりません");
    }

    // 投稿者本人かどうか確認
    if (post.userId === req.body.userId) {
      // 新しい画像がアップロードされた場合は追加
      const newImagePaths = req.files ? req.files.map(file => `/images/posts/${file.filename}`) : [];

      // 既存の画像と新しい画像をマージ（または置き換え）
      let updatedImages = [];
      if (req.body.keepImages) {
        // keepImagesが配列ではない場合、配列に変換
        const keepImages = Array.isArray(req.body.keepImages)
          ? req.body.keepImages
          : [req.body.keepImages];

        // 保持したい画像のパスを取得
        updatedImages = post.images.filter(imgPath => keepImages.includes(imgPath));
      }

      // 新しい画像を追加
      updatedImages = [...updatedImages, ...newImagePaths];

      // 投稿を更新
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title,
          content: req.body.content,
          images: updatedImages
        },
        { new: true }
      );

      res.status(200).json(updatedPost);
    } else {
      res.status(403).json("自分の投稿のみ更新できます");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// 投稿を削除
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json("投稿が見つかりません");
    }

    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("投稿を削除しました");
    } else {
      res.status(403).json("自分の投稿のみ削除できます");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});



//新規投稿
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch(err) {
    return res.status(500).json(err);
  }
});

router.get("/all", async(req, res) => {
  try {
    const post = await Post.find();
    return res.status(200).json(post);
  } catch (err) {
    return res.status(403).json(err);
  }
});

module.exports = router;