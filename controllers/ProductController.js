const { isValidObjectId } = require('mongoose');
const ProductModel = require('./ProductModel');

//________________________________________APP_______________________________________

//Lấy danh sách sản phẩm (HOME)

const getProduct_App = async () => {
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

// thống kê top 10 sp bán chạy nhiều nhất 
const getTopProductSell_App = async () => {
    try {
      let query = {};
      const products = await ProductModel.find(query, " name, sold")
        .sort({ sold: -1 })
        .limit(10);
        
      return products;
    } catch (error) {
      console.log("getTopProduct error: ", error.massage);
      throw new Error("Lấy sp lỗi");
    }
  };
  
 
module.exports = {getProduct_App, getProductDetailById_App, getTopProductSell_App }
