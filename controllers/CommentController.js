const CommentModel = require("./CommentModel");
const UserModel = require("./UserModel");
const ProductModel = require("./ProductModel");

// Function to add a comment
const addComment = async (req, res) => {
  const { userId, productId, rating, comment, images, videos, displayName } = req.body; // Get data from request body

  try {
    // Check if the user exists
    const userInDB = await UserModel.findById(userId);
    if (!userInDB) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    // Check if the product exists
    const productInDB = await ProductModel.findById(productId);
    if (!productInDB) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating không hợp lệ, phải từ 1 đến 5" });
    }

    // Create new comment
    const commentN = new CommentModel({
      userId,
      productId,
      rating,
      comment,
      images,
      videos,
      displayName,
    });

    // Save the comment to the database
    await commentN.save();

    // Respond with the created comment
    return res.status(201).json(commentN);
  } catch (error) {
    console.error("addComment error: ", error.message);
    return res.status(500).json({ message: "Thêm bình luận thất bại" });
  }
};

// Function to get all comments for a specific product
const getAllComment = async (req, res) => {
  const { productId } = req.params;
  try {
    // Find comments by productId
    const comments = await CommentModel.find({ productId: productId });
    return res.status(200).json(comments);
  } catch (error) {
    console.error("getAllComment error: ", error.message);
    return res.status(500).json({ message: "Lấy bình luận thất bại" });
  }
};

module.exports = {
  addComment,
  getAllComment,
};
