var express = require("express");
var router = express.Router();

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
    const result = await OderController.getOrderQById(id);
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
    const { cart, userId, ship, sale } = req.body;

    if (!cart || !userId || !ship) {
      return res.status(400).json({ status: false, data: "Thiếu thông tin đơn hàng" });
    }

    const result = await OderController.addOrder(cart, userId, ship, sale);
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
    const result = await OderController.updateOrder(id, status);
    return res.status(200).json({ status: true, data: result });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ status: false, data: error.message });
  }
});

module.exports = router;
