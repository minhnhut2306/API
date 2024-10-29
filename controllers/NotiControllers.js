// notiController.js
const Notification = require('./notiModel'); // Import notiModel
const Order = require('./OderModel'); // Giả sử bạn đã có model cho đơn hàng
// Tạo thông báo cho đơn hàng thành công
exports.createOrderNotification = async (orderId) => {
    try {
        const order = await Order.findById(orderId).populate('user'); // Lấy thông tin đơn hàng và người dùng
        if (!order) throw new Error('Không có đơn hàng');

        const notification = new Notification({
            user: order.user, // Sử dụng đối tượng user từ đơn hàng
            title: 'Đơn hàng thành công',
            message: `Đơn hàng của bạn với tổng số tiền là ${order.total} đã được xác nhận.`,
            type: 1, // 1 cho thông báo đơn hàng
        });

        await notification.save();
        console.log('Thông báo tạo đơn hàng thành công');
    } catch (error) {
        console.error('Lỗi khi tạo thông báo đơn hàng', error);
    }
};

// Tạo thông báo cho chương trình khuyến mãi mới
exports.createPromotionNotification = async (user, promotionMessage) => {
    try {
        const notification = new Notification({
            user: { _id: user }, // Tạo đối tượng user với ID
            title: 'Chương trình khuyến mãi mới',
            message: promotionMessage,
            type: 2, // 2 cho thông báo khuyến mãi
        });

        await notification.save();
        console.log('Thông báo tạo chương trình khuyến mãi thành công');
    } catch (error) {
        console.error('Lỗi khi tạo chương trình khuyến mãi', error);
    }
};

// Lấy tất cả thông báo của người dùng
exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ 'user._id': req.params.user }); // Sử dụng user._id để truy vấn
        res.status(200).json({ success: true, notifications });
    } catch (error) {
        console.error('Lỗi khong lấy được thông báo', error);
        res.status(500).json({ success: false, message: 'Không kết nối được' });
    }
};