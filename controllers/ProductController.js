const { isValidObjectId } = require('mongoose');
const ProductModel = require('./ProductModel');

//________________________________________APP_______________________________________

//Lấy danh sách sản phẩm (HOME)

const getProduct = async () => {
    try {
        let query = {};
        query = {
            ...query,
        }
        const products = await ProductModel
            .find(query)
        return products;
    } catch (error) {
        console.log('getProducts error: ', error.message);
        throw new Error('Lấy danh sách sản phẩm lỗi');
    }
}

//Lấy chi tiết sản phẩm
// =================================================================================================================

const getProductDetailById_App = async (id) => {
    try {
        const productInDB = await ProductModel.findById(id);
        if (!productInDB) {
            throw new Error("Không tìm thấy sp");
        }
        return productInDB;
    } catch (error) {
        console.log('getProducts error: ', error.message);
        throw new Error('Lấy danh sách sản phẩm lỗi');
    }
}
// =================================================================================================================

// thống kê top 10 sp bán chạy nhiều nhất 
const getTopProductSell_Web = async () => {
    try {
      let query = {};
      const products = await ProductModel.find(query, ' name sold')
        .sort({ sold: -1 })
        .limit(10);
        
      return products;
    } catch (error) {
      console.log("getTopProduct error: ", error.massage);
      throw new Error("Lấy sp lỗi");
    }
  };
  // =================================================================================================================

   
  
//   _________________search___________________

// =================================================================================================================

// const findProducts_App = async (key) => {
//     try {
//         let query = {};

//         query = {
//             ...query,
//             name: { $regex: key, $options: 'i' }
//         }

//         const products = await ProductModel
//             .find(query,'name,price,images,uom')
//         // .sort({ name: -1 });
//         return products;

//     } catch (error) {
//         console.log('findProduct error: ', error.message);
//         throw new Error('Tìm kiếm sản phẩm không thành công');
//     }
// 

// =================================================================================================================
const findProductsByKey_App = async (key) => {
    try {
        // Tạo câu truy vấn tìm kiếm
        let query = {
            name: { $regex: key, $options: 'i' } // Tìm kiếm tên sản phẩm theo từ khóa (không phân biệt hoa thường)
        };
        
        // Chỉ định các trường cần lấy ra từ cơ sở dữ liệu
        const products = await ProductModel
            .find(query)
            .select('name price image oum'); // Chỉ lấy các trường name, price, image, và oum
        
        return products;
    } catch (error) {
        console.log('getProducts error: ', error.message);
        throw new Error('Lấy danh sách sản phẩm lỗi');
    }
// <<<<<<< HEAD
} ;

// xóa sản phẩm 
// Xóa sp theo id
const deleteProduct = async (id) => {
   
    try {
      // tìm sản phẩm theo id
   
      const productInDB = await ProductModel.findById(id);
    
      if (!productInDB) {
        throw new Error("Sản phẩm không tồn tại");
      }
      //Xóa sp
      await ProductModel.deleteOne({ _id: id });
      return true;
    } catch (error) {
      console.log("deleteProduct: ", error);
      throw new Error("Xóa sp lỗi");
    }
  };
// <<<<<<< HEAD
// module.exports = {getProduct, getProductDetailById_App, getTopProductSell_Web,findProductsByKey_App, deleteProduct }
// =======
// module.exports = {getProduct_App, getProductDetailById_App, getTopProductSell_Web,findProductsByKey_App, deleteProduct }
// =======
// }
// =================================================================================================================
const addProduct = async (name, price, quantity, images, description) => {
    try {
        // Kiểm tra xem tất cả các trường cần thiết có được cung cấp hay không
        if (!name || !price || !quantity || !images || !description) {
            throw new Error('Vui lòng cung cấp đầy đủ thông tin sản phẩm');
        }

        // Tạo đối tượng sản phẩm
        const product = {
            name,
            price,
            quantity,
            images,
            description,
        };

        // Tạo một sản phẩm mới từ đối tượng product
        const newProduct = new ProductModel(product);
        
        // Lưu sản phẩm vào cơ sở dữ liệu
        const result = await newProduct.save();
        
        return result; // Trả về sản phẩm mới đã được lưu
    } catch (error) {
        console.error('addProduct error: ', error.message);
        throw new Error('Thêm sản phẩm thất bại: ' + error.message); // Ném lại lỗi để có thể xử lý ở nơi khác
    }
};

module.exports = {getProduct, getProductDetailById_App, getTopProductSell_Web,findProductsByKey_App,addProduct }
// >>>>>>> branhNgan
// >>>>>>> 97d4f4aa4fc33971739dc1fb2ec44c40924dc59e
