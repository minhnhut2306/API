var express = require("express");
var router = express.Router();

const CommentController = require("../controllers/CommentController");

/**
 * lấy ds tất cả loại hàng
 * method: get
 * url: http://localhost:6677/categories
 * trả về:
 */
router.post("/addComment", async (req, res, next) => {
  try {
    const { userId, productId, rating, comment, images, videos } = req.body;
    console.log("Received data:", { userId, productId, rating, comment, images, videos }); // Log dữ liệu nhận được
    const comments = await CommentController.addComment(userId, productId, rating, comment, images, videos);
    return res.status(200).json({ status: true, data: comments });
  } catch (error) {
    console.error("Thêm bình luận error: ", error); // Log toàn bộ đối tượng error
    return res.status(500).json({ status: false, message: error.message || "Có lỗi xảy ra" });
  }
});

router.get("/", async (req, res, next) => {
  try {
    const preserves = await PreserveController.getPreserves();
    return res.status(200).json({ status: true, data: preserves });
  } catch (error) {
    console.log("Get categories error: ", error.massage);
    return res.status(500).json({ status: false, data: error.massage });
  }
});

module.exports = router;
