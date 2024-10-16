const { Types } = require('mongoose');

//kiểm tra lỗi cho cả 1 sp, sử dụng ở thêm và sửa sản phẩm
const validateProduct = async (req, res, next) => {
    try {
        const { name, price, quantity, images, category, description } = req.body;
        if (!name.trim() || !isNaN(name)) {
            throw new Error('Name is invalid')
        }
        if (!price || isNaN(price) || price <= 0) {
            throw new Error('Price is invalid')
        }
        if (!quantity || isNaN(quantity) || quantity <= 0) {
            throw new Error('Quantity is invalid')
        }
        if (!images || !Array.isArray(images) || images.length === 0) {
            throw new Error('Images is invalid')
        }
        if (!category) {
            throw new Error('Category is invalid')
        }
        if (!description || !isNaN(description)) {
            throw new Error('Category is invalid')
        }
        // nếu mọi thứ ok thì chuyển sang middleware tiếp theo
        next();
    } catch (error) {
        console.log('Validate product error', error);
        return res.status(500).json({ status: false, data: error.message });
    }
}

//kiểm tra lỗi cho get sp
const validateLimitPage = async (req, res, next) => {
    try {
        const { limit, page } = req.query;
        if (!limit || isNaN(limit) || limit <= 0) {
            throw new Error('Limit is invalid')
        }
        if (!page || isNaN(page) || page <= 0) {
            throw new Error('Page is invalid')
        }
        // nếu mọi thứ ok thì chuyển sang middleware tiếp theo
        next();
    } catch (error) {
        console.log('Validate limit and page error', error);
        return res.status(500).json({ status: false, data: error.message });
    }
}
//kiểm tra lỗi cho get sp
const validateMinMax = async (req, res, next) => {
    try {
        const { min, max } = req.query;
        if (!min || isNaN(min) || min <= 0) {
            throw new Error('Min is invalid')
        }
        if (!max || isNaN(max) || max <= 0) {
            throw new Error('Max is invalid')
        }
        // nếu mọi thứ ok thì chuyển sang middleware tiếp theo
        next();
    } catch (error) {
        console.log('Validate min and max error', error);
        return res.status(500).json({ status: false, data: error.message });
    }
}

//kiểm tra username
const validateUserName = async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name.trim() || !isNaN(name)) {
            throw new Error('Username is invalid')
        }
        // nếu mọi thứ ok thì chuyển sang middleware tiếp theo
        next();
    } catch (error) {
        console.log('Validate username error: ', error.message);
        return res.status(500).json({ status: false, data: error.message });
    }
}


//kiểm tra email
const validateEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim() || !emailRegex.test(email)) {
            throw new Error('Email is invalid')
        }
        // nếu mọi thứ ok thì chuyển sang middleware tiếp theo
        next();
    } catch (error) {
        console.log('Validate email error: ', error.message);
        return res.status(500).json({ status: false, data: error.message });
    }
}
//kiểm tra password
const validatePassword = async (req, res, next) => {
    try {
        const { password } = req.body;
        //password có ít nhất 8 chữ số, chữ viết hoa, số, kí tự đặc biệt
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;

        if (!password.trim() || !passwordRegex.test(password)) {
            throw new Error('Password is invalid')
        }
        // nếu mọi thứ ok thì chuyển sang middleware tiếp theo
        next();
    } catch (error) {
        console.log('Validate password error: ', error.message);
        return res.status(500).json({ status: false, data: error.message });
    }
}


module.exports = {
    validateProduct,
    validateLimitPage,
    validateUserName,
    validateEmail,
    validatePassword,
    validateMinMax,
}