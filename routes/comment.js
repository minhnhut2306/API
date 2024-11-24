const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/CommentController");

/**
 * API thêm bình luận sản phẩm
 * method: POST
 * url: /api/comments/addComment
 */
router.post("/addComment", async (req, res) => {
  try {
    const { userId, productId, orderId, rating, comment, images, videos, displayName } = req.body;

    // Gọi controller để thêm comment
    const newComment = await CommentController.addComment(
      userId,
      productId,
      orderId,
      rating,
      comment,
      images,
      videos,
      displayName
    );

    return res.status(200).json({
      status: true,
      message: "Thêm bình luận thành công",
      data: newComment,
    });
  } catch (error) {
    console.error("Thêm bình luận error: ", error.message);
    return res.status(500).json({
      status: false,
      message: `Lỗi thêm bình luận: ${error.message}`,
    });
  }
});

module.exports = router;
