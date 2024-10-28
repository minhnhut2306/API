var express = require('express');
var router = express.Router();

const AddressController = require('../controllers/AddressController');


/**
 * lấy ds tất cả danh mục
 * method: get
 * url: http://localhost:6677/categories
 * trả về: 
 */
router.get('/', async (req, res, next) => {
    try {
        const address = await AddressController.getAddress();
        return res.status(200).json({ status: true, data: address });
    } catch (error) {
        console.log('Get address error: ', error.massage);
        return res.status(500).json({ status: false, data: error.massage });
    }
});

router.post('/addAddress', async (req, res, next) => {
    try {
        const {

            houseNumber,
            alley,
            quarter,
            district,
            city,
            country,

        } = req.body;

        // Giả sử AddressController được sử dụng để thêm địa chỉ mới
        const result = await AddressController.addAddress(

            houseNumber,
            alley,
            quarter,
            district,
            city,
            country,

        );

        return res.status(200).json({ status: true, data: result });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ status: false, data: error.message });
    }
});


module.exports = router;
