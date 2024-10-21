import {Request, Response} from 'express';

// Middleware de manejo de errores
function errorHandler(err: any, req: Request, res: Response) {
    console.error(err.stack); // Imprime el error en la consola para depuración

    res.status(err.status || 500); // Retorna el código de estado HTTP, o 500 por defecto
    res.json({
        error: {
            message: err.message || 'Internal Server Error',
            status: err.status || 500
        }
    });
}

export default errorHandler;
