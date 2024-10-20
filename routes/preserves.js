var express = require('express');
var router = express.Router();

const PreserveController = require('../controllers/PreserveController');


/**
 * lấy ds tất cả loại hàng
 * method: get
 * url: http://localhost:6677/categories
 * trả về: 
 */
router.get('/', async (req, res, next )=> {
    try {
        const preserves = await PreserveController.getPreserves();
        return res.status(200).json({ status: true, data: preserves});
    } catch (error) {
        console.log('Get categories error: ', error.massage);
        return res.status(500).json({ status: false, data: error.massage});
    }
});

module.exports = router;
