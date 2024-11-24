const CommentModel = require("./CommentModel");
const UserModel = require("./UserModel");
const ProductModel = require("./ProductModel");
const AppConstants = require('../helpers/AppConstants');
const OrderModel = require("./OderModel"); // Thêm tham chiếu đến model đơn hàng

const addComment = async (userId, productId, orderId, rating, comment, images, videos, displayName) => {
  try {
    // Kiểm tra userId
    const userInDB = await UserModel.findById(userId);
    if (!userInDB) {
      throw new Error("Không tìm thấy người dùng");
    }

    // Kiểm tra productId
    const productInDB = await ProductModel.findById(productId);
    if (!productInDB) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    // Kiểm tra orderId
    const orderInDB = await OrderModel.findById(orderId);
    if (!orderInDB) {
      throw new Error("Không tìm thấy đơn hàng");
    }

    // Kiểm tra trạng thái đơn hàng
    if (orderInDB.status !== AppConstants.CART_STATUS.HOAN_THANH) {
      throw new Error("Chỉ có thể đánh giá sản phẩm sau khi đơn hàng được hoàn thành");
    }

    // Kiểm tra rating hợp lệ
    if (rating < 1 || rating > 5) {
      throw new Error("Rating không hợp lệ, phải nằm trong khoảng từ 1 đến 5");
    }

    // Tạo comment mới
    const newComment = new CommentModel({
      user: {
        id: userId,
        name: userInDB.name || "Ẩn danh",
      },
      productId,
      orderId,
      rating,
      comment,
      images, // Lưu ảnh đã tải lên
      videos, // Lưu video đã tải lên
      displayName,
    });

    // Lưu vào database
    const result = await newComment.save();
    return result;
  } catch (error) {
    console.error("addComment error: ", error.message);
    throw new Error(`Thêm bình luận lỗi: ${error.message}`);
  }
};

module.exports = {
  addComment,
};
