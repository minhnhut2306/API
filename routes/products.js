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

router.get('/getTopProductSell_', async (req, res, next) => {
    try {
      
       const products = await ProductController.getTopProductSell_App();
       return res.status(200).json({ status: true, data: products });
    } catch (error) {
       return res.status(500).json({ status: false, data: error.message });
    }
 });
 
//  __________________________________searech____________________________________--
//http://localhost:6677/products/search?key=coca
// Tìm kiến sản phẩm theo từ khóa (SEARCH)
router.get('/search', async (req, res, next) => {
    try {
        const { key } = req.query;
        // console.log('dfshdjbvhd', key);
        const products = await ProductController.findProducts_App(key);
        console.log(products);
        return res.status(200).json({ status: true, data: products });
    } catch (error) {
        console.log('Tìm kiếm sản phẩm thất bại');
        return res.status(500).json({ status: false, data: error.message });
    }
})


module.exports = router;