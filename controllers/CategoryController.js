const CategoryModel = require("./CategoryModel")

//________________________________________APP_______________________________________


const getCategories = async () => {
    try {
      const categoryInDB = await CategoryModel.find();
      return categoryInDB;
    } catch (error) {
      console.log('getCategories error: ', error.massage);
        throw new Error('Lấy ds danh mục lỗi');
    }
}
module.exports = {
  getCategories
};