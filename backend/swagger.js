const swaggerAutogen = require('swagger-autogen');

// const outputFile = process.env['OPENAPI_PATH'];
const outputFile = "./docs/openapi.json"
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
    }
};

const endpointsFiles = ['src/main/app.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc);
