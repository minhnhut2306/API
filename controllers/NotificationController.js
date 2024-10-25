const { model } = require("mongoose");
const NotificationModel = require('./NotificationModel');
const ProductModel = require("./ProductModel");

// lấy tất cả thông báo 
const getNotification = async () => {
    try {
        const notifications = await NotificationModel.find();
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: err.message });
    }
}

// thêm thông báo

const addNotification = async (products, sale) => {
    try {
      let productInNotification = [];
      let totalPrice = 0; // Tổng giá gốc của các sản phẩm
      let totalSalePrice = 0; // Tổng giá giảm (sale)
      let SaleInNotification = [];
      for (let index = 0; index < products.length; index++) {
        const item = products[index];
        const product = await ProductModel.findById(item._id);
        
        // Kiểm tra xem sản phẩm có tồn tại không
        if (!product) {
          throw new Error("Product not found");
        }
  
        // Kiểm tra số lượng có lớn hơn tồn kho không
        if (item.quantity > product.quantity) {
          throw new Error(`Product ${product.name} out of stock`);
        }
  
        // Chuẩn bị dữ liệu sản phẩm để lưu vào thông báo
        const productItem = {
          _id: product._id,
          name: product.name,
          price: product.price, // Giá gốc của sản phẩm
          salePrice: sale[index] ? sale[index] : product.price, // Giá khuyến mãi (nếu có)
          quantity: item.quantity, // Số lượng sản phẩm trong đơn
        };
  
        productInNotification.push(productItem);
  
        // Cộng dồn giá gốc và giá giảm (sale) cho thông báo
        totalPrice += product.price * item.quantity;
        totalSalePrice += productItem.salePrice * item.quantity;
      }
  
      // Tạo thông báo mới
      const newNotification = new Notification({
        date: Date.now(), // Lưu ngày giờ hiện tại
        products: productInNotification, // Danh sách sản phẩm
        price: totalPrice, // Tổng giá gốc
        salePrice: totalSalePrice // Tổng giá sau khi giảm
      });
  
      // Lưu thông báo vào cơ sở dữ liệu
      await newNotification.save();
      return newNotification;
  
    } catch (error) {
      console.error("Error creating notification:", error.message);
      throw new Error(error.message); // Ném lỗi để xử lý bên ngoài
    }
  };
  
module.exports = {
    getNotification,
    addNotification
};