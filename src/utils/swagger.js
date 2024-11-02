const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API Documentation'
        },
        servers: [
            {
                url: 'http://localhost:9000',
                description: 'Local server'
            },
        ],
    },
    apis: ['../routes/*.js'], // Ruta a tus archivos de rutas
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;