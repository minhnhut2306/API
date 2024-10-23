const { model } = require("mongoose");
const notification = require('./NotificationModel');

// lấy tất cả thông báo 
const getNotification = async()=>{
    try {
        const notifications = await Notification .find();
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: err.message });
    }
}
module.exports = {
    getNotification
  };