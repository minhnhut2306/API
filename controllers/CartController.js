const CartModel = require('./CartModel');
const ObjectId = require('mongoose').Types.ObjectId;
const AppConstants = require('../helpers/AppConstants');
const UserModel = require('./UserModel');


//________________________________________APP_______________________________________

//thêm cart
const addCart = async (user, products) => {
    try {
        // user: user id của người mua
        // products: mảng id của sản phẩm và số lượng mua
        const userInDB = await UserModel.findById(user);
        if (!userInDB) {
            throw new Error('User not found');
        }
        console.log('user', user);
        // kiểm tra products có phải là mảng hay không
        console.log('Products', products);
        if (!Array.isArray(products)) {
            throw new Error('Products must be an array');
        }
        let productsInCart = [];
        let total = 0;
        for (let index = 0; index < products.length; index++) {//thầy dùng mảng để chắc chắn tất cả các sp đều được duyệt qua
            const item = products[index];
            const product = await ProductModel.findById(item._id);
            if (!product) {
                throw new Error('Product not found');
            }
            // nếu số lượng lớn hơn số lượng tồn kho
            if (item.quantity > product.quantity) {
                throw new Error('Product out of stock');
            }
            const productItem = {
                _id: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
            };
            productsInCart.push(productItem);
            total += product.price * item.quantity;
        }
        // tạo giỏ hàng mới
        const cart = new CartModel({
            user: { _id: userInDB._id, name: userInDB.name },
            products: productsInCart,
            total,
        });
        const result = await cart.save();


        setTimeout(async () => {
            // chạy ngầm cập nhật số lượng tồn kho của sản phẩm
            for (let index = 0; index < products.length; index++) {
                const item = products[index];
                const product = await ProductModel.findById(item._id);
                product.quantity -= item.quantity;
                await product.save();
            }
            // cập nhật lịch sử mua hàng của người dùng

            //....sửa lại để đáp ứng giao diện history
            for (let index = 0; index < products.length; index++) {
                const item = products[index];
                const product = await ProductModel.findById(item._id);
                let newItem = {
                    _id: item._id,
                    name: product.name,
                    quantity: item.quantity,
                    status: result.status,
                    images: product.images,
                    date: Date.now()
                }
                userInDB.carts.push(newItem);
            }
            // let item = {
            //     _id: result._id,
            //     date: result.date,
            //     total: result.total,
            //     status: result.status,
            //     //....Thêm 2 thuộc tính để hiển thị lấy cart từ user hiển thị lên history
            //     quantity: result.quantity,
            //     name: result.name
            // };
            // userInDB.carts.push(item);
            await userInDB.save();
        }, 0);


        return result;
    } catch (error) {
        console.log(error);
        throw new Error('Add to cart failed');
    }
}



module.exports = {
    addCart
}