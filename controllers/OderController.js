const OrderModel = require("./OderModel");
const CartModel = require("./CartModel");
const AddressModel = require("./AddressModel");
//________________________________________APP_______________________________________

const getCategories = async () => {
  try {
    const categoryInDB = await CategoryModel.find();
    return categoryInDB;
  } catch (error) {
    console.log("getCategories error: ", error.massage);
    throw new Error("Lấy ds danh mục lỗi");
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
   
    let totalDiscount = 0;
        if (Array.isArray(sale)) {
            totalDiscount = sale.reduce((sum, item) => {
                return (typeof item.amount === "number" && item.amount > 0) ? sum + item.amount : sum;
            }, 0);
        } else {
            throw new Error("Sale phải là một mảng");
        }

    let totalOrder = total - totalDiscount; // Use total instead of totalOrder here

    if (totalOrder < 0) {
      totalOrder = 0; // Đảm bảo tổng tiền không bị âm
    }

    // Tính phí vận chuyển dựa trên giá trị của `ship`
    let shippingFee = 0;
    if (ship === 1) {
      shippingFee = 8000;
    } else if (ship === 2) {
      shippingFee = 10000;
    } else if (ship === 3) {
      shippingFee = 20000;
    }
    totalOrder += shippingFee; // Thêm phí vận chuyển vào tổng tiền

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

    // Cập nhật tồn kho và lịch sử mua hàng
    // for (let index = 0; index < cartInOder.length; index++) {
    //     const item = cartInOder[index];
    //     const product = await Ca.findById(item._id);
    //     if (product) {
    //         product.quantity -= item.quantity;
    //         await product.save();
    //     }
    // }

    // // Cập nhật thông tin người dùng
    // for (let index = 0; index < cartInOder.length; index++) {
    //     const item = cartInOder[index];
    //     const product = await ProductModel.findById(item._id);
    //     if (product) {
    //         let newItem = {
    //             _id: item._id,
    //             name: product.name,
    //             quantity: item.quantity,
    //             status: result.status,
    //             images: product.images,
    //             date: Date.now(),
    //         };
    //         userInDB.carts.push(newItem);
    //     }
    // }
    //     userInDB.carts.push(newItem);
      
    //   await userInDB.save();
   

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Add to order failed");
  }
};

module.exports = {
  getCategories,
  addOrder,
};
