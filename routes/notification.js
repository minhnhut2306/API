var express = require('express');
var router = express.Router();
const NotificationController = require('../controllers/NotificationController')

// lấy thông báo 

router.get('/', async (req, res, next )=> {
    try {
        const categories = await NotificationController.getCategories();
        return res.status(200).json({ status: true, data: categories});
    } catch (error) {
        console.log('Get categories error: ', error.massage);
        return res.status(500).json({ status: false, data: error.massage});
    }
});

module.exports = router;
