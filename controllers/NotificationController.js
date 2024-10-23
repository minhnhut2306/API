const { model } = require("mongoose");
const notification = require('./NotificationModel');
const ProductModel = require("./ProductModel");

// lấy tất cả thông báo 
const getNotification = async()=>{
    try {
        const notifications = await Notification .find();
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: err.message });
    }
}

// thêm thông báo

const addNotification = async(products,sale)=>{
    try {
      let productInNotification = [];
      

    } catch (error) {
        
    }
}
module.exports = {
    getNotification
  };