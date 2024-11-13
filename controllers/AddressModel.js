// khai báo 1 schema cho users
// (_id, email, password, name, role, carts, createdAt, updatedAt, available)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const AddressSchema = new Schema({
    // user: {type: Object, require: true},
    houseNumber: { type: String, required: true },
    alley: { type: String, required: true },
    quarter: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    // ngày giờ tạo
    createdAt: { type: Date, default: Date.now },
    // ngày giờ cập nhật
    updatedAt: { type: Date, default: Date.now },
    // tài khoản còn hoạt động hay không
    available: { type: Boolean, default: true },
    // giỏ hàng tạm
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",required: true,
      },
});
// tiếng anh, số ít, chữ thường, không dấu, không cách
module.exports = mongoose.models.address || mongoose.model('address', AddressSchema);