// khai báo 1 schema cho users
// (_id, email, password, name, role, carts, createdAt, updatedAt, available)
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
// const CartSchema = require("./CartModel");
const AddressSchema = require("./AddressModel");
// const UserSchema = new Schema({
//   email: { type: String, required: true, unique: true }, // required (dữ liệu cần truyền vô)
//   password: { type: String, required: true },
//   name: { type: String, required: true },
//   phone: { type: String, required: true },
//   address:[AddressSchema],
//   bio: { type: String, default: "" }, // tiểu sử
//   gender: { type: String, default: "" },
//   birthday: { type: String, required: false },
//   //lịch sử mua hàng
//   //{id, date, total, status}
//   carts: { type: Array, default: [] },
//   // ngày giờ tạo
//   createdAt: { type: Date, default: Date.now },
//   // ngày giờ cập nhật
//   updatedAt: { type: Date, default: Date.now },
//   // tài khoản còn hoạt động hay không
//   available: { type: Boolean, default: true },
//   // giỏ hàng tạm
//   carts: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "carts",
//     required: true,
//   },
// });
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: [AddressSchema],
  bio: { type: String, default: "" },
  gender: { type: String, default: "" },
  birthday: { type: String, required: false },
  // carts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }], // Chuyển thành mảng ObjectId
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
  // carts: [CartSchema]
});


// tiếng anh, số ít, chữ thường, không dấu, không cách
module.exports = mongoose.models.user || mongoose.model("user", UserSchema);
