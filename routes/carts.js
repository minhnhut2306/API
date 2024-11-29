var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
//http://localhost:6677/carts
const CartController = require('../controllers/CartController');
const CartModel = require('../controllers/CartModel');

router.post('/addCart_App', async (req, res) => {
  try {
    // Lấy dữ liệu từ body request
    const { user, products } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!user) {
      return res.status(400).json({ status: false, message: "Thiếu thông tin người dùng" });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ status: false, message: "Danh sách sản phẩm không hợp lệ" });
    }

    // Gọi hàm xử lý thêm sản phẩm vào giỏ hàng
    const result = await CartController.addCart(user._id, products);

    // Trả về kết quả thành công và thông tin giỏ hàng
    return res.status(200).json({
      status: true,
      message: "Thêm sản phẩm vào giỏ hàng thành công",
      data: result,
    });
  } catch (error) {
    console.error("Lỗi tại endpoint /addCart_App:", error.message);

    // Trả về lỗi server
    return res.status(500).json({
      status: false,
      message: "Đã xảy ra lỗi trong quá trình thêm sản phẩm vào giỏ hàng",
      error: error.message,
    });
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
router.get('/getcartbyiduser/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await CartController.getCartByUserId(userId);
    console.log('cart', cart);

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/deleteCart/:id', async (req, res) => {
  try {
    const cartId = req.params.id;
    if (!cartId) {
      return res.status(400).send({ data: 'Cart ID is required.', success: false });
    }
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

router.get('/getCartById', async (req, res) => {
  const { cartIds } = req.query;

  if (!cartIds) {
    return res.status(400).json({ message: 'Không có ID giỏ hàng' });
  }

  const ids = cartIds.split(',');
  try {
    const carts = await CartModel.find({ '_id': { $in: ids } });
    if (!carts || carts.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
    }
    res.json(carts);
  } catch (error) {
    console.error('Lỗi khi lấy giỏ hàng:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

router.put('/updatesatus', async (req, res) => {
  try {
    const { cartIds, status } = req.body;
    const data = await CartController.updateCartStatus(cartIds, status);
    return res.json(createResponse(200, "Cập nhật thành công", "success", data));
  } catch (error) {

  }
});

router.put('/updateQuantity/:cartId/:productId', async (req, res) => {
  const { cartId, productId } = req.params;
  const { quantity } = req.body;

  const result = await CartController.updateCartQuantity(cartId, productId, quantity);
  console.log('Cart quantity updated', result);
  

  if (result.success) {
      return res.json(result);
  } else {
      return res.status(404).json(result);
  }
});

module.exports = router;