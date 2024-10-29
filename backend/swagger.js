const swaggerAutogen = require('swagger-autogen');

// const outputFile = process.env['OPENAPI_PATH'];
const outputFile = "./docs/openapi.json";
const hostUrl = process.env['HOST'] || 'localhost';
const portUrl = process.env['PORT'] || '3000';

const doc = {
    info: {
        title: 'ES-B3: MovieMate',
        description: 'Documentation for ES-B3: MovieMate endpoints',
        version: '1.0.0',
    },
    host: `${hostUrl}:${portUrl}`,
    serve: [
        {
            url: `${hostUrl}:${portUrl}`,
            variables: {
                port: {
                    default: 3000
                }
            }
        }
    ],
    basePath: '/',
    schemes: ['http'],
    definitions: {
        // Definición del esquema para crear un usuario
        CreateUser: {
            userName: "carmen",
            email: "carmen@example.com",
            birthDate: "1990-01-01",
            password: "A1b#cd",
            gender: "Female"
        },

        UpdateUser: {
            userName: "updatedCarmen",
            email: "updatedCarmen@example.com",
            password: "NewPass1#"
        }

    }
};

const endpointsFiles = ['src/main/app.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc);
