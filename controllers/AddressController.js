const AddressModel = require("./AddressModel");

// lấy danh sách danh mục
const getAddress = async () => {
  try {
    const address = await AddressModel.find();
    return address;
  } catch (error) {
    console.log("getAddress error: ", error.massage);
    throw new Error("Lấy địa chỉ thất bại");
  }
};

// Thêm đại chỉ ,mới
const addAddress = async (
  houseNumber,
  alley,
  quarter,
  district,
  city,
  country
) => {
  try {

    // Kiểm tra các thông tin cần thiết
    // if (!houseNumber || !alley || !quarter || !district || !city || !country) {
    //   throw new Error("Vui lòng cung cấp đầy đủ thông tin địa chỉ");
    // }

    // Tạo đối tượng Address để lưu
    const addressData = {
      houseNumber,
      alley,
      quarter,
      district,
      city,
      country,
    };
    console.log(addressData);

    const newAddress = new AddressModel(addressData);
    console.log(newAddress);

    const result = await newAddress.save();
    return result;
  } catch (error) {
    console.error("addAddress error: ", error.message);
    throw new Error("Thêm địa chỉ thất bại: " + error.message);
  }
};

module.exports = { getAddress, addAddress };