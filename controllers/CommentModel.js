const mongoose = require("mongoose");
const CommentSchema = require("./CommentSchema");

const CommentSchema = new Schema(
  {
    user: {
      type: Object,
      default: {},
      required: true, // Trường này là bắt buộc
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId, // Tham chiếu đến collection product
      ref: "product",
      required: true, // Trường này là bắt buộc
    },
    rating: {
      type: Number,
      required: true, // Trường này là bắt buộc
      min: 1,
      max: 5,
    },
    comment: {
      type: String, // Nội dung bình luận
      trim: true,
    }, // Không cần required vì mặc định không bắt buộc
    images: [
      {
        type: String, // URL ảnh
        trim: true,
      },
    ], // Không cần required vì đây là trường không bắt buộc
    videos: [
      {
        type: String, // URL video
        trim: true,
      },
    ], // Không cần required vì đây là trường không bắt buộc
    displayName: {
      type: Boolean, // true: hiển thị tên đăng nhập, false: ẩn tên
      default: true,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

module.exports = CommentSchema;
