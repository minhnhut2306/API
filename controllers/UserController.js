const { model } = require('mongoose');
const userModel = require('./UserModel');
const bcrypt = require('bcryptjs');

// đăng ký
const register_App = async (email, name, password, phone) => {
    try {
        //check email exists in db - select * from users where email = email
        let user = await userModel.findOne({ email: email });//phải sử dụng let
        if (user) {
            throw new Error('Email đã tồn tại');
        }

        //kiểm tra bỏ trống
        if (email == '' || email == undefined || name == '' || name == undefined || password == '' || password == undefined || phone == '') {
            throw new Error('Email hoặc password hoặc name không hợp lệ!')
        }

        //kiểm tra định dạng email, password
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;
        const phoneRegex = /^[0-9]+$/;

        if (!emailRegex.test(email)) {
            throw new Error('Email không đúng định dạng')
        }
        // if (!passwordRegex.test(password)) {
        //     throw new Error('Password không đúng định dạng')
        // }
        if (!phoneRegex.test(phone)) {
            throw new Error('Số điện thoại không đúng đ��nh dạng')
        }

        //mã hóa password
        //mã hóa password có nghĩa khi người dùng nhập vào 1 chuỗi,
        //thì nó sẽ trả ra 1 đoạn mã khác 
        //ví dụ : password là 1 sẽ đc trả ra 1 chuỗi s8u87y6ttftfy76ty6ty78u8
        //người khác cũng nhập là 1 đối vs tài khoản khác thì chuỗi mã hóa cũng sẽ khác,
        //không giống chuỗi trước
        const salt = bcrypt.genSaltSync(10);//thầy bảo doc nói nên để là 10, không nên để quá lớn
        password = bcrypt.hashSync(password, salt);
        //tạo mã code
        // var code = Math.floor(Math.random() * 100000);
        //create new user
        user = new userModel({
            email: email,
            password: password,
            name: name,
            phone: phone,

        });
        //save user
        const result = await user.save();
        // //gửi email xác thực tài khoản
        // setTimeout(async () => {
        //     const data = {
        //         email: email,
        //         subject: `Xác thực tài khoản ${email}`,
        //         content: html.html(name, code)
        //     }
        //     await sendMail(data);
        // }, 0);
        return result;
    } catch (error) {
        console.log('Register error: ', error.message);;
        throw new Error('Đăng kí thất bại')
    }
}
module.exports = {
    register_App,
    
}