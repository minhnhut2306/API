
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const AppConstants = require('../helpers/AppConstants');

const OderSchema = new Schema({
    // { id, name }
   user: {type: Object, required: true},
   total: { type: Number, default: 0},
   // {id, name, price, quantity}
   products: { type: Array, default: []},
    // 1: xác nhận, 2: đang giao, 3: hoàn thành, 4: hủy
   status: { type: Number, default: AppConstants.CART_STATUS.XAC_NHAN},
   //Ngày giờ mua
   date: { type: Date, default: Date.now},

});
module.exports = mongoose.models.oder || mongoose.model('oder',OderSchema);