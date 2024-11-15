const userModel = require('./UserModel')
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");


// const register = async (email, password, name, phone) => {
//   try {
//     //check email
//     let user = await userModel.findOne({ email: email }); // = select * from userModel Where email = email
//     if (user) {
//       throw new Error("Email đã tồn tại");
//     }
//     if ( 
//       email == "" ||
//       email == undefined ||
//       name == "" ||
//       name == undefined ||
//       password == "" ||
//       password == undefined ||
//       phone == ""
//     ) {
//       throw new Error("Email hoặc password hoặc name không hợp lệ!");
//     }
//     // kiểm tra định dạng email, password
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;
//     const phoneRegex = /^[0-9]{10,11}$/;

//     if (!emailRegex.test(email)) {
//       throw new Error("Email không đúng định dạng");
//     }
//     // if (!passwordRegex.test(password)) {
//     //     throw new Error('Password không đúng định dạng')
//     // }
//     if (!phoneRegex.test(phone)) {
//       throw new Error("Số điện thoại không đúng định dạng");
//     }
//     // mã hóa password
//     const salt = bcrypt.genSaltSync(10);
//     console.log(salt);
//     password = bcrypt.hashSync(password, salt);
//     // tạo mới user
//     user = new userModel({
//       email: email,
//       password: password,
//       name: name,
//       phone: phone,
//     });
//     //save name
//     const result = await user.save();

//     const verificationCode = Math.floor(1000 + Math.random() * 9000).toString(); // Mã gồm 4 chữ số
//     const message = `Mã xác thực của bạn là: ${verificationCode}`;

//     // Gửi SMS
//     await sendSMS(phone, message);
//     // gửi email xác thực tk
//     // setTimeout(async() => {
//     //     const data = {
//     //         email: email,
//     //         subject: `Xác thực tài khoản ${email}`,
//     //         content: html.html('Phát')
//     //     }
//     //     await sendMail(data);
//     // }, 0);
//     return result;
//   } catch (error) {
//     console.log("Register error: ", error.message);
//     throw new Error("Đăng ký thất bại");
//   }
// };

// http://localhost:6677/users/register

const register = async (email, password, name, phone) => {
  try {
    // Kiểm tra các biến đầu vào
    if (!email || !password || !name || !phone) {
      throw new Error("Email, password, name và phone không được để trống!");
    }

    // Kiểm tra định dạng email và phone
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,11}$/;

    if (!emailRegex.test(email)) {
      throw new Error("Email không đúng định dạng");
    }

    if (!phoneRegex.test(phone)) {
      throw new Error("Số điện thoại không đúng định dạng");
    }

    // Kiểm tra xem email đã tồn tại chưa
    let user = await userModel.findOne({ email: email });
    if (user) {
      throw new Error("Email đã tồn tại");
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    // Tạo mới user
    user = new userModel({
      email: email,
      password: password,
      name: name,
      phone: phone,
    });

    // Lưu người dùng
    const result = await user.save();

    // // Tạo mã xác nhận và gửi email
    // const verificationCode = Math.random().toString(36).substr(2, 8);
    // const subTitle = 'Xác nhận đăng ký tài khoản';
    // await sendEmail(email, verificationCode, subTitle, name); // Gửi email

    return result;
  } catch (error) {
    console.error("Register error: ", error.message);
    throw new Error("Đăng ký thất bại: " + error.message); // Cung cấp thông tin lỗi chi tiết
  }
};

// login

const login = async (email, password) => {
  try {
    // lấy user trong Database
    const user = await userModel.findOne({ email: email });
    if (!user) {
      throw new Error("Email không tồn tại");
    } else {
      // kiểm tra password
      // const check = user.password.toString() === password.toString();

      const check = bcrypt.compareSync(password, user.password);

      if (check) {
        console.log("Đăng nhập thành công:", user);
        // xóa filed password trc khi trả về
        delete user._doc.password;

        // //return = {
        //     _id: user._id;
        //     email: user.email;
        //     name: user.name;
        //     role: user.role;
        //     carts: usert.carts;

        // }
        return user;
      } // } else {
      //     return null;
      // }
    }
    return null;
  } catch (error) {
    console.log("Đăng nhập thất bại", error.message);
    throw new Error("Đăng nhập thất bại");
  }
};

