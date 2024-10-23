var express = require("express");
var router = express.Router();
//http://localhost:6677/carts
const SaleController = require("../controllers/SaleController");

router.post("/addSale", async (req, res, next) => {
  try {
    const {
      date,
      title,
      discountAmount,
      discountPercent,
      minOrderValue,
      expirationDate,
      isExpired,
    } = req.body;
    const result = await SaleController.addSale(
      date,
      title,
      discountAmount,
      discountPercent,
      minOrderValue,
      expirationDate,
      isExpired
    );
    return res.status(200).json({ status: true, data: result });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ status: false, data: error.message });
  }
});

router.get("/getSale", async (req, res, next) => {
  try {
    const result = await SaleController.getSale();
    return res.status(200).json({ status: true, data: result });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ status: false, data: error.message });
  }
});

//http://localhost:6677/sale/6717c7f3a1f4c464236749ed/getDetailSale
router.get("/:id/getDetailSale", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await SaleController.getDetailSale(id);
    return res.status(200).json({ status: true, data: result });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ status: false, data: error.message });
  }
});

router.delete("/:id/deleteSale", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await SaleController.deleteSale(id);
    return res.status(200).json({ status: true, data: result });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ status: false, data: error.message });
  }
});

router.put("/:id/updateSale", async (req, res, next) => {
  try {
    const { id } = req.params;
  
    const {
      date,
      title,
      discountAmount,
      discountPercent,
      minOrderValue,
      expirationDate,
      isExpired,
    } = req.body;
    const result = await SaleController.updateSale(
      id,
      date,
      title,
      discountAmount,
      discountPercent,
      minOrderValue,
      expirationDate,
      isExpired
    );
    return res.status(200).json({ status: true, data: result });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ status: false, data: error.message });
  }
});

// cập nhật trạng thái đơn hàng
// router.put('/:id/update',async(req,res,next)=>{
//     try {
//         const{id} =req.params;
//         const{status} = req.body;
//         const result = await CartController.updateCarts(id,status);
//         return res.status(200).json({ status: true, data: result });

//     } catch (error) {
//         console.log(error.message);
//         return res.status(500).json({ status: false, data: error.message });

//     }
// })
module.exports = router;
