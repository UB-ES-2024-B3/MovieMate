const swaggerAutogen = require('swagger-autogen');

// const outputFile = process.env['OPENAPI_PATH'];
const outputFile = "./docs/openapi.json";
const hostUrl = process.env['HOST'];
const portUrl = process.env['PORT'];

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
            password: "Password123",
            gender: "Female"
        }
    }
};

const endpointsFiles = ['src/main/app.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc);
