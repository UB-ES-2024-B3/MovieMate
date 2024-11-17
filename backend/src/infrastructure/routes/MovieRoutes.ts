import {NextFunction, Request, Response, Router} from "express";
import {MovieController} from "../controllers/MovieController";

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => MovieController.getAllMovies(req, res, next));

router.get("/top10", (req: Request, res: Response, next: NextFunction) => MovieController.getTop10(req, res, next));

router.get("/:title", (req: Request, res: Response, next: NextFunction) => MovieController.getMovie(req, res, next));

export default router;