const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/CommentController");
const imagesRouter = require("./images");  // Import imagesRouter



router.post("/addComment", async (req, res) => {
  try {
    const { userId, productId, orderId, rating, comment, displayName } = req.body;
    const images = req.body.images || [];  // Mảng ảnh từ client gửi lên
    const videos = req.body.videos || [];  // Mảng video từ client gửi lên

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

// Sử dụng imagesRouter cho các API tải ảnh/video
router.use("/images", imagesRouter);

module.exports = router;
