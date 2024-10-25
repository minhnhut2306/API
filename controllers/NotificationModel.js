
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const AppConstants = require('../helpers/AppConstants');

const NotificationSchema = new mongoose.Schema({

  // date:{type:Number,default:Date.now},
  // products: {type: Array, default: []},
  // sale:{type: Array, default: []},
  date: { type: Date, default: Date.now }, // Sử dụng Date để lưu ngày tháng năm.
   products: {type: Array, default: []},
  price: { type: Number, required: true }, // Giá sản phẩm
  // salePrice: { type: Number, required: true }, // Giá khuyến mãi
  sale: {type: Array, default: []},
  });
module.exports = mongoose.models.notification || mongoose.model('notification',NotificationSchema);