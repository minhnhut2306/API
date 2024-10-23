
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const AppConstants = require('../helpers/AppConstants');

const NotificationSchema = new mongoose.Schema({

  date:{type:Number,default:Date.now},
  products: {type: Array, default: []},
  sale:{type: Array, default: []},

  });
module.exports = mongoose.models.notification || mongoose.model('notification',NotificationSchema);