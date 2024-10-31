const CommentModel = require("./CommentModel");
const UserModel = require("./UserModel");
const ProductModel = require("./ProductModel");

const addComment = async (
  userId,
  productId,
  rating,
  comment,
  images,
  videos,
  displayName
) => {
  try {

    const userInDB = await UserModel.findById(userId);
    if (!userInDB) {
      throw new Error("Không tìm thấy user");
    }
    console.log(userInDB);
  
    const productInDB = await ProductModel.findById(productId);
    if (!productInDB) {
      throw new Error("Không tìm thấy sản phẩm");
    }
    // Kiểm tra rating hợp lệ
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating không hợp lệ, phải từ 1 đến 5" });
    }
    const commentN = new CommentModel ({
        userId,
        productId,
        rating,
        comment,
        images,
        videos,
        displayName
    });
 
    
    const newComment = new CommentModel(commentN);
    const result = await newComment.save();
    return result;


  } catch (error) {
    console.log("addComment error: ", error.massage);
    throw new Error("Thêm bình luận lỗi");
  }
};

module.exports = {
    addComment
};
