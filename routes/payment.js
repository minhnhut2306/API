const express = require('express');
const PayOS = require("@payos/node");
const router = express.Router();
const PayOsModel = require("../controllers/payosModule");

const payos = new PayOS(
    'ecc3ea3f-9dd7-4f09-9032-8a756bda896c',
    'a6fd27ac-e980-4207-9ea6-20d8f7699f39',
    '4b550b9acc1e453288f2476cfd57b4426c6095019e00d9e47cc6dc32a7077f61'
);

const YOUR_DOMAIN = 'https://server-smoky-kappa.vercel.app/';

router.post('/create-payment-link', async (req, res) => {
    const {amount, orderId, description, user } = req.body;
    const orderCode = Number(orderId);

    if (!orderId || isNaN(orderCode) || orderCode <= 0) {
        return res.status(400).json({ message: 'orderId phải là số dương.' });
    }
    const qrAmount = 10000;
    const order = {
        amount: qrAmount,
        description: description || 'Không có mô tả',
        orderCode: orderCode,
        returnUrl: `${YOUR_DOMAIN}/payment/success?orderId=${orderCode}`,
        cancelUrl: `${YOUR_DOMAIN}/payment/cancel?orderId=${orderCode}`,
        redirectUrl: `${YOUR_DOMAIN}/payment/success?orderId=${orderCode}`, 
    };

    try {
        console.log('Chi tiết đơn hàng:', order);
        const paymentLink = await payos.createPaymentLink(order);
        console.log('Link thanh toán đã được tạo:', paymentLink);
        if (paymentLink && typeof paymentLink === 'object' && paymentLink.checkoutUrl) {
            const payment = new PayOsModel({
                amount: amount,
                orderId: orderCode.toString(),
                description: description || 'Không có mô tả',
                redirectUrl: order.redirectUrl,
                status: 1,
                user: user
            });
            await payment.save();
            res.status(201).json({ paymentLink: paymentLink.checkoutUrl });
        }
    } catch (error) {
        console.error('Lỗi khi tạo link thanh toán:', error);
        res.status(500).json({ message: 'Tạo link thanh toán thất bại', error: error.message });
    }
});

router.get('/success', async (req, res) => {
    console.log('Nhận yêu cầu từ /success');
    const { orderId } = req.query;

    if (!orderId) {
        console.error('Không có orderId được cung cấp');
        return res.status(400).send("orderId là bắt buộc.");
    }

    try {
        console.log('Kiểm tra thanh toán với orderId:', orderId);
        const payment = await PayOsModel.findOne({ orderId: orderId });

        if (payment) {
            console.log('Đã tìm thấy thanh toán:', payment);
            payment.status = 0;
            await payment.save();
            console.log('Cập nhật thanh toán thành công:', payment);
            res.status(200).send(`Thanh toán thành công với số tiền: ${payment.amount} VNĐ.`);
        } else {
            console.error('Không tìm thấy thanh toán cho orderId:', orderId);
            res.status(404).send("Không tìm thấy đơn hàng.");
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái thanh toán:', error);
        res.status(500).send("Có lỗi xảy ra khi cập nhật trạng thái thanh toán.");
    }
});

router.get('/cancel', async (req, res) => {
    console.log('Nhận yêu cầu hủy:', req.query); 
    const { orderId } = req.query;
    if (!orderId) {
        console.error('Không có orderId được cung cấp');
        return res.status(400).send("orderId là bắt buộc.");
    }

    try {
        const payment = await PayOsModel.findOne({ orderId: orderId });
        console.log('Đã tìm thấy thanh toán:', payment);

        if (payment) {
            payment.status = 2;
            await payment.save();
            console.log('Cập nhật trạng thái thanh toán thành công: Đã hủy', payment);
            res.status(200).send("Thanh toán đã bị hủy.");
        } else {
            console.error('Không tìm thấy thanh toán cho orderId:', orderId);
            res.status(404).send("Không tìm thấy đơn hàng.");
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái thanh toán:', error);
        res.status(500).send("Có lỗi xảy ra khi cập nhật trạng thái thanh toán.");
    }
});

module.exports = router;
