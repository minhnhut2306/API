// khai báo 1 schema cho users
// (_id, email, password, name, role, carts, createdAt, updatedAt, available)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const AdminSchema = new Schema({
    email: { type: String, required: true, unique: true }, // required (dữ liệu cần truyền vô)
    password: { type: String, required: true },
    adminID: { type: String, required: true},
    // ngày giờ tạo
    createdAt: { type: Date, default: Date.now },
    // ngày giờ cập nhật
    updatedAt: { type: Date, default: Date.now },
    // tài khoản còn hoạt động hay không
    available: { type: Boolean, default: true },
    // giỏ hàng tạm
});
// tiếng anh, số ít, chữ thường, không dấu, không cách
module.exports = mongoose.models.admin || mongoose.model('admin', AdminSchema);