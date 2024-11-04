// notiController.js
const Notification = require("./notiModel"); // Import notiModel
const Order = require("./OderModel"); // Giả sử bạn đã có model cho đơn hàng
const User = require("../controllers/UserModel");

const deleteNotification = async (req, res) => {
  try {
      const { notificationId } = req.params;
      const result = await Notification.findByIdAndDelete(notificationId);
      if (!result) {
          throw new Error('Notification not found');
      }
      return result; // Ensure this returns to the router
  } catch (error) {
      throw new Error('Error deleting notification: ' + error.message);
  }
};


// Tạo thông báo cho đơn hàng thành công
const createOrderNotification = async (userId,oderId ,promotionMessage) => {
  // // Kiểm tra các tham số
  // if (!userId) {
  //   console.error("Người dùng không hợp lệ.");
  //   throw new Error("Người dùng không hợp lệ.");
  // }
  // if (!orderId) {
  //   console.error("Đơn hàng không hợp lệ.");
  //   throw new Error("Đơn hàng không hợp lệ.");
  // }

  if (!promotionMessage || typeof promotionMessage !== "string") {
    console.error("Thông điệp đơn hàng không hợp lệ.");
    throw new Error("Thông điệp đơn hàng không hợp lệ.");
  }

  try {
    const notiController = new Notification({
      userId: userId,
      oderId: oderId, 
      title: "Đơn hàng đã được đặt",
      message: promotionMessage,
      type: 1, // 2 cho thông báo đơn hàng
    });

    const savedNotification = await notiController.save();
    console.log("Thông báo tạo chương trình tạo đơn hàng thành công");
    return savedNotification; // Trả về thông báo đã lưu
  } catch (error) {
    console.error("Lỗi khi tạo chương trình đơn hàng:", error.message);
    throw error; // Ném lỗi lên cao hơn nếu cần
  }
};

// Tạo thông báo cho chương trình khuyến mãi mới
const AddNoti = async (userId, promotionMessage) => {
  // Kiểm tra các tham số
  if (!userId) {
    console.error("Người dùng không hợp lệ.");
    throw new Error("Người dùng không hợp lệ.");
  }

  if (!promotionMessage || typeof promotionMessage !== "string") {
    console.error("Thông điệp khuyến mãi không hợp lệ.");
    throw new Error("Thông điệp khuyến mãi không hợp lệ.");
  }

  try {
    const notification = new Notification({
      userId: userId, // Đảm bảo user là ID hợp lệ
      oderId:  " ",
      title: "Chương trình khuyến mãi mới",
      message: promotionMessage,
      type: 2, // 2 cho thông báo khuyến mãi
    });

    const savedNotification = await notification.save();
    console.log("Thông báo tạo chương trình khuyến mãi thành công");
    return savedNotification; // Trả về thông báo đã lưu
  } catch (error) {
    console.error("Lỗi khi tạo chương trình khuyến mãi:", error.message);
    throw error; // Ném lỗi lên cao hơn nếu cần
  }
};

// Lấy tất cả thông báo của người dùng
const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    // Kiểm tra xem userId có hợp lệ không
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "ID người dùng không hợp lệ" });
    }

    // Tìm thông báo dựa trên userId
    const notifications = await Notification.find({ userId: userId });

    // Kiểm tra nếu không tìm thấy thông báo nào
    if (!notifications || notifications.length === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Không tìm thấy thông báo cho người dùng này",
        });
    }
    // Chỉ trả về danh sách title và message của thông báo
    const responseNotifications = notifications.map((noti) => ({
      title: noti.title,
      message: noti.message,
    }));
    ;

    // Trả về danh sách thông báo nếu thành công
    res
      .status(200)
      .json({ success: true, data: responseNotifications });
  } catch (error) {
    console.error("Lỗi khi lấy thông báo của người dùng:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Lỗi máy chủ khi lấy thông báo" });
  }
};
const checkUserValidity = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Người dùng không tồn tại.");
    }
    return user;
  } catch (error) {
    console.error("Lỗi khi kiểm tra người dùng:", error.message);
    throw error;
  }
};
const checkOrderValidity = async (oderId) => {
  try {
    const order = await Order.findById(oderId);
    if (!order) {
      throw new Error("Đơn hàng không tồn tại.");
    }
    return order;
  } catch (error) {
    console.error("Lỗi khi kiểm tra Đơn hàng:", error.message);
    throw error;
  }
};
module.exports = {
  AddNoti,
  checkUserValidity,
  getUserNotifications,
  createOrderNotification,
  checkOrderValidity,
  deleteNotification
};
