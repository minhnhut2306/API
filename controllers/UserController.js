const { model } = require("mongoose");
const userModel = require("./UserModel");
const bcrypt = require("bcryptjs");
const { SendEmail } = require('../controllers/SendEmail');

// đăng ký
// const register_App = async (email, name, password, phone) => {
//   try {
//     //check email exists in db - select * from users where email = email
//     let user = await userModel.findOne({ email: email }); //phải sử dụng let
//     if (user) {
//       throw new Error("Email đã tồn tại");
//     }

//     //kiểm tra bỏ trống
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

//     //kiểm tra định dạng email, password
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;
//     const phoneRegex = /^[0-9]+$/;

//     if (!emailRegex.test(email)) {
//       throw new Error("Email không đúng định dạng");
//     }
//     // if (!passwordRegex.test(password)) {
//     //     throw new Error('Password không đúng định dạng')
//     // }
//     if (!phoneRegex.test(phone)) {
//       throw new Error("Số điện thoại không đúng đ��nh dạng");
//     }

//     //mã hóa password
//     //mã hóa password có nghĩa khi người dùng nhập vào 1 chuỗi,
//     //thì nó sẽ trả ra 1 đoạn mã khác
//     //ví dụ : password là 1 sẽ đc trả ra 1 chuỗi s8u87y6ttftfy76ty6ty78u8
//     //người khác cũng nhập là 1 đối vs tài khoản khác thì chuỗi mã hóa cũng sẽ khác,
//     //không giống chuỗi trước
//     const salt = bcrypt.genSaltSync(10); //thầy bảo doc nói nên để là 10, không nên để quá lớn
//     password = bcrypt.hashSync(password, salt);
//     //tạo mã code
//     // var code = Math.floor(Math.random() * 100000);
//     //create new user
//     user = new userModel({
//       email: email,
//       password: password,
//       name: name,
//       phone: phone,
//     });
//     //save user
//     const result = await user.save();
//     // //gửi email xác thực tài khoản
//     // setTimeout(async () => {
//     //     const data = {
//     //         email: email,
//     //         subject: `Xác thực tài khoản ${email}`,
//     //         content: html.html(name, code)
//     //     }
//     //     await sendMail(data);
//     // }, 0);
//     return result;
//   } catch (error) {
//     console.log("Register error: ", error.message);
//     throw new Error("Đăng kí thất bại");
//   }
// };

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

    // Tạo mã xác nhận và gửi email
    const verificationCode = Math.random().toString(36).substr(2, 8);
    const subTitle = 'Xác nhận đăng ký tài khoản';
    await sendEmail(email, verificationCode, subTitle, name); // Gửi email

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
    ThreeMonthsAgo.setMonth(ThreeMonthsAgo.getMonth()-3);

    const user = userModel.find({
      createdAt: {$lt: ThreeMonthsAgo}
    })
    return user;
  } catch (error) {
    console.log("Lấy danh sách người dùng thất bại", error.message);
    throw new Error("Lấy danh sách người dùng thất bại");
  }
};

module.exports = {
  register,
  login,
  getNewUsers,
  getOldUsers
};
