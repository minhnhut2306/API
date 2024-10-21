const AddressModel = require('./AddressModel');

// lấy danh sách danh mục
const getAddress = async () => {
    try {
        const address = await AddressModel.find();
        return address;
    } catch (error) {
        console.log('getAddress error: ', error.massage);
        throw new Error('Lấy địa chỉ thất bại');
    }
}

module.exports = { getAddress };