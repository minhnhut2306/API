const OrderModel = require("./OderModel");
const CartModel = require("./CartModel");
const UserModel = require("./UserModel");
const ProductModel = require("./ProductModel");
const AddressModel = require("./AddressModel");
const { CART_STATUS } = require("../helpers/AppConstants");
const { isValidObjectId, Types } = require("mongoose");

//________________________________________APP_______________________________________

const getAllOrder = async () => {
  try {
    const orderInDB = await OrderModel.find();
    return orderInDB;
  } catch (error) {
    console.log("getAllOrder error: ", error.massage);
    throw new Error("Lấy ds đơn hàng lỗi");
  }
};

const getOrderQById = async (id) => {
  try {
    if (!id) {
      throw new Error("Vui lòng nhập id người dùng");
    }
    let query = {};
    query = {
      ...query,
      "user._id": new Types.ObjectId(id),
    };
    const orderInDB = await OrderModel.find(query);
    return orderInDB;
  } catch (error) {
    console.log("getOrderQById error: ", error.message);
    throw new Error("Lấy sản phẩm theo id người dùng không thành công");
  }
};

const addOrder = async (cart, address, ship, sale) => {
  try {
    if (!address) {
      throw new Error("Vui lòng nhập địa chỉ");
    }

    let cartInOrder = [];
    let total = 0; // Initialize the total variable here

    // Iterate over each cart item ID in the cart array
    for (const cartItemId of cart) {
      const cartItem = await CartModel.findById(cartItemId);
      if (!cartItem) {
        throw new Error("Không tìm thấy giỏ hàng");
      }

      // Retrieve the products within the cart and calculate the total price for each product
      let cartProducts = [];
      for (const productItem of cartItem.products) {
        const product = await ProductModel.findById(productItem._id);
        if (!product) {
          throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");
        }

        // Calculate total based on product price and quantity
        total += product.price * productItem.quantity; // Here, total is updated
        cartProducts.push({
          _id: product._id,
          name: product.name,
          quantity: productItem.quantity,
          price: product.price,
        });
      }

 
      cartInOrder.push({
        _id: cartItem._id,
        user: cartItem.user,
        total: cartItem.total,
        products: cartProducts,
        date: cartItem.date,
      });
    }

    let shippingFee = 0;
    if (ship === 1) {
      shippingFee = 8000;
    } else if (ship === 2) {
      shippingFee = 10000;
    } else if (ship === 3) {
      shippingFee = 20000;
    }
    let totalOrder = total + shippingFee;

    // Apply discounts if available
    let totalDiscount = 0;
    if (Array.isArray(sale)) {
      totalDiscount = sale.reduce((sum, item) => {
        if (item.discountAmount) {
          return sum + item.discountAmount;
        } else if (item.discountPercent) {
          return sum + (totalOrder * item.discountPercent) / 100;
        } else {
          return sum;
        }
      }, 0);

      totalOrder = Math.max(0, totalOrder - totalDiscount);
    } else {
      throw new Error("Sale phải là một mảng");
    }

    // Create the order
    const order = new OrderModel({
      cart: cartInOrder,
      ship,
      address: address,
      sale,
      totalOrder,
    });
    const result = await order.save();

    
    for (const cartItem of cartInOrder) {
      for (const productItem of cartItem.products) {
        const product = await ProductModel.findById(productItem._id);
        if (product) {
          // Update product quantity after purchase
          product.quantity = Math.max(product.quantity - productItem.quantity, 0);
          product.sold = (product.sold || 0) + productItem.quantity;
          await product.save();
        }
      }
    }

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Add to order failed");
  }
};







//update trạng thái đơn hàng

// const addOrder = async (cart, address, ship, sale) => {
//   try {
//     if (!address) {
//       throw new Error("Vui lòng nhập địa chỉ");
//     }
//     const cartInDB = await CartModel.findById(cart);
//     if (!cartInDB) {
//       throw new Error("Không tìm thấy giỏ hàng");
//     }
//     const addressInDB = await AddressModel.findById(address);

//     console.log(address);

//     if (!addressInDB) {
//       throw new Error("address not found");
//     }

//     let cartInOder = [];
//     let total = 0;

