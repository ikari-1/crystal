const multer = require("multer");
const path = require("path");

//画像の保存先を指定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/posts");
  },
  filename: (req, file, cb) => {
    //ファイル名を一意にするために日付と元のファイル名を組み合わせる
    cb(null, Date.now() + "-" + file.originalname);
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

//multerの設定
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, //5MBまで
    files: 4 //最大4ファイルまで
  }
});

module.exports = upload;