const { model } = require("mongoose");
const userModel = require("./UserModel");
const CartModel = require("./CartModel");
const productModel = require("./ProductModel");
const bcrypt = require("bcryptjs");
const UserModel = require("./UserModel");
const mongoose = require("mongoose"); // Nhập mongoose


const { ObjectId } = require('mongodb'); 

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

    // Kiểm tra định dạng email, password và phone
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,11}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;
    if (!emailRegex.test(email)) {
      throw new Error("Email không đúng định dạng");
    }
    if (!passwordRegex.test(password)) {
      throw new Error("Password không đúng định dạng");
    }
    if (!phoneRegex.test(phone)) {
      throw new Error("Số điện thoại không đúng định dạng");
    }

    // Kiểm tra xem email đã tồn tại chưa
    let user = await userModel.findOne({ email: email });
    if (user) {
      throw new Error("Email đã tồn tại");
    }

    // Kiểm tra xem số điện thoại đã tồn tại chưa
    user = await userModel.findOne({ phone: phone });
    if (user) {
      throw new Error("Số điện thoại đã tồn tại");
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

    // Tạo mã xác nhận và gửi email (tùy chọn)
    const verificationCode = Math.random().toString(36).substr(2, 8);
    const subTitle = "Xác nhận đăng ký tài khoản";
    // await sendEmail(email, verificationCode, subTitle, name); // Gửi email (nếu cần)

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
      createdAt: { $lt: ThreeMonthsAgo },
    });
    return user;
  } catch (error) {
    console.log("Lấy danh sách người dùng thất bại", error.message);
    throw new Error("Lấy danh sách người dùng thất bại");
  }
};

const getProfile = async (id) => {
  try {
    const user = await userModel
      .findById(id)
      .select("name email phone birthday bio gender avatar");
    if (!user) {
      throw new Error("Không tim thấy user");
    }
    return user;
  } catch (error) {
    console.log("Lấy thông tin người dùng thất bại", error.message);
    throw new Error("Lấy thông tin người dùng thất bại");
  }
};

