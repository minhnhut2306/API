const nodemailer = require('nodemailer');
require('dotenv').config(); // Đảm bảo bạn đã cài dotenv để sử dụng biến môi trường

const SendEmail = async (receiveEmail, verificationCode, subTitle, name) => {
    console.log('Sending mail...');
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Sử dụng biến môi trường
            pass: process.env.EMAIL_PASS, // Sử dụng biến môi trường
        },
    });

    const mailOptions = {
        from: 'Duc Duy Shop', 
        to: receiveEmail,
        subject: subTitle,
        html: `
        <h2>Chào bạn ${name}</h2>
        <h5>Email: <strong>${receiveEmail}</strong></h5>
        <p>Bạn đã đăng ký tài khoản thành công.</p>`,
    };

    try {
        const info = await transporter.SendMail(mailOptions);
        console.log('Email sent: ', info.response);
    } catch (err) {
        console.error('Error sending email:', err);
        throw new Error('Could not send email');
    }
};

module.exports = SendEmail;
