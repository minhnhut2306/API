
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AppConstants = require('../helpers/AppConstants');

const OderSchema = new Schema({
    // { id, name }
// //id, name
//{id, name, price, quantity}
cart: {type: Object, default: {}},
//1 xác nhận, 2: đang giao, 3: hoàn thành, 4: hủy
status: {type: Number, default: AppConstants.CART_STATUS.XAC_NHAN},
//gho chú
note: { type: String, default: ''},
//hình thức vận chuyển
ship: {type: Number, default: AppConstants.Shipping_method.GIAO_CHAM, require: true },
//Địa chỉ
address: {type: Object, require: true},
//khuyến mãi
sale: {type: Array, default: []},
//ngày giờ mua
date: {type: Date, default: Date.now},
//tổng thanh toán
totalOrder: {type: Number, default: 0},
images: { type: Array, default: [],  require: false, },
});
module.exports = mongoose.models.oder || mongoose.model('oder',OderSchema);