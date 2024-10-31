const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API Documentation for your Node.js project',
        },
        tags: [
            { name: "User", description: "User-related operations" },

          ],
        servers: [
            { url: 'https://api-h89c.onrender.com/', description: 'Production server' },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);


module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        swaggerOptions: {
            docExpansion: 'none',
            defaultModelsExpandDepth: -1  
        }
    }));
};


/**
 * @swagger
 * /users/delete-account:
 *   delete:
 *     summary: Xóa tài khoản người dùng
 *     description: Xóa tài khoản dựa trên email hoặc số điện thoại
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailOrPhone:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Tài khoản đã được xóa thành công
 *       400:
 *         description: Thiếu thông tin cần thiết
 *       500:
 *         description: Lỗi máy chủ
 */

