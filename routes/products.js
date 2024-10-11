var express = require('express');
var router = express.Router();
const ProductController = require('../controllers/ProductController');

// ____________________________Lấy sp home_______________________

router.get('/getProducts_App', async (req, res) => {
    try {
        const products = await ProductController.getProduct_App();
        return res.status(200).json({ status: true, data: products });
    } catch (error) {
        return res.status(500).json({ status: false, data: error.message });
    }
});



module.exports = router;