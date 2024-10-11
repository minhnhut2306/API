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
module.exports = {getProduct_App}
