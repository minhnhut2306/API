var express = require('express');
var router = express.Router();
const validation = require('../middlewares/Validation');
const ProductController = require('../controllers/ProductController');

// ____________________________Lấy sp home_______________________
// http://localhost:6677/products/getProducts_App
router.get('/getProducts', async (req, res) => {
    try {
        const products = await ProductController.getProduct();
        return res.status(200).json({ status: true, data: products });
    } catch (error) {
        return res.status(500).json({ status: false, data: error.message });
    }
});
// =================================================================================================================



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
// =================================================================================================================

// Lấy top 10 sp bán chạy nhất trong app

router.get('/getTopProductSell', async (req, res, next) => {
    try {
      
       const products = await ProductController.getTopProductSell_Web();
       return res.status(200).json({ status: true, data: products });
    } catch (error) {
       return res.status(500).json({ status: false, data: error.message });
    }
 });
 // =================================================================================================================

//  __________________________________searech____________________________________--
//http://localhost:6677/products/search?key=coca
// Tìm kiến sản phẩm theo từ khóa (SEARCH)
router.get('/search', async (req, res, next) => {
    try {
        const { key } = req.query;
        // console.log('dfshdjbvhd', key);
        const products = await ProductController.findProductsByKey_App(key);
        console.log(products);
        return res.status(200).json({ status: true, data: products });
    } catch (error) {
        console.log('Tìm kiếm sản phẩm thất bại');
        return res.status(500).json({ status: false, data: error.message });
    }
})
// =================================================================================================================
// thêm sản phẩm

// xóa sp theo id
router.delete('/:id/delete', async (req, res, next ) => {
    try {
        const { id } = req.params;
        const products = await ProductController.deleteProduct(id);
        return res.status(200).json({ success : true, data: products});
    } catch (error) {   
        return res.status(500).json({ success : false, data: error.massage});
    }
});






router.post('/addSP', [validation.validateProduct], async (req, res, next) => {
    try {
        const { name, price, quantity, category , images ,supplier,oum,fiber,origin,preserve,uses,description } = req.body;
        const product = await ProductController.addProduct(name, price, quantity, images, description, category,oum,fiber,origin,preserve,uses,supplier);
        return res.status(200).json({ status: true, data: product });
    } catch (error) {
        return res.status(500).json({ status: false, data: error.message });
    }
});




///////////////////////

// update sp 


router.put('/:id/update', [validation.validateProduct], async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, price, quantity, images, description, category, oum, supplier, fiber, origin, preserve, Uses, discount} = req.body;
        // console.log('---------->' + req.body + "   " + category)
        const product = await ProductController.updateProduct(id, name, price, quantity, images, description, category, oum, supplier, fiber, origin, preserve, Uses, discount);
        return res.status(200).json({ status: true, data: product });
    } catch (error) {
        return res.status(500).json({ status: false, data: error.message });
    }
})

// id,
// name,
// price,
// quantity,
// images,
// description,
// category,
// oum,
// supplier,
// fiber,
// origin,
// preserve,
// Uses,
// discount

module.exports = router;