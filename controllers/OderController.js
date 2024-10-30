const OrderModel = require("./OderModel");
const CartModel = require("./CartModel");
const UserModel = require("./UserModel");
const ProductModel = require("./ProductModel");
const AddressModel = require("./AddressModel");
const { CART_STATUS } = require("../helpers/AppConstants");
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

const addOrder = async (cart, address, ship, sale) => {
  try {
    if (!address) {
      throw new Error("Vui lòng nhập địa chỉ");
    }
    const cartInDB = await CartModel.findById(cart);
    if (!cartInDB) {
      throw new Error("Không tìm thấy giỏ hàng");
    }
    const addressInDB = await AddressModel.findById(address);

    console.log(address);

    if (!addressInDB) {
      throw new Error("address not found");
    }

    let cartInOder = [];
    let total = 0;

    for (let index = 0; index < cart.length; index++) {
      const item = cart[index];
      const cartO = await CartModel.findById(item._id);
      if (!cartO) {
        throw new Error("Không tìm thấy giỏ hàng");
      }
      // Cộng dồn giá trị sản phẩm vào tổng số tiền
      total += cartO.total || 0;
      const cartItem = {
        _id: cartO._id,
        user: cartO.user,
        total: cartO.total,
        products: cartO.products,
        date: cartO.date,
      };
      cartInOder.push(cartItem);
    }
    // Tính tổng số tiền giảm giá từ mảng sale
    // Tính tổng số tiền giảm giá từ mảng sale
    let totalOrder = total;
    let shippingFee = 0;
    if (ship === 1) {
      shippingFee = 8000;
    } else if (ship === 2) {
      shippingFee = 10000;
    } else if (ship === 3) {
      shippingFee = 20000;
    }
    totalOrder += shippingFee; // Thêm phí vận chuyển vào tổng tiền

    let totalDiscount = 0;
    if (Array.isArray(sale)) {
      totalDiscount = sale.reduce((sum, item) => {
        if (
          typeof item.discountAmount === "number" &&
          item.discountAmount > 0
        ) {
          // Giảm giá theo số tiền cố định
          return sum + item.discountAmount;
        } else if (
          typeof item.discountPercent === "number" &&
          item.discountPercent > 0 &&
          item.discountPercent <= 100
        ) {
          // Giảm giá theo % (tối đa là 100%)
          return sum + (totalOrder * item.discountPercent) / 100;
        } else {
          return sum;
        }
      }, 0);
      // Đảm bảo tổng giảm giá không vượt quá totalOrder
      totalOrder -= totalDiscount;
      if (totalOrder < 0) {
        totalOrder = 0;
      }
    } // Đảm bảo tổng tiền không bị âm
    else {
      throw new Error("Sale phải là một mảng");
    }
    // Tính phí vận chuyển dựa trên giá trị của `ship`

    const order = new OrderModel({
      cart: cartInOder,
      ship,
      address: {
        _id: addressInDB._id,
        houseNumber: addressInDB.houseNumber,
        alley: addressInDB.alley,
        quarter: addressInDB.quarter,
        district: addressInDB.district,
        city: addressInDB.city,
        country: addressInDB.country,
      },
      sale,
      totalOrder,
    });
    const result = await order.save();

    // Cập nhật lịch sử mua hàng của người dùng
    const userInDB = await UserModel.findById(cartInDB.user);
    if (userInDB) {
      for (let item of cartInOder) {
        const product = await ProductModel.findById(item._id);
        if (product) {
          let newItem = {
            _id: item._id,
            name: product.name,
            quantity: item.quantity,
            status: result.status,
            images: product.images,
            date: Date.now(),
          };
          userInDB.carts.push(newItem);
        }
      }

      await userInDB.save();
    }
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Add to order failed");
  }
};

//update trạng thái đơn hàng
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
};