//     for (let index = 0; index < cart.length; index++) {
//       const item = cart[index];
//       const cartO = await CartModel.findById(item._id);
//       if (!cartO) {
//         throw new Error("Không tìm thấy giỏ hàng");
//       }
//       // Cộng dồn giá trị sản phẩm vào tổng số tiền
//       total += cartO.total || 0;
//       const cartItem = {
//         _id: cartO._id,
//         user: cartO.user,
//         total: cartO.total,
//         products: cartO.products,
//         date: cartO.date,
//       };
//       cartInOder.push(cartItem);
//     }
//     // Tính tổng số tiền giảm giá từ mảng sale
//     // Tính tổng số tiền giảm giá từ mảng sale
//     let totalOrder = total;
//     let shippingFee = 0;
//     if (ship === 1) {
//       shippingFee = 8000;
//     } else if (ship === 2) {
//       shippingFee = 10000;
//     } else if (ship === 3) {
//       shippingFee = 20000;
//     }
//     totalOrder += shippingFee; // Thêm phí vận chuyển vào tổng tiền

//     let totalDiscount = 0;
//     if (Array.isArray(sale)) {
//       totalDiscount = sale.reduce((sum, item) => {
//         if (
//           typeof item.discountAmount === "number" &&
//           item.discountAmount > 0
//         ) {
//           // Giảm giá theo số tiền cố định
//           return sum + item.discountAmount;
//         } else if (
//           typeof item.discountPercent === "number" &&
//           item.discountPercent > 0 &&
//           item.discountPercent <= 100
//         ) {
//           // Giảm giá theo % (tối đa là 100%)
//           return sum + (totalOrder * item.discountPercent) / 100;
//         } else {
//           return sum;
//         }
//       }, 0);
//       // Đảm bảo tổng giảm giá không vượt quá totalOrder
//       totalOrder -= totalDiscount;
//       if (totalOrder < 0) {
//         totalOrder = 0;
//       }
//     } // Đảm bảo tổng tiền không bị âm
//     else {
//       throw new Error("Sale phải là một mảng");
//     }
//     // Tính phí vận chuyển dựa trên giá trị của ship

//     const order = new OrderModel({
//       cart: cartInOder,
//       ship,
//       address: {
//         _id: addressInDB._id,
//         houseNumber: addressInDB.houseNumber,
//         alley: addressInDB.alley,
//         quarter: addressInDB.quarter,
//         district: addressInDB.district,
//         city: addressInDB.city,
//         country: addressInDB.country,
//       },
//       sale,
//       totalOrder,
//     });
//     const result = await order.save();

//     // Cập nhật lịch sử mua hàng của người dùng và cập nhật quantity & sold của sản phẩm
//     setTimeout(async () => {
//       try {
//         const userInDB = await UserModel.findById(cartInDB.user);

//         // Kiểm tra user tồn tại
//         if (!userInDB) {
//           throw new Error("Không tìm thấy người dùng");
//         }
        

//         for (const cartItem of cartInOder) {
//           for (const productItem of cartItem.products) {
//             const product = await ProductModel.findById(productItem.product);

//             // Kiểm tra sản phẩm tồn tại
//             if (product) {
//               // Cập nhật số lượng tồn kho và số lượng đã bán
//               product.quantity = Math.max(
//                 product.quantity - productItem.quantity,
//                 0
//               );
//               product.sold = (product.sold || 0) + productItem.quantity;
//               await product.save();

//               // Tạo lịch sử mua hàng cho người dùng
//               const purchaseHistoryItem = {
//                 _id: product._id,
//                 name: product.name,
//                 quantity: productItem.quantity,
//                 status: result.status,
//                 images: product.images || [],
//                 date: Date.now(),
//               };

//               // Thêm vào lịch sử mua hàng
//               userInDB.carts.push(purchaseHistoryItem);
//             }
//           }
//         }

//         await userInDB.save();
//       } catch (error) {
//         console.error("Lỗi khi cập nhật tồn kho hoặc lịch sử mua hàng:", error);
//       }
//     }, 0);

//     return result;
//   } catch (error) {
//     console.log(error);
//     throw new Error("Add to order failed");
//   }
// };

const updateOrder = async (id, status) => {
  try {
    const order = await OrderModel.findById(id);
    if (!order) {
      throw new error("Không tìm thấy đơn hàng ");
    }
    if (
      status < order.status ||
      (status == CART_STATUS.HOAN_THANH &&
        (order.status == CART_STATUS.XAC_NHAN ||
          order.status == CART_STATUS.DANG_GIAO ||
          order.status == CART_STATUS.HUY)) ||
      status > 4
    ) {
      throw new Error("Trạng thái đơn hàng không hợp lệ");
    }
    order.status = status;
    let result = await order.save();
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Cập nhật trạng thái đơn hàng thất bại");
  }
};

module.exports = {
  getAllOrder,
  addOrder,
  updateOrder,
  getOrderQById,
};
