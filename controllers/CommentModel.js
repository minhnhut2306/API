// khai báo 1 schema cho users
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",required: true,
  },
  rating: {
    type: Number,required: true,
    min: 1,max: 5,
  },
  comment: {
    type: String,required: false,
  },
  images: [
    {
      type: String, // URL hoặc đường dẫn đến ảnh
required: false,
    },
  ],
  videos: [
    {
      type: String, // URL hoặc đường dẫn đến video
      required: false,
    },
  ],
  displayName: {
    type: Boolean, // true: hiển thị tên đăng nhập, false: ẩn tên
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
// tiếng anh, số ít, chữ thường, không dấu, không cách
module.exports =
  mongoose.models.comment || mongoose.model("comment", CommentSchema);
