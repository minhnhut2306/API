
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const AppConstants = require('../helpers/AppConstants');

const NotificationSchema = new mongoose.Schema({
    title: String,
    date: { type: Date, default: Date.now },
    status: { type: String, default: 'unread' },
    details: String
  });
module.exports = mongoose.models.notification || mongoose.model('notification',NotificationSchema);