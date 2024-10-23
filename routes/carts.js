var express = require('express');
var router = express.Router();
//http://localhost:6677/carts
const CartController = require('../controllers/CartController');

router.post('/addCart_App', async (req, res, next) => {
    try {
        const { user, products, address } = req.body;
        const result = await CartController.addCart(user, products, address);
        return res.status(200).json({ status: true, data: result });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ status: false, data: error.message });
    }
});

// cập nhật trạng thái đơn hàng 
router.post('/:id/update',async(req,res,next)=>{
    try {
        const{id} =req.params;
        const{status} = req.body;
        const result = await CartController.updateCarts(id,status);
        return res.status(200).json({ status: true, data: result });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ status: false, data: error.message });

        
        
    }
})


module.exports = router;