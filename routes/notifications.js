var express = require('express');
var router = express.Router();
const notiController = require('../controllers/NotiControllers');

// lấy thông báo 

// router.get('/', async (req, res, next )=> {
//     try {
//         const categories = await NotificationController.getCategories();
//         return res.status(200).json({ status: true, data: categories});
//     } catch (error) {
//         console.log('Get categories error: ', error.massage);
//         return res.status(500).json({ status: false, data: error.massage});
//     }
// });
router.post('/add_notification', async (req, res, next) => {
    try {
        const { product, sale } = req.body;
        const result = await NotificationController.addNotification(product, sale);
        return res.status(200).json({ status: true, data: result });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ status: false, data: error.message });
    }
});

// Endpoint tạo thông báo cho đơn hàng
router.post('/notifications/order', async (req, res) => {
    try {
        await notiController.createOrderNotification(req.body.orderId);
        res.status(200).json({ success: true, message: 'Thông báo về đơn hàng thành công ' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Endpoint tạo thông báo cho khuyến mãi
router.post('/notifications/promotion', async (req, res) => {
    try {
        await notiController.createPromotionNotification(req.body.userId, req.body.message);
        res.status(200).json({ success: true, message: 'Thông báo về chương trình khuyến mãi được tạo thành công' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Endpoint lấy tất cả thông báo của người dùng
router.get('/notifications/:userId', async (req, res) => {
    try {
        await notiController.getUserNotifications(req, res);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
