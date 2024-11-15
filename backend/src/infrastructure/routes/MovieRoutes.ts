import {NextFunction, Request, Response, Router} from "express";
import {MovieController} from "../controllers/MovieController";

const router = Router();

router.get("/:title", (req: Request, res: Response, next: NextFunction) => MovieController.getMovie(req, res, next));

export default router;