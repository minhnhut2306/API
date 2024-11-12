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
  user,
  houseNumber,
  alley,
  quarter,
  district,
  city,
  country
) => {
  try {
    // Kiểm tra các thông tin cần thiết
    if (
      !user ||
      !houseNumber ||
      !alley ||
      !quarter ||
      !district ||
      !city ||
      !country
    ) {
      throw new Error("Vui lòng cung cấp đầy đủ thông tin địa chỉ");
    }

    const userInDB = await UserModel.findById(user);
    if (!userInDB) {
      throw new Error("không tìm thấy người dùng");
    }
 
    const addressData = new AddressModel({
      user: { _id: userInDB._id, name: userInDB.name},
      houseNumber,
      alley,
      quarter,
      district,
      city,
      country,
    });

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
