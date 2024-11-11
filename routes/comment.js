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



router.get("/", async (req, res, next) => {
  try {
    const preserves = await PreserveController.getPreserves();
    return res.status(200).json({ status: true, data: preserves });
  } catch (error) {
    console.log("Get categories error: ", error.massage);
    return res.status(500).json({ status: false, data: error.massage });
  }
});
router.get('/products/:id/comments', async (req, res) => {
 const { productId } = req.params; 
  try {
    const comments = await CommentController.getAllComment(productId);
    res.status(200).json(comments); 
  } catch (error) {
    res.status(500).json({ message: error.message }); 
  }
});



module.exports = router;
