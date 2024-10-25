var express = require('express');
var router = express.Router();
const NotificationController = require('../controllers/NotificationController')

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
module.exports = router;
