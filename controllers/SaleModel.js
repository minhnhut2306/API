
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const AppConstants = require('../helpers/AppConstants');

const SaleSchema = new mongoose.Schema({
    //ngày tạo
    createAt: { type: Date, default: Date.now },
    // 
    date: { type: Date, required: true },
        // tiêu đề
    title: { type: String, default: '' },
    // Số tiền giảm cố định
    discountAmount: { type: Number, default: 0 },
    // Giảm theo phần trăm
    discountPercent: { type: Number, default: 0 },
    // Giá trị đơn hàng tối thiểu
    minOrderValue: { type: Number, default: 0 },
    // Thời gian hết hạn khuyến mãi
    expirationDate: { type: Date, required: true},
    // Xác định khuyến mãi hết hạn
    // isExpired: { type: Boolean, default: true },
});
module.exports = mongoose.models.sale || mongoose.model('sale', SaleSchema);