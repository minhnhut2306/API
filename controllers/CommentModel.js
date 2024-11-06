const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  user: {
    user: {type: Object, require: true},
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
      type: String, 
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
