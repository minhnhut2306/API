var express = require("express");
var router = express.Router();

const CommentController = require("../controllers/CommentController");

/**
 * lấy ds tất cả loại hàng
 * method: get
 * url: http://localhost:6677/categories
 * trả về:
 */
// router.post("/addComment", async (req, res, next) => {
//   try {
//     const { userId, productId, rating, comment, images, videos, displayName } = req.body;
//     const comments = await CommentController.addComment(userId, productId, rating, comment, images, videos, displayName);
//     return res.status(200).json({ status: true, data: comments });
//   } catch (error) {
//     console.log("Thêm bình luận error: ", error.massage);
//     return res.status(500).json({ status: false, data: error.massage });
//   }
// });

// router.post("/:id/updateComment", async (req, res, next) => {
//   try {
//     const { userId, productId, rating, comment, images, videos, displayName } = req.body;
//     const comments = await CommentController.addComment(userId, productId, rating, comment, images, videos, displayName);
//     return res.status(200).json({ status: true, data: comments });
//   } catch (error) {
//     console.log("Thêm bình luận error: ", error.massage);
//     return res.status(500).json({ status: false, data: error.massage });
//   }
// });



module.exports = router;
