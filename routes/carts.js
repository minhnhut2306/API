var express = require('express');
var router = express.Router();
//http://localhost:6677/carts
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
});
router.get('/QuanLiHangHoa', async (req, res) => {
    try {
      const result = await CartController.QuanLyHangHoa();
      return res.status(200).json({ status: true, data: result });
  } catch (error) {
      console.log(error.message);
      return res.status(500).json({ status: false, data: error.message });
  }
  });
// 
  router.get('/getAllCarts', async (req, res) => {
    try {
        const result = await CartController.getAllCart();
        return res.status(200).json({ status: true, data: result });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ status: false, data: error.message });
    }
});

router.delete("/deleteCart/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await CartController.deleteCart(id);
        return res.status(200).json({ success: true, data: cart });
    } catch (error) {
        return res.status(500).json({ success: false, data: error.message });
    }
  });
  
  // lấy cart
  router.get("/getCarts", async (req, res, next) => {
    try {
      const cart = await CartController.getCarts();
      if (!cart || cart.length === 0) {
        console.log("No carts found");
      }
      return res.status(200).json({ status: true, data: cart });
    } catch (error) {
      console.error("Get carts error:", error);
      return res.status(500).json({
        status: false,
        message: "Lỗi khi lấy danh sách giỏ hàng",
        error: error.message, 
      });
    }
  });

module.exports = router;