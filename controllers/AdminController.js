const { model } = require("mongoose");
const AdminModel = require("./AdminModel");

const loginAdmin = async (email, password, adminID) => {
  try {
    // lấy user trong Database
    const admin = await AdminModel.findOne({ email: email });
    if (!admin) {
      throw new Error("Email không tồn tại");
      return null;
    } const checkID = await AdminModel.findOne({ adminID: adminID });
      if (!checkID) {
        throw new Error("ID Admin không tồn tại");
      } else {
        // kiểm tra password
        // const check = user.password.toString() === password.toString();

        const check = AdminModel.findOne({ password: password });

        if (check) {
          console.log("Đăng nhập thành công:", admin);
          // xóa filed password trc khi trả về
          delete admin._doc.password;

          // //return = {
          //     _id: user._id;
          //     email: user.email;
          //     name: user.name;
          //     role: user.role;
          //     carts: usert.carts;

          // }
          return admin;
        }
      }

      // } else {
      //     return null;
      // }
   
  
  } catch (error) {
    console.log("Đăng nhập thất bại", error.message);
    throw new Error("Đăng nhập thất bại");
  }
};

module.exports = {
  loginAdmin,
};
