var express = require('express');
var router = express.Router();
const notiController = require('../controllers/NotiControllers');
const NotiControllers = require('../controllers/NotiControllers');
const { AddNoti, checkUserValidity,checkOrderValidity,createOrderNotification,deletedNotification} = require('../controllers/NotiControllers');
//http://localhost:6677/notifications/6721f17f923e416414dbd895
router.delete('/:notificationId', async (req, res) => {
    const { notificationId } = req.params; // Retrieve notificationId from req.params

    try {
        const result = await notiController.deleteNotification(req, res);
        return res.status(200).json({
            message: 'Thông báo đã được xóa thành công!',
            deletedNotification: result,
        });
    } catch (error) {
        console.log('Error deleting notification:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});
// lấy thông báo 
router.get('/', async (req, res, next )=> {
    try {
        const categories = await NotiControllers .getNoti();
        return res.status(200).json({ status: true, data: categories});
    } catch (error) {
        console.log('Get categories error: ', error.massage);
        return res.status(500).json({ status: false, data: error.massage});
    }
});
//http://localhost:6677/notifications/add_notification
 // Endpoint tạo thông báo cho khuyến mãi
router.post('/add_notification', async (req, res) => {
    const { userId, promotionMessage } = req.body;

    try {
        await checkUserValidity(userId);
        const notification = await AddNoti(userId, promotionMessage);
        return res.status(201).json({
            message: 'Thông báo khuyến mãi đã được tạo thành công!',
            notification,
        });
    } catch (error) {
        console.error('Có lỗi xảy ra:', error);
        return res.status(400).json({
            message: error.message,
        });
    }
});
//http://localhost:6677/notifications/orderNotification
// Endpoint tạo thông báo cho đơn hàng
router.post('/orderNotification', async (req, res) => {
    try {
        const { userId, oderId, promotionMessage } = req.body;
        await checkUserValidity(userId);
        await checkOrderValidity(oderId);

        const notiController = await createOrderNotification(userId, oderId,promotionMessage);
        return res.status(201).json({
            message: 'Thông báo đơn hàng được tạo thành công!',
            notiController})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

 // Endpoint tạo thông báo cho khuyến mãi
// router.post('/promotion', async (req, res) => {
//     try {
//         await notiController.createPromotionNotification(req.body.userId, req.body.message);
//         res.status(200).json({ success: true, message: 'Thông báo về chương trình khuyến mãi được tạo thành công' });
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({ success: false, message: error.message });
//     }
// });

// Endpoint lấy tất cả thông báo của người dùng
//http://localhost:6677/notifications/671b544f7e165147f9d6cd6e
router.get('/:us', async (req, res) => {
    try {
        await notiController.getUserNotifications(req, res);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;