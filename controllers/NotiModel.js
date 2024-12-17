// models/NotificationModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Notichema = new Schema({
    userId: { type: Object, required: true },
    oderId:{type: Object, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: Number, required: true }, // 1 cho đơn hàng, 2 cho khuyến mãi
    date: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
});

module.exports = mongoose.model('Notification', Notichema);
