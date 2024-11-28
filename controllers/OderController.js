const OrderModel = require("./OderModel");
const CartModel = require("./CartModel");
const UserModel = require("./UserModel");
const ProductModel = require("./ProductModel");
const AddressModel = require("./AddressModel");
const { CART_STATUS } = require("../helpers/AppConstants");
const { isValidObjectId, Types } = require("mongoose");
const mongoose = require('mongoose');

//________________________________________APP_______________________________________

const getAllOrder = async () => {
  try {
    const orderInDB = await OrderModel.find().sort({
      date: - 1
    });
    return orderInDB;
  } catch (error) {
    console.log("getAllOrder error: ", error.massage);
    throw new Error("Lấy ds đơn hàng lỗi");
  }
};

const getOrderById = async (orderId) => {
  try {
    if (!orderId) {
      throw new Error("Vui lòng nhập id đơn hàng");
    }
    let query = {};
    query = {
      ...query,
      "_id": new Types.ObjectId(orderId),
    };
    const orderInDB = await OrderModel.find(query);
    return orderInDB;
  } catch (error) {
    throw new Error("Lấy đơn hàng theo id không thành công");
  }
};

const addOrder = async (cart, userId, ship, sale, totalOrder) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    let address = null;
    if (user.address && user.address.length > 0) {
      address = user.address.find((addr) => addr.available) || user.address[0];
      console.log("Địa chỉ người dùng:", address);
    } else {
      throw new Error("Người dùng chưa có địa chỉ. Vui lòng thêm địa chỉ trước khi đặt hàng.");
    }

    let cartInOrder = [];
    for (let cartItem of cart) {
      const product = await ProductModel.findById(cartItem.productId);
      if (product) {
        cartInOrder.push({
          _id: cartItem._id,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          price: product.price,
        });
      }
    }
    const order = new OrderModel({
      cart: cartInOrder,
      ship,
      address,
      sale,
      totalOrder: totalOrder, 
    });

    const result = await order.save();
    console.log("Đơn hàng đã được lưu:", result);
    for (let cartItem of cartInOrder) {
      const product = await ProductModel.findById(cartItem.productId);
      if (product) {
        product.sold = (product.sold || 0) + cartItem.quantity;
        await product.save();
      }
    }

    return result;
  } catch (error) {
    console.log("Lỗi:", error.message);
    throw new Error(error.message || "Thêm đơn hàng thất bại");
  }
};


// const addOrder = async (cart, userId, ship, sale) => {
//   try {
//     const user = await UserModel.findById(userId);
//     if (!user) {
//       throw new Error("Không tìm thấy người dùng");
//     }

//     // Kiểm tra địa chỉ của người dùng
//     let address = null;
//     if (user.address && user.address.length > 0) {
//       address = user.address.find((addr) => addr.available) || user.address[0];
//     } else {
//       throw new Error("Người dùng chưa có địa chỉ. Vui lòng thêm địa chỉ trước khi đặt hàng.");
//     }

//     // Tạo giỏ hàng cho đơn hàng
//     let cartInOrder = [];
//     let total = 0;

//     for (let itemId of cart) {
//       const cartO = await CartModel.findById(itemId);

//       if (!cartO) {
//         console.log(`Không tìm thấy giỏ hàng với id: ${itemId}`);
//         throw new Error("Không tìm thấy giỏ hàng");
//       }

//       total += cartO.total || 0;
//       const cartItem = {
//         _id: cartO._id,
//         user: cartO.user,
//         total: cartO.total,
//         products: cartO.products,
//         date: cartO.date,
//       };
//       cartInOrder.push(cartItem);
//     }

//     // Tính phí vận chuyển
//     let shippingFee = 0;
//     if (ship === 1) {
//       shippingFee = 8;
//     } else if (ship === 2) {
//       shippingFee = 10;
//     } else if (ship === 3) {
//       shippingFee = 20;
//     }
//     let totalOrder = total + shippingFee;

