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

router.get('/getCartByID/:id', async (req, res) => {
    try {
      const userId = req.params.id; // Lấy id từ URL
      const result = await CartController.getCartById(userId); // Truyền userId vào hàm getCartById
      return res.status(200).json({ status: true, data: result });
    } catch (error) {
      console.log("Error in getCartByID:", error.message);
      return res.status(500).json({ status: false, data: error.message });
    }
  });
  
router.delete("/:id/deleteCart", async (req, res) => { // Corrected syntax here
    try {
      const { id } = req.params;
      const result = await CartController.deleteCart(id); // Call deleteCart function
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });
module.exports = router;