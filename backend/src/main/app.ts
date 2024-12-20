import express, {Request} from 'express';
import cors from "cors";
import "reflect-metadata"
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "../../docs/openapi.json";
import userRoutes from "../infrastructure/routes/UserRoutes";
import movieRoutes from "../infrastructure/routes/MovieRoutes";
import reviewRoutes from "../infrastructure/routes/ReviewRoutes";
import errorHandler from "../infrastructure/config/ErrorHandler";
import postRoutes from "../infrastructure/routes/PostRoutes";
import commentRoutes from "../infrastructure/routes/CommentRoutes";

const app = express();

app.use(express.json());
app.use(cors<Request>({
    origin: '*',
}));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput));
app.use("/user", userRoutes);
app.use("/movie", movieRoutes);
app.use("/review", reviewRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);

// Este middleware de manejo de errores debe ir al final
app.use(errorHandler);
export default app;