const deleteAccountById = async (userId) => {
  try {
    // Kiểm tra định dạng userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return { message: "UserId không hợp lệ" };
    }

    const result = await userModel.findByIdAndDelete(userId);

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

const updateProfile = async (id, name, birthday, bio, gender,avatar) => {
  try {
    const userUD = await userModel.findById(id);

    if (!userUD) {
      throw new Error("Không tìm thấy user");
    }

    userUD.name = name || userUD.name;
    userUD.birthday = birthday || userUD.birthday;
    userUD.bio = bio || userUD.bio;
    userUD.gender = gender || userUD.gender;
    userUD.avatar = avatar || userUD.avatar;

    await userUD.save();

    return userUD;
  } catch (error) {
    console.log("Cập nhật thông tin người dùng thất bại", error.message);
    throw new Error("Cập nhật thông tin người dùng thất bại");
  }
};

const addAddress = async (
  userId,
  user,
  houseNumber,
  alley,
  quarter,
  district,
  city,
  country
) => {
  try {
    console.log("User data:", user);
    const userIndb = await userModel.findById(userId);
    if (!userIndb) {
      throw new Error("Người dùng không tồn tại");
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(user.phone)) {
      throw new Error("Số điện thoại không hợp lệ");
    }

    const newAddress = {
      userId,
      user: { name: user.name, phone: user.phone },
      houseNumber,
      alley,
      quarter,
      district,
      city,
      country,
    };

    userIndb.address.push(newAddress);

    await userIndb.save();
    return newAddress;
  } catch (error) {
    console.error("addAddress error:", error);
    throw error;
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


const getCartById = async (userId) => {
  try {

    const userIndb = await userModel.findById(userId);
    if (!userIndb) {
      throw new Error("Không tìm thấy người dùng");
    }

    const cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      throw new Error("Giỏ hàng không tồn tại cho người dùng này");
    }

    return cart;
  } catch (error) {
    console.error("Lỗi khi lấy cart:", error.message); 
    throw new Error("Có lỗi xảy ra trong quá trình lấy cart.");
  }
};

const addCart = async (userId, products) => {
  try {
    // Kiểm tra xem user có tồn tại trong DB không
    const userInDB = await userModel.findById(userId);
    if (!userInDB) {
      throw new Error("User không tồn tại");
    }

    // Kiểm tra xem products có phải là mảng không
    if (!Array.isArray(products)) {
      throw new Error("Products phải là một mảng");
    }

    let productsInCart = [];
    let total = 0;

    for (let item of products) {
      // Kiểm tra từng sản phẩm trong giỏ hàng
      const product = await productModel.findById(item._id);
      if (!product) {
        throw new Error(`Sản phẩm không tồn tại: ${item._id}`);
      }

      if (item.quantity > product.quantity) {
        throw new Error(
          `Số lượng vượt quá số lượng có trong kho cho sản phẩm: ${product.name}`
        );
      }

      const productItem = {
        _id: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: item.quantity,
        images: product.images,
      };

      productsInCart.push(productItem);
      total += product.price * item.quantity;
    }

    // Tạo mới giỏ hàng
    const cart = new CartModel({
      user: userInDB._id, // Tham chiếu đến _id của User
      products: productsInCart,
      total,
    });

    const savedCart = await cart.save();

    // Cập nhật cart vào user
    userInDB.cart = savedCart._id;
    await userInDB.save();

    return savedCart;
  } catch (error) {
    console.log("Add to cart error:", error.message);
    throw new Error("Thêm vào giỏ hàng thất bại: " + error.message);
  }
};

const changePassword = async (id, password, newPassword) => {
  if (!id || !password || !newPassword) {
    throw new Error("Vui lòng nhập đầy đủ thông tin");
  }

  // Tìm user theo id
  const user = await userModel.findById(id);
  if (!user) {
    throw new Error("User không tồn tại");
  }

  // So sánh mật khẩu cũ với mật khẩu đã mã hóa trong DB
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    throw new Error("Mật khẩu hiện tại không đúng");
  }

  // Mã hóa mật khẩu mới
  const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

  // Cập nhật mật khẩu mới vào DB
  user.password = hashedNewPassword;
  await user.save();

  console.log("Đổi mật khẩu thành công");
  return { message: "Đổi mật khẩu thành công" };
};

const getAddressById = async (addressId) => {
  try {
    const user = await UserModel.findOne({ 'address._id': addressId }).populate('address.userId');

    if (!user) {
      return { status: 404, message: 'Không tìm thấy địa chỉ' };
    }
    const address = user.address.find(addr => addr._id.toString() === addressId);
    if (!address) {
      return { status: 404, message: 'Không tìm thấy địa chỉ' };
    }
    const addressData = {
      _id: address._id,
      user: address.user,
      houseNumber: address.houseNumber,
      alley: address.alley,
      quarter: address.quarter,
      district: address.district,
      city: address.city,
      country: address.country,
      available: address.available,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt
    };

    return { status: 200, data: addressData };
  } catch (error) {
    console.error('Error fetching address: ', error.message);
    return { status: 500, message: 'Lỗi server: ' + error.message };
  }
};
const updateAddress = async (
  userId,
  addressId,
  user,
  houseNumber,
  alley,
  quarter,
  district,
  city,
  country
) => {
  try {
    const userIndb = await userModel.findById(userId);
    if (!userIndb) {
      throw new Error("Người dùng không tồn tại");
    }
    console.log("User Addresses:", userIndb.address);
    const address = userIndb.address.find((address) => address._id.toString() === addressId.toString());
    
    if (!address) {
      userIndb.address.push({
        _id: addressId,
        user: { name: user.name, phone: user.phone },
        houseNumber,
        alley,
        quarter,
        district,
        city,
        country,
        userId,
      });
    } else {
      address.user = { name: user.name, phone: user.phone };
      address.houseNumber = houseNumber;
      address.alley = alley;
      address.quarter = quarter;
      address.district = district;
      address.city = city;
      address.country = country;
    }

    await userIndb.save();
    return address || userIndb.address[userIndb.address.length - 1]; 
  } catch (error) {
    console.error("updateAddress error:", error.message);
    throw error;
  }
};



const deleteAddress = async (userId, addressId) => {
  try {
    const userIndb = await userModel.findById(userId);
    if (!userIndb) {
      throw new Error("Người dùng không tồn tại");
    }

    userIndb.address = userIndb.address.filter(address => address._id.toString() !== addressId);

    await userIndb.save();

    return { message: "Địa chỉ đã được xóa" };
  } catch (error) {
    console.error("deleteAddress error:", error);
    throw error;
  }
};

const updateUser = async(userId,phone)=>{
  try {
    const userInDb = await userModel.findById(userId);
    if (!userInDb) {
      throw new Error("Người dùng không tồn tại");
    }
    const phoneRegex = /^[0-9]{10,11}$/;
   
    if (!phoneRegex.test(phone)) {
      throw new Error("Số điện thoại không đúng định dạng");
    }
    userInDb.phone = phone;
    await userInDb.save();
    return userInDb;
    
  } catch (error) {
    console.error("updateUser error:", error);
    throw error;
  }

}


const deleteAccount = async (emailOrPhone) => {
  try {
    const result = await userModel.findOneAndDelete({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
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
module.exports = {
  register,
  login,
  getNewUsers,
  getOldUsers,
  getProfile,
  updateProfile,
  deleteAccountById,
  addAddress,
  getAddress,
  getCartById,
  addCart,
  changePassword,
  deleteAddress,
  getAddressById,
  updateAddress,
  updateUser,
  deleteAccount
};
