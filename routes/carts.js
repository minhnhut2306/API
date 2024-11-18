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
router.post('/:id/update', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await CartController.updateCarts(id, status);
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

router.delete('/deleteCart/:id', async (req, res) => {
  try {
    const cartId = req.params.id;
    const result = await CartController.deleteCart(cartId);
    if (result.deletedCount === 0) {
      return res.status(404).send({ data: 'Cart item not found.', success: false });
    }
    res.status(200).send({ data: 'Xóa Cart thành công.', success: true });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).send({ data: error.message || 'Xóa Cart thất bại.', success: false });
  }
});

// lấy cart
router.get("/getCarts", async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ status: false, message: "userId is required" });
    }

    const carts = await CartController.getCartsByUserId(userId);
    console.log("Cart data:", carts);
    if (!carts || carts.length === 0) {
      return res.status(404).json({ status: false, message: "No carts found for this user" });
    }
    return res.status(200).json({ status: true, data: carts });
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