const { model } = require("mongoose");
const userModel = require("./UserModel");
const bcrypt = require("bcryptjs");
const { sendSMS } = require("../routes/users");



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
    //check email
    let user = await userModel.findOne({ email: email }); // = select * from userModel Where email = email
    if (user) {
      throw new Error("Email đã tồn tại");
    }
    if (
      email == "" ||
      email == undefined ||
      name == "" ||
      name == undefined ||
      password == "" ||
      password == undefined ||
      phone == ""
    ) {
      throw new Error("Email hoặc password hoặc name không hợp lệ!");
    }
    // kiểm tra định dạng email, password
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;
    const phoneRegex = /^[0-9]{10,11}$/;

    if (!emailRegex.test(email)) {
      throw new Error("Email không đúng định dạng");
    }
    // if (!passwordRegex.test(password)) {
    //     throw new Error('Password không đúng định dạng')
    // }
    if (!phoneRegex.test(phone)) {
      throw new Error("Số điện thoại không đúng định dạng");
    }
    // mã hóa password
    const salt = bcrypt.genSaltSync(10);
    console.log(salt);
    password = bcrypt.hashSync(password, salt);
    // tạo mới user
    user = new userModel({
      email: email,
      password: password,
      name: name,
      phone: phone,
    });
    //save name
    const result = await user.save();

    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString(); // Mã gồm 4 chữ số
    const message = `Mã xác thực của bạn là: ${verificationCode}`;

    const sendSMS = async (to, message) => {
      try {
        const messageResponse = await client.messages.create({
          body: message,
          from: TWILIO_PHONE_NUMBER, // Số điện thoại Twilio của bạn
          to: to, // Số điện thoại người dùng đăng ký
        });
        console.log(`SMS sent: ${messageResponse.sid}`);
      } catch (error) {
        console.error("Error sending SMS:", error.message);
      }
    };

    // Gửi SMS
    await sendSMS(phone, message);
    // gửi email xác thực tk
    // setTimeout(async() => {
    //     const data = {
    //         email: email,
    //         subject: `Xác thực tài khoản ${email}`,
    //         content: html.html('Phát')
    //     }
    //     await sendMail(data);
    // }, 0);
    return result;
  } catch (error) {
    console.log("Register error: ", error.message);
    throw new Error("Đăng ký thất bại");
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
