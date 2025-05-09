const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 2,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 4,
      max: 50,
    },
    //途中からパスワードをハッシュ化する時の二重認証戦略用のフィールド
    isPasswordHashed: {
      type: Boolean,
      default: false,
    },
    displayName: {
      type: String,
      min: 2,
      max: 20,
    },
    profileText: {
      type: String,
      max: 500,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);