// notiController.js
const Notification = require('./notiModel'); // Import notiModel
const Order = require('./OderModel'); // Giả sử bạn đã có model cho đơn hàng
const User = require('../controllers/UserModel');
// Tạo thông báo cho đơn hàng thành công
const AddNotiSucces = async (orderId) => {
    try {
      // Fetch order information along with associated user data
      const order = await Order.findById(orderId).populate('user', 'email'); // Only populate 'email' field if needed
      if (!order) {
        console.error('Không có đơn hàng');
        return;
      }
  
      // Create and save notification
      const notification = new Notification({
        user: order.user._id, // Only use the user ID
        title: 'Đơn hàng thành công',
        message: `Đơn hàng của bạn với tổng số tiền là ${order.total} đã được xác nhận.`,
        type: 1, // 1 for order notification type
      });
  
      await notification.save();
      console.log('Thông báo tạo đơn hàng thành công');
    } catch (error) {
      console.error('Lỗi khi tạo thông báo đơn hàng:', error.message);
    }
  };    
  

// Tạo thông báo cho chương trình khuyến mãi mới
const AddNoti = async (user, promotionMessage) => {
    // Kiểm tra các tham số
    if (!user) {
        console.error('Người dùng không hợp lệ.');
        throw new Error('Người dùng không hợp lệ.');
    }

    if (!promotionMessage || typeof promotionMessage !== 'string') {
        console.error('Thông điệp khuyến mãi không hợp lệ.');
        throw new Error('Thông điệp khuyến mãi không hợp lệ.');
    }

    try {
        const notification = new Notification({
            user: { _id: user._id }, // Đảm bảo user là ID hợp lệ
            title: 'Chương trình khuyến mãi mới',
            message: promotionMessage,
            type: 2, // 2 cho thông báo khuyến mãi
    });

        const savedNotification = await notification.save();
        console.log('Thông báo tạo chương trình khuyến mãi thành công');
        return savedNotification; // Trả về thông báo đã lưu
    } catch (error) {
        console.error('Lỗi khi tạo chương trình khuyến mãi:', error.message);
        throw error; // Ném lỗi lên cao hơn nếu cần
    }
};


// Lấy tất cả thông báo của người dùng
const getNoti = async () => {
    try {
        const notifications = await Notification.find(); // Sử dụng user._id để truy vấn
        if(!notifications){
            throw new Error('Thông báo không tồn tại.');
        }
        return notifications;
    } catch (error) {
        console.error('Lỗi khong lấy được thông báo', error);
        throw new Error('Thông tồn tại.');
    }
};
const checkUserValidity = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('Người dùng không tồn tại.');
        }
        return user;
    } catch (error) {
        console.error('Lỗi khi kiểm tra người dùng:', error.message);
        throw error;
    }
};
module.exports = {
    AddNoti,
    getNoti,
    checkUserValidity
};