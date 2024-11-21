const { model } = require("mongoose");
const AdminModel = require("./AdminModel");
const bcrypt = require("bcryptjs");
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

const changePassword = async (email, password, newPassword) => {
  try {
    // Kiểm tra đầu vào
    if (!email || !password || !newPassword) {
      throw new Error("Vui lòng nhập đầy đủ thông tin");
    }

    // Tìm user theo email
    const user = await AdminModel.findOne({ email });
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    // So sánh mật khẩu cũ trực tiếp
    if (user.password !== password) {
      throw new Error("Mật khẩu hiện tại không đúng");
    }

    // Cập nhật mật khẩu mới vào DB (không mã hóa)
    user.password = newPassword;
    await user.save();

    console.log("Đổi mật khẩu thành công");
    return { message: "Đổi mật khẩu thành công" };
  } catch (error) {
    console.error("Lỗi đổi mật khẩu:", error.message);
    throw new Error(error.message || "Có lỗi xảy ra khi đổi mật khẩu");
  }
};


module.exports = {
  loginAdmin,
  changePassword
};
