// khai báo 1 schema cho users
// (_id, email, password, name, role, carts, createdAt, updatedAt, available)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true }, // required (dữ liệu cần truyền vô)
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone:{type: String, required: true},
    address:{type: Array,  default: [ ]},
    bio:{type: String, required:false}, // tiểu sử
    gender:{type: String, required:true},
    birthday:{type: String, required:false}, 

    //lịch sử mua hàng
    
    //{id, date, total, status}
    carts: { type: Array, default: [ ] },
    // ngày giờ tạo
    createdAt: { type: Date, default: Date.now },
    // ngày giờ cập nhật
    updatedAt: { type: Date, default: Date.now },
    // tài khoản còn hoạt động hay không
    available: { type: Boolean, default: true },
    // giỏ hàng tạm
});
// tiếng anh, số ít, chữ thường, không dấu, không cách
module.exports = mongoose.models.user || mongoose.model('user', UserSchema);