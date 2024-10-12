var express = require('express');
var router = express.Router();
const ProductController = require('../controllers/ProductController');

// ____________________________Lấy sp home_______________________
// http://localhost:6677/products/getProducts_App
router.get('/getProducts_App', async (req, res) => {
    try {
        const products = await ProductController.getProduct_App();
        return res.status(200).json({ status: true, data: products });
    } catch (error) {
        return res.status(500).json({ status: false, data: error.message });
    }
});



// lấy sp chi tiết theo id
router.get('/getProductDetailById_App/:id', async(req, res, next) => {
    try {
        const { id } = req.params;
        const product = await ProductController.getProductDetailById_App(id);
        return res.status(200).json({ success : true, products: product});
    } catch (error) {   
        return res.status(500).json({ success : false, products: error.massage});
    }
});

// Lấy top 10 sp bán chạy nhất trong app

router.get('/getTopProductSell_App', async(req, res, next) => {
      try {
        const products = await ProductController.getTopProductSell_App(name,sold);
        return res.status(200).json({ status: true, data: products });
    } catch (error) {
        return res.status(500).json({ status: false, data: error.message });
    }
});




module.exports = router;