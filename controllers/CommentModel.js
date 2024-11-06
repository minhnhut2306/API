const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  user: {
    user: { type: Object, require: true },
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
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
      type: String,
      required: false,
    },
  ],
  displayName: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the schema directly, without creating a model
module.exports = CommentSchema;
