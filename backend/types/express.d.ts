import * as express from 'express';
import { Multer } from 'multer';

declare global {
    namespace Express {
        interface Request {
            file?: Multer.File;  // Definimos la propiedad file opcional
        }
    }
}
