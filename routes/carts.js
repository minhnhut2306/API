var express = require('express');
var router = express.Router();
//http://localhost:6767/carts
const CartController = require('../controllers/CartController');

router.post('/addCart_App', async (req, res, next) => {
    try {
        const { user, products } = req.body;
        const result = await CartController.addCart(user, products);
        return res.status(200).json({ status: true, data: result });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ status: false, data: error.message });
    }
})
module.exports = router;