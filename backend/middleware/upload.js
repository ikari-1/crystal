const multer = require("multer");
const path = require("path");
const fs = require("fs");

// プロフィール画像用のストレージ設定
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/profiles");
  },
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

// 投稿画像用のストレージ設定
const postStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/posts");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "_" + Buffer.from(file.originalname, "latin1").toString("utf8");
    cb(null, uniqueName);
  }
});

//アップロードできるファイルタイプのフィルタリング
const fileFilter = (req, file, cb) => {
  //許可する拡張子（MIMEタイプ）
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif"
  ];

  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true); //ファイルを受け入れる
  } else {
    cb(new Error("サポートされていないファイル形式です。JPG, PNG, GIF形式のみアップロード可能です。"), false);
  }
};

// プロフィール画像用のアップロードミドルウェア
const uploadProfile = multer({
  storage: profileStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, //5MBまで
  }
});

// 投稿画像用ディレクトリの自動生成
const postImagesDir = path.join(__dirname, "../public/images/posts");
if (!fs.existsSync(postImagesDir)) {
  fs.mkdirSync(postImagesDir, { recursive: true });
}

// 画像投稿用のアップロードミドルウェア
const uploadPost = multer({
  storage: postStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, //5MBまで
    files: 4 //最大4ファイルまで
  }
});

module.exports = {
  uploadProfile: uploadProfile.single("profileImage"),
  uploadPost: uploadPost.array("images", 4)
};