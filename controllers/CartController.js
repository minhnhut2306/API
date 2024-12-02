const CartModel = require("./CartModel");
const ObjectId = require("mongoose").Types.ObjectId;
const AppConstants = require("../helpers/AppConstants");
const UserModel = require("./UserModel");
const ProductModel = require("./ProductModel");
const mongoose = require("mongoose");
// const AddressModel = require("./AddressModel");

//________________________________________APP_______________________________________

// thêm cart
const addCart = async (userId, products) => {
  try {
    const userInDB = await UserModel.findById(userId);
    if (!userInDB) {
      throw new Error("Người dùng không tồn tại");
    }

    if (!Array.isArray(products)) {
      throw new Error("Danh sách sản phẩm phải là một mảng");
    }
    const carts = await CartModel.find({ "user._id": new mongoose.Types.ObjectId(userId) });

    
    let cart = carts.find(cart =>
      cart.products.some(p => p._id.toString() === products[0].id.toString())
    );

    if (!cart) {
      cart = new CartModel({
        user: { _id: userInDB._id, name: userInDB.name },
        products: [],
        total: 0,
      });
    }

    let cartChanged = false;

    for (let index = 0; index < products.length; index++) {
      const item = products[index];
      const productId = item.id;
      const quantityToAdd = item.quantity;
      const product = await ProductModel.findById(productId);
      console.log('product', product);
      
      if (!product) {
        throw new Error(`Không tìm thấy sản phẩm với ID: ${productId}`);
      }
      if (quantityToAdd > product.quantity) {
        throw new Error(`Sản phẩm ${product.name} không đủ số lượng trong kho`);
      }

      const existingProductIndex = cart.products.findIndex(p => p._id.toString() === productId.toString());

      if (existingProductIndex > -1) {
        cart.products[existingProductIndex].quantity += quantityToAdd;
        cartChanged = true;
      } else {
        const finalPrice = product.price - (product.discount || 0);

        cart.products.push({
          _id: product._id,
          name: product.name,
          category: product.category,
          price: finalPrice,  
          quantity: quantityToAdd,
          images: product.images,
          discount: product.discount || 0,
        });
        cartChanged = true;
        console.log(`${product.name} số lượng${quantityToAdd}`);
      }
    }
    if (cartChanged) {
      cart.total = cart.products.reduce(
        (sum, product) => sum + product.price * product.quantity, 0
      );
      console.log('Total,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,' + cart.total);
      const result = await cart.save();
      console.log("lưu", result);
      return result;
    }
    return cart;

  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    throw new Error(error.message || "Thêm sản phẩm vào giỏ hàng thất bại");
  }
};




// const addCart = async (userId, products) => {
//   try {
//     // Kiểm tra xem người dùng có tồn tại không
//     const userInDB = await UserModel.findById(userId);
//     if (!userInDB) {
//       throw new Error("Người dùng không tồn tại");
//     }

//     // Kiểm tra nếu products là một mảng
//     if (!Array.isArray(products)) {
//       throw new Error("Danh sách sản phẩm phải là một mảng");
//     }

//     // Tìm giỏ hàng của người dùng, nếu không có thì tạo mới
//     let cart = await CartModel.findOne({ "user._id": userId });
//     if (!cart) {
//       cart = new CartModel({
//         user: { _id: userInDB._id, name: userInDB.name },
//         products: [],
//         total: 0,
//       });
//     }

//     let total = cart.total;

//     // Lặp qua từng sản phẩm để kiểm tra và thêm/cập nhật trong giỏ hàng
//     for (let index = 0; index < products.length; index++) {
//       const item = products[index];
//       const product = await ProductModel.findById(item.id); // Tìm sản phẩm theo ID

//       if (!product) {
//         throw new Error(`Không tìm thấy sản phẩm với ID: ${item.id}`);
//       }

//       // Kiểm tra nếu số lượng sản phẩm yêu cầu vượt quá số lượng trong kho
//       if (item.quantity > product.quantity) {
//         throw new Error(`Sản phẩm ${product.name} không đủ số lượng trong kho`);
//       }

//       // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
//       const productIndex = cart.products.findIndex(
//         (p) => p._id.toString() === product._id.toString()
//       );

//       if (productIndex >= 0) {
//         // Nếu sản phẩm đã tồn tại, cập nhật số lượng
//         cart.products[productIndex].quantity += item.quantity;

//         // Kiểm tra lại nếu số lượng trong giỏ vượt quá số lượng tồn kho
//         if (cart.products[productIndex].quantity > product.quantity) {
//           throw new Error(
//             `Sản phẩm ${product.name} không đủ số lượng để cập nhật trong giỏ hàng`
//           );
//         }
//       } else {
//         // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới
//         const productItem = {
//           _id: product._id,
//           name: product.name,
//           category: product.category,
//           price: product.price,
//           quantity: item.quantity,
//           images: product.images,
//         };

//         cart.products.push(productItem);
//       }

//       // Cập nhật tổng tiền
//       total += product.price * item.quantity;
//     }

//     // Cập nhật tổng tiền giỏ hàng
//     cart.total = total;

//     // Lưu giỏ hàng
//     const result = await cart.save();

//     return result; // Trả về kết quả khi lưu thành công
//   } catch (error) {
//     console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
//     throw new Error(error.message || "Thêm sản phẩm vào giỏ hàng thất bại");
//   }
// };

