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
    // Kiểm tra user có tồn tại không
    const userInDB = await UserModel.findById(userId);
    if (!userInDB) {
      throw new Error("Không tìm thấy user");
    }
    console.log(userInDB);

    // Kiểm tra sản phẩm có tồn tại không
    const productInDB = await ProductModel.findById(productId);
    if (!productInDB) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    // Kiểm tra rating hợp lệ
    if (rating < 1 || rating > 5) {
      throw new Error("Rating không hợp lệ, phải từ 1 đến 5");
    }

    // Tạo bình luận mới
    const newComment = new CommentModel({
      userId,
      productId,
      rating,
      comment,
      images,
      videos,
      displayName
    });

    // Lưu bình luận vào cơ sở dữ liệu
    const result = await newComment.save();
    return result;

  } catch (error) {
    console.log("addComment error: ", error.message); 
    throw new Error("Thêm bình luận lỗi");
  }
};

module.exports = {
  addComment
};
