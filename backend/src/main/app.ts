import express, {Request} from 'express';
import cors from "cors";
import "reflect-metadata"
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "../../docs/openapi.json";
import userRoutes from "../infrastructure/routes/UserRoutes";

const app = express();

app.use(express.json());
app.use(cors<Request>({
    origin: false, // This disables the 'Access-Control-Allow-Origin' header
}));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput));
app.use("/user", userRoutes);

export default app;