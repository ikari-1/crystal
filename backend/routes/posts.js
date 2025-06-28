const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const { uploadPost } = require("../middleware/upload");

// 投稿を更新
router.put("/:id", uploadPost, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // 投稿が存在するか確認
    if (!post) {
      return res.status(404).json("投稿が見つかりません");
    }

    // 投稿者本人かどうか確認
    if (post.userId === req.body.userId) {
      // 新しい画像がアップロードされた場合は追加
      const newImagePaths = req.files
        ? req.files.map((file) => `/images/posts/${file.filename}`)
        : [];

      // 既存の画像と新しい画像をマージ（または置き換え）
      let updatedImages = [];
      if (req.body.keepImages) {
        // keepImagesが配列ではない場合、配列に変換
        const keepImages = Array.isArray(req.body.keepImages)
          ? req.body.keepImages
          : [req.body.keepImages];

        // 保持したい画像のパスを取得
        updatedImages = post.images.filter((imgPath) =>
          keepImages.includes(imgPath)
        );
      }

      // 新しい画像を追加
      updatedImages = [...updatedImages, ...newImagePaths];

      // 投稿を更新
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title,
          content: req.body.content,
          images: updatedImages,
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
router.post("/", uploadPost, async (req, res) => {
  try {
    const imagePath = req.files.map((file) => `/images/posts/${file.filename}`);

    const newPost = new Post({
      userId: req.body.userId,
      title: req.body.title,
      content: req.body.content,
      images: imagePath,
    });

    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (err) {
    console.log("エラー：", err)
    return res.status(500).json(err);
  }
});

//全ての投稿を取得
router.get("/all", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).lean();

    // 投稿者の名前を取得して追加
    const postsWithUser = await Promise.all(
      posts.map(async (post) => {
        const user = await User.findById(post.userId).select("username profilePicture");
        return {
          ...post,
          username: user ? user.username : "不明なユーザー",
          profilePicture: user ? user.profilePicture : ""
        };
      })
    );

    return res.status(200).json(postsWithUser);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//いいねの状態を切り替える
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      post.likes.push(req.body.userId);
    } else {
      post.likes = post.likes.filter((id) => id !== req.body.userId);
    }
    await post.save();
    res.status(200).json({ likes: post.likes });
  } catch (err) {
    res.status(500).json(err);
  }
});

// タイトル検索
router.get(`/search`, async (req, res) => {
  try {
    const title = req.query.title;
    const posts = await Post.find({
      title: { $regex: title, $options: "i" }
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '検索に失敗しました' });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  console.log("ID:", id);
  try {
    const post = await Post.findById(req.params.id).lean();
    if (!post) {
      return res.status(404).json("投稿が見つかりません");
    }
    const user = await User.findById(post.userId).select("username profilePicture");
    const postWithUser = {
      ...post,
      username: user ? user.username : "不明なユーザー",
      profilePicture: user ? user.profilePicture : ""
    };
    res.status(200).json(postWithUser);
  } catch (err) {
    console.error("エラー：", err);
    res.status(500).json(err);
  }
})

module.exports = router;
