const PreserveModel = require('./PreserveModel');

// lấy danh sách loại hàng
const getPreserves = async () => {
    try {
        const preserve = await PreserveModel.find();
        return preserve;
    } catch (error) {
        console.log('getPreserves error: ', error.massage);
        throw new Error('Lấy ds loại hàng lỗi');
    }
}

module.exports = { getPreserves };