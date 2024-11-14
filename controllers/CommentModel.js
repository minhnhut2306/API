// khai báo 1 schema cho users
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: false,
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


// Export the schema directly, without creating a model
module.exports = CommentSchema;


// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const videoSchema = require("./VideoModel");
// const imageSchemaa = require("./ImagesModel");
// const CommentSchema = new Schema({
//   user: { type: Object, require: true },

//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "product",
//     required: true,
//   },
//   rating: {
//     type: Number,
//     required: true,
//     min: 1,
//     max: 5,
//   },
//   comment: {
//     type: String,
//     required: false,
//   },
//   images: [
//     { type: mongoose.Schema.Types.ObjectId, ref: "Image" } // Reference to the Video model
//   ],
//   videos: [
//     { type: mongoose.Schema.Types.ObjectId, ref: "Video" } // Reference to the Video model
// ],
//   displayName: {
//     type: Boolean,
//     default: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Export the schema directly, without creating a model
// module.exports = CommentSchema;

// tiếng anh, số ít, chữ thường, không dấu, không cách
// module.exports =
//   mongoose.models.comment || mongoose.model("comment", CommentSchema);