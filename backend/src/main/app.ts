import express, {Request} from 'express';
import cors from "cors";
import "reflect-metadata"

const app = express();
const port = 3000; //poner como variable de entorno cuando lo deployemos

app.use(express.json());
app.use(cors<Request>({
    origin: false, // This disables the 'Access-Control-Allow-Origin' header
}));

export default app;