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