//     // Tính giảm giá
//     let totalDiscount = 0;
//     if (Array.isArray(sale)) {
//       totalDiscount = sale.reduce((sum, item) => {
//         if (typeof item.discountAmount === "number" && item.discountAmount > 0) {
//           return sum + item.discountAmount;
//         } else if (
//           typeof item.discountPercent === "number" &&
//           item.discountPercent > 0 &&
//           item.discountPercent <= 100
//         ) {
//           return sum + (totalOrder * item.discountPercent) / 100;
//         } else {
//           return sum;
//         }
//       }, 0);
//       totalOrder -= totalDiscount;
//       if (totalOrder < 0) {
//         totalOrder = 0;
//       }
//     } else {
//       throw new Error("Sale phải là một mảng");
//     }

//     // Tạo đơn hàng
//     const order = new OrderModel({
//       cart: cartInOrder,
//       ship,
//       address,
//       sale,
//       totalOrder,
//     });
//     const result = await order.save();

//     // Cập nhật số lượng `sold` cho các sản phẩm
//     for (let cartItem of cartInOrder) {
//       for (let productItem of cartItem.products) {
//         const productId = productItem.productId || productItem._id; // Hỗ trợ cả productId và _id
//         if (!productId) {
//           console.error(`Sản phẩm thiếu ID: ${JSON.stringify(productItem)}`);
//           continue;
//         }

//         const product = await ProductModel.findById(productId);
//         if (product) {
//           product.sold = (product.sold || 0) + productItem.quantity;
//           await product.save();
//           console.log(`Cập nhật thành công: Sản phẩm ${product.name}, Sold: ${product.sold}`);
//         } else {
//           console.error(`Không tìm thấy sản phẩm với ID: ${productId}`);
//         }
//       }
//     }
//     const userInDB = await UserModel.findById(userId);
//     if (userInDB) {
//       for (let cartItem of cartInOrder) {
//         for (let productItem of cartItem.products) {
//           const product = await ProductModel.findById(productItem.productId);
//           if (product) {
//             let newItem = {
//               _id: productItem.productId,
//               name: product.name,
//               quantity: productItem.quantity,
//               status: result.status,
//               images: product.images,
//               date: Date.now(),
//             };
//             userInDB.carts.push(newItem);
//           }
//         }
//       }
//       await userInDB.save();
//     }

//     return result;
//   } catch (error) {
//     console.log(error.message);
//     throw new Error(error.message || "Thêm đơn hàng thất bại");
//   }
// };

const updateOrder = async (id, status) => {
  try {
    console.log(`Cập nhật đơn hàng với ID: ${id}`);
    console.log(`Trạng thái mới: ${status}`);

    const order = await OrderModel.findById(id);

    if (!order) {
      console.log(`Không tìm thấy đơn hàng với ID: ${id}`);
      throw new Error("Không tìm thấy đơn hàng");
    }

    // Kiểm tra trạng thái hợp lệ
    if (
      status < order.status || // Không cho phép giảm trạng thái
      (status === CART_STATUS.HUY && order.status !== CART_STATUS.XAC_NHAN) || // Chỉ cho phép hủy khi đang ở trạng thái Xác nhận
      status > 4 // Không cho phép vượt quá trạng thái 4
    ) {
      console.log(`Trạng thái đơn hàng không hợp lệ. Trạng thái hiện tại: ${order.status}`);
      throw new Error("Trạng thái đơn hàng không hợp lệ");
    }

    // Cập nhật trạng thái
    order.status = status;
    console.log(`Trạng thái đơn hàng đã được cập nhật thành: ${status}`);

    let result = await order.save();
    console.log("Kết quả lưu đơn hàng:", result);

    return result;
  } catch (error) {
    console.log("Lỗi khi cập nhật trạng thái đơn hàng:", error.message);
    throw new Error("Cập nhật trạng thái đơn hàng thất bại");
  }
};


const getOrderByIdUserId = async (userId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("ID người dùng không hợp lệ.");
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const orders = await OrderModel.find({
      "cart.user._id": userObjectId
    });

    if (orders.length === 0) {
      throw new Error("Không tìm thấy đơn hàng cho người dùng này.");
    }

    return orders;
  } catch (error) {
    console.log("getOrderByIdUserId error: ", error.message);
    throw new Error("Lấy sản phẩm theo ID người dùng không thành công.");
  }
};


module.exports = {
  getAllOrder,
  addOrder,
  updateOrder,
  getOrderById,
  getOrderByIdUserId
};
