const AddressModel = require("./AddressModel");
const UserModel = require("./UserModel");

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
  userId,
  houseNumber,
  alley,
  quarter,
  district,
  city,
  country
) => {
  try {
    // Tìm user trong cơ sở dữ liệu
    const userInDB = await UserModel.findById(userId);
    if (!userInDB) {
      throw new Error("Không tìm thấy user");
    }

    // Tạo đối tượng địa chỉ
    const addressData = {
      userId,
      houseNumber,
      alley,
      quarter,
      district,
      city,
      country,
    };

    // Thêm đối tượng địa chỉ vào mảng `address` của user
    userInDB.address.push(addressData);

    // Lưu lại tài liệu người dùng sau khi thêm địa chỉ
    const result = await userInDB.save();
    return result;
  } catch (error) {
    console.error("addAddress error: ", error.message);
    throw new Error("Thêm địa chỉ thất bại: " + error.message);
  }
};

const deleteAddress = async (id) => {
  try {
    const addresstInDB = await AddressModel.findById(id);
    if (!addresstInDB) {
      throw new Error("Địa chỉ không tồn tại");
    }
    await AddressModel.deleteOne({ _id: id });
    return true;
  } catch (error) {
    console.log("deleteAddress: ", error);
    throw new Error("Xóa địa chỉ lỗi");
  }
};

// add
const addAddressesText = async (userId, addresses) => {
  try {
    // Kiểm tra nếu có userId
    if (!userId) {
      throw new Error("User ID không hợp lệ");
    }

    // Tạo danh sách địa chỉ từ mảng `addresses`
    const addressData = addresses.map(address => ({
      userId,
      houseNumber: address.houseNumber,
      alley: address.alley,
      quarter: address.quarter,
      district: address.district,
      city: address.city,
      country: address.country,
    }));

    // Lưu tất cả các địa chỉ vào cơ sở dữ liệu
    const result = await AddressModel.insertMany(addressData);
    return result;
  } catch (error) {
    console.error("Error adding addresses: ", error.message);
    throw new Error("Không thể thêm địa chỉ: " + error.message);
  }
};

module.exports = { getAddress, addAddress,deleteAddress,addAddressesText };