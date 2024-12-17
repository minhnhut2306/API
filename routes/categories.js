var express = require('express');
var router = express.Router();

const CategoryController = require('../controllers/CategoryController');


/**
 * lấy ds tất cả danh mục
 * method: get
 * url: http://localhost:6677/categories
 * trả về: 
 */
router.get('/', async (req, res, next )=> {
    try {
        const categories = await CategoryController.getCategories();
        return res.status(200).json({ status: true, data: categories});
    } catch (error) {
        console.log('Get categories error: ', error.massage);
        return res.status(500).json({ status: false, data: error.massage});
    }
});

module.exports = router;
