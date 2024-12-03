var express = require("express");
var router = express.Router();
const mongoose = require('mongoose');
const OderController = require("../controllers/OderController");

router.get("/getAllOrder", async (req, res, next) => {
  try {
    const result = await OderController.getAllOrder();
    return res.status(200).json({ status: true, data: result });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ status: false, data: error.message });
  }
});

router.get("/:id/getOrderById", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await OderController.getOrderById(id);  
    return res.status(200).json({ status: true, data: result });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ status: false, data: error.message });
  }
});


/**
 * lấy ds tất cả danh mục
 * method: get
 * url: http://localhost:6677/categories
 * trả về:
 */
router.post("/addOrder", async (req, res, next) => {
  try {       
    const { cart, userId, ship, sale, totalOrder } = req.body;

    if (!cart || !userId || !ship || totalOrder === undefined) {
      return res.status(400).json({ status: false, data: "Thiếu thông tin đơn hàng" });
    }

    const result = await OderController.addOrder(cart, userId, ship, sale, totalOrder);
    return res.status(200).json({ status: true, data: result });
  } catch (error) {
    console.error("Error in addOrder:", error.message);
    return res.status(500).json({ status: false, data: error.message });
  }
});



// cập nhật trạng thái đơn hàng
router.post("/:id/updateOrder", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Log thông tin đầu vào
    console.log(`Cập nhật đơn hàng với ID: ${id}`);
    console.log(`Trạng thái mới: ${status}`);

    const result = await OderController.updateOrder(id, status);

    // Log kết quả trả về
    console.log('Kết quả cập nhật đơn hàng:', result);

    return res.status(200).json({ status: true, data: result });
  } catch (error) {
    // Log thông tin lỗi
    console.log('Lỗi khi cập nhật đơn hàng:', error.message);
    return res.status(500).json({ status: false, data: error.message });
  }
});

router.get('/getorderbyuserid/:id', async (req, res) => {
  try {
    const { id: userId } = req.params;
    const result = await OderController.getOrderByIdUserId(userId);
    console.log('result', result);

    res.status(200).json(result);
  } catch (error) {
    console.log('getOrderByIdUserId error:', error.message);
    res.status(500).json({ message: "Lỗi khi lấy đơn hàng theo ID người dùng." });
  }
});

module.exports = router;