//lấy người dùng mới tạo
const getNewUsers = async () => {
  try {
    const user = userModel.find().sort({ createdAt: -1 }).limit(10);
    return user;
  } catch (error) {
    console.log("Lấy danh sách người dùng thất bại", error.message);
    throw new Error("Lấy danh sách người dùng thất bại");
  }
};

//Lấy người dùng tạo trên 3 tháng
const getOldUsers = async () => {
  try {
    const ThreeMonthsAgo = new Date();
    ThreeMonthsAgo.setMonth(ThreeMonthsAgo.getMonth() - 3);

    const user = userModel.find({
      createdAt: { $lt: ThreeMonthsAgo }
    })
    return user;
  } catch (error) {
    console.log("Lấy danh sách người dùng thất bại", error.message);
    throw new Error("Lấy danh sách người dùng thất bại");
  }
};

const getProfile = async (id) => {
  try {
    const user = await userModel.findById(id).select('name email phone birthday bio gender')
    if (!user) {
      throw new Error("Không tim thấy user")
    }
    return user;
  } catch (error) {
    console.log("Lấy thông tin người dùng thất bại", error.message);
    throw new Error("Lấy thông tin người dùng thất bại");
  }
}


const deleteAccount = async (emailOrPhone) => {
  try {
    const result = await userModel.findOneAndDelete({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
    });

    if (!result) {
      return { message: "Tài khoản không tồn tại" };
    }

    console.log("Xóa tài khoản thành công:", result);
    return { message: "Tài khoản đã được xóa thành công" };
  } catch (error) {
    console.error("Xóa tài khoản thất bại:", error.message);
    throw new Error("Xóa tài khoản thất bại: " + error.message);
  }
};

const Profile = async (user, images) => {
  try {
    const userInDB = await userModel.findById(user);
    if (!userInDB) {
      throw new error("không tìm thấy user");
    }
  } catch (error) {

  }
}



const updateProfile = async (id, name, birthday, bio, gender) => {
  try {
    const userUD = await userModel.findById(id)

    if (!userUD) {
      throw new Error("Không tìm thấy user")

    }

    userUD.name = name || userUD.name;
    userUD.birthday = birthday || userUD.birthday;
    userUD.bio = bio || userUD.bio;
    userUD.gender = gender || userUD.gender;

    await userUD.save();

    return userUD;
  } catch (error) {
    console.log("Cập nhật thông tin người dùng thất bại", error.message);
    throw new Error("Cập nhật thông tin người dùng thất bại");
  }
}
const addAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Kiểm tra nếu không có userId trong params
    if (!userId) {
      return res.status(400).json({ error: 'userId không hợp lệ' });
    }

    // Kiểm tra tính hợp lệ của userId (ví dụ, kiểm tra ObjectId cho MongoDB)
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'userId không hợp lệ' });
    }

    const { houseNumber, alley, quarter, district, city, country } = req.body;

    // Tìm user với userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User không tồn tại' });
    }

    const newAddress = {
      houseNumber,
      alley,
      quarter,
      district,
      city,
      country,
      createdAt: new Date(),
      updatedAt: new Date(),
      available: true
    };

    // Thêm địa chỉ vào danh sách địa chỉ của người dùng
    user.address.push(newAddress);
    await user.save();

    return res.status(200).json({ message: 'Địa chỉ đã được thêm thành công', address: newAddress });
  } catch (error) {
    console.error('Thêm địa chỉ error:', error);
    return res.status(500).json({ error: `Thêm địa chỉ error: ${error.message}` });
  }
};

// lấy danh sách danh mục
const getAddress = async (userId) => {
  try {
    const userIndb = await userModel.findById(userId);
    if (!userIndb) {
      throw new Error("Không tìm thấy user");
    }

    // Trả về địa chỉ của người dùng
    return userIndb.address;
  } catch (error) {
    console.log("getAddress error: ", error.message); // sửa 'massage' thành 'message'
    throw new Error("Lấy địa chỉ thất bại");
  }
};
;



module.exports = {
  register,
  login,
  getNewUsers,
  getOldUsers,
  getProfile,
  updateProfile,
  deleteAccount,
  addAddress,
  getAddress
};
