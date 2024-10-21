var express = require('express');
var router = express.Router();

const AddressController = require('../controllers/AddressController');


/**
 * lấy ds tất cả danh mục
 * method: get
 * url: http://localhost:6677/categories
 * trả về: 
 */
router.get('/', async (req, res, next )=> {
    try {
        const address = await AddressController.getAddress();
        return res.status(200).json({ status: true, data: address});
    } catch (error) {
        console.log('Get address error: ', error.massage);
        return res.status(500).json({ status: false, data: error.massage});
    }
});

module.exports = router;
