const CartModel = require("./CartModel");
const ObjectId = require("mongoose").Types.ObjectId;
const AppConstants = require("../helpers/AppConstants");
const UserModel = require("./UserModel");
const ProductModel = require("./ProductModel");
// const AddressModel = require("./AddressModel");

//________________________________________APP_______________________________________

//thêm cart
const addCart = async (user, products) => {
  try {
    const userInDB = await UserModel.findById(user);
    if (!userInDB) {
      throw new Error("User not found");
    }

    if (!Array.isArray(products)) {
      throw new Error("Products must be an array");
    }

    let productsInCart = [];
    let total = 0;

    for (let index = 0; index < products.length; index++) {
      const item = products[index];
      const product = await ProductModel.findById(item.id);
      if (!product) {
        throw new Error("Không tìm thấy sản phẩm");
      }

      if (item.quantity > product.quantity) {
        throw new Error("Vượt quá số lượng trong kho");
      }

      const productItem = {
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        category_id: product.category._id,  
        category_name: product.category.category_name,  
        image: product.image, 
    };

      productsInCart.push(productItem);
      total += product.price * item.quantity;
    }

    const cart = new CartModel({
      user: { _id: userInDB._id, name: userInDB.name },
      products: productsInCart,
      total,
    });

    const result = await cart.save();

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Add to cart failed");
  }
};

// cập nhật trangj thái đơn hàng 
const updateCarts = async (id, status) => {
  try {
    const cart = await CartModel.findById(id);
    if (!cart) {
      throw new error("Không tìm thấy giỏ hàng ");

    }
    if (status < cart.status ||
      (status == AppConstants.CART_STATUS.HOAN_THANH &&
        (cart.status == AppConstants.CART_STATUS.XAC_NHAN ||
          cart.status == AppConstants.CART_STATUS.DANG_GIAO ||
          cart.status == AppConstants.CART_STATUS.HUY)) ||
      status > 4) {
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
    const productInDB = await CartModel.findOne(productQuery).select(['name', 'category', 'price', 'deliveryMethod', 'orderStatus', 'totalProductPrice', 'totalPayment']);

    if (!productInDB) {
      console.error("Error: Sản phẩm không tồn tại");
      return { error: "Sản phẩm không tồn tại" };
    }

    // Fetch user based on userQuery (assuming userId is associated with the product in the database)
    const userInDB = await UserModel.findOne(userQuery).select('email');

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
      totalPayment: productInDB.totalPayment || 0
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
      if(!carts){
        throw new Error("Không giỏ hàng");
      }
      return carts
  } catch (error) {
      console.error("Lỗi khi lấy danh sách giỏ hàng:", error); // In chi tiết lỗi ra console
      throw new Error("Có lỗi xảy ra trong quá trình lấy giỏ hàng.");
  }
};


const deleteCart = async (id) =>{
try {
  const cartInDB = await CartModel.findById(id);
  if(!cartInDB){
    throw new Error('Cart không tồn tại');
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

module.exports = {
  addCart,
  updateCarts,
  QuanLyHangHoa,
  getAllCart,
  deleteCart,
  getCarts
};
