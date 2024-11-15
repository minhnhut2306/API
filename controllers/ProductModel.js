// khai báo 1 schema(model) cho product
// (_id, name, price, quantity, createAt, updateAt)
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const CommentSchema = require("./CommentModel")

const ProductSchema = new Schema({
  name: { type: String, require: true },
  price: { type: Number, require: true, default: 0 },
  quantity: { type: Number, default: 0,  require: true },
  images: { type: Array, default: [],  require: false, },
  description: { type: String, default: "", require: false }, //mô tả
  category: { type: Object, default: {} }, //danh mục
  oum: { type: String, default: " ", require: false }, //đơn vị đo
  supplier: { type: String, default: "", require: false }, //nhà cung cấp
  fiber: { type: String, default: "", require: false }, //chất sơ
  origin: { type: String, default: "", require: false }, //xuất xứ
  preserve: { type: Object, default: {} },
  uses: { type: String, default: "", require: false }, //công dụng
  discount: { type: String }, //giảm giá
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  sold: { type: Number, require: true },
  comments: [CommentSchema],
});

//tiếng anh, số ít, chữ thường, không dấu, không cách
module.exports =
  mongoose.models.product || mongoose.model("product", ProductSchema);