// cập nhật trangj thái đơn hàng
const updateCarts = async (id, status) => {
  try {
    const cart = await CartModel.findById(id);
    if (!cart) {
      throw new error("Không tìm thấy giỏ hàng ");
    }
    if (
      status < cart.status ||
      (status == AppConstants.CART_STATUS.HOAN_THANH &&
        (cart.status == AppConstants.CART_STATUS.XAC_NHAN ||
          cart.status == AppConstants.CART_STATUS.DANG_GIAO ||
          cart.status == AppConstants.CART_STATUS.HUY)) ||
      status > 4
    ) {
      throw new Error("Trạng thái đơn hàng không hợp lệ");
    }
    cart.status = status;
    let result = await cart.save();
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Cập nhật trạng thái đơn hàng thất bại");
  }
};
const QuanLyHangHoa = async (productQuery, userQuery) => {
  try {
    // Fetch product based on productQuery (e.g., by product ID or another unique identifier)
    const productInDB = await CartModel.findOne(productQuery).select([
      "name",
      "category",
      "price",
      "deliveryMethod",
      "orderStatus",
      "totalProductPrice",
      "totalPayment",
    ]);

    if (!productInDB) {
      console.error("Error: Sản phẩm không tồn tại");
      return { error: "Sản phẩm không tồn tại" };
    }

    // Fetch user based on userQuery (assuming userId is associated with the product in the database)
    const userInDB = await UserModel.findOne(userQuery).select("email");

    if (!userInDB) {
      console.error("Error: Người dùng không tồn tại");
      return { error: "Người dùng không tồn tại" };
    }

    // Construct response body with product and user information
    const body = {
      email: userInDB.email,
      name: productInDB.name,
      category: productInDB.category,
      price: productInDB.price,
      deliveryMethod: productInDB.deliveryMethod || "N/A",
      orderStatus: productInDB.orderStatus || "N/A",
      totalProductPrice: productInDB.totalProductPrice || 0,
      totalPayment: productInDB.totalPayment || 0,
    };

    return body;
  } catch (error) {
    console.error("Lấy danh sách sản phẩm lỗi: ", error.message);
    return { error: "Lấy danh sách sản phẩm lỗi" };
  }
};

const getAllCart = async () => {
  try {
    const carts = await CartModel.find();
    if (!carts) {
      throw new Error("Không giỏ hàng");
    }
    return carts;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách giỏ hàng:", error);
    throw new Error("Có lỗi xảy ra trong quá trình lấy giỏ hàng.");
  }
};

const getCartByUserId = async (userId) => {
  try {
    // Kiểm tra xem userId có phải là một ObjectId hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("ID người dùng không hợp lệ.");
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Tìm giỏ hàng theo userId
    const cart = await CartModel.find({ "user._id": userObjectId });

    // Kiểm tra xem có giỏ hàng nào được tìm thấy không
    if (cart.length === 0) {
      throw new Error("Không tìm thấy giỏ hàng cho người dùng này");
    }

    return cart;
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng theo ID người dùng:", error);
    throw new Error("Có lỗi xảy ra trong quá trình lấy giỏ hàng.");
  }
};

const deleteCart = async (id) => {
  try {
    const cartInDB = await CartModel.findById(id);
    if (!cartInDB) {
      throw new Error("Cart không tồn tại");
    }
    await CartModel.deleteOne({ _id: id });
    return true;
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng:", error);
    throw new Error("Xóa Cart thất bại.");
  }
};

// lấy cart
const getCarts = async () => {
  try {
    let query = {};
    const Carts = await CartModel.find(query).sort({ createdAt: -1 });
    console.log("Carts data:", Carts);
    return Carts;
  } catch (error) {
    console.log("getCarts error:", error.message);
    throw new Error("Lỗi khi lấy danh sách giỏ hàng");
  }
};

const updateCartStatus = async (cartIds, status) => {
  try {
    if (!Array.isArray(cartIds) || cartIds.length === 0) {
      throw new Error("Danh sách ID giỏ hàng không hợp lệ.");
    }

    console.log("Cart IDs:", cartIds);

    const result = await CartModel.updateMany(
      { _id: { $in: cartIds } },
      { status: status }
    );

    if (result) {
      return { message: "Cập nhật trạng thái giỏ hàng thành công", result };
    } else {
      throw new Error("Không tìm thấy giỏ hàng nào để cập nhật.");
    }
  } catch (error) { }
};
const updateCartQuantity = async (cartId, productId, quantity) => {
  try {
    if (!quantity || quantity < 1) {
      return { success: false, error: "Số lượng phải lớn hơn hoặc bằng 1." };
    }
    const cart = await CartModel.findById(cartId);

    if (!cart) {
      return { success: false, error: "Giỏ hàng không tìm thấy" };
    }
    const productIndex = cart.products.findIndex(
      (p) => p._id.toString() === productId
    );

    if (productIndex === -1) {
      return {
        success: false,
        error: "Sản phẩm không tìm thấy trong giỏ hàng",
      };
    }
    cart.products[productIndex].quantity = quantity;
    const total = cart.products.reduce((acc, product) => {
      const price = product.price || 0;
      const qty = product.quantity || 0;
      return acc + price * qty;
    }, 0);

    if (isNaN(total)) {
      throw new Error("Tổng giá trị không hợp lệ");
    }

    cart.total = total;
    const updatedCart = await CartModel.updateOne(
      { _id: cartId },
      { $set: { products: cart.products, total: total } }
    );

    if (updatedCart.modifiedCount === 0) {
      return { success: false, error: "Không có thay đổi để cập nhật" };
    }

    return { success: true, cart: cart };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Đã có lỗi xảy ra" };
  }
};

module.exports = {
  addCart,
  updateCarts,
  QuanLyHangHoa,
  getAllCart,
  deleteCart,
  getCarts,
  getCartByUserId,
  updateCartStatus,
  updateCartQuantity,
};
