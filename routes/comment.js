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
    const { userId, productId, rating, comment, images, videos, displayName } = req.body;
    const comments = await CommentController.addComment(userId, productId, rating, comment, images, videos, displayName);
    return res.status(200).json({ status: true, data: comments });
  } catch (error) {
    console.error("Thêm bình luận error: ", error);
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

router.get('/getcommentbyuserid/:userid', async (req, res) => {
  try {
    const { userid } = req.params; 
    const result = await CommentController.getComments(userid); 
    console.log('result', result);
    
    
    if (result.status) {
      return res.status(200).json({
        status: true,
        data: result.data, 
      });
    } else {
      return res.status(404).json({
        status: false,
        message: result.message, 
      });
    }
  } catch (error) {
    console.error('Error getting comments:', error.message);
    return res.status(500).json({
      status: false,
      message: 'Có lỗi xảy ra khi lấy bình luận.',
    });
  }
});

module.exports = router;
