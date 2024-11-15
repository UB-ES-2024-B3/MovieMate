import express, {Request} from 'express';
import cors from "cors";
import "reflect-metadata"
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "../../docs/openapi.json";
import userRoutes from "../infrastructure/routes/UserRoutes";
import errorHandler from "../infrastructure/config/ErrorHandler";
import movieRoutes from "../infrastructure/routes/MovieRoutes";

const app = express();

app.use(express.json());
app.use(cors<Request>({
    origin: true, // This disables the 'Access-Control-Allow-Origin' header
}));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput));
app.use("/user", userRoutes);
app.use("/movie", movieRoutes)

// Este middleware de manejo de errores debe ir al final
app.use(errorHandler);
export default app;