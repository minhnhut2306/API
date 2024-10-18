const CategoryModel = require('./CategoryModel');

// lấy danh sách danh mục
const getCategories = async () => {
    try {
        const categories = await CategoryModel.find();
        return categories;
    } catch (error) {
        console.log('getCategories error: ', error.massage);
        throw new Error('Lấy ds danh mục lỗi');
    }
}

module.exports = { getCategories };