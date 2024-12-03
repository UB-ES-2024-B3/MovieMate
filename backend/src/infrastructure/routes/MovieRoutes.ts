import {NextFunction, Request, Response, Router} from "express";
import {MovieController} from "../controllers/MovieController";

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => MovieController.getAllMovies(req, res, next));

router.get("/search", (req: Request, res: Response, next: NextFunction) => MovieController.search(req, res, next));

router.get("/top10", (req: Request, res: Response, next: NextFunction) => MovieController.getTop10(req, res, next));

router.get("/:title", (req: Request, res: Response, next: NextFunction) => MovieController.getMovie(req, res, next));

router.put("/score",  (req: Request, res: Response, next: NextFunction) => MovieController.scoreMovie(req, res, next));

router.put("/favorites", (req: Request, res: Response, next: NextFunction) => MovieController.addFavorites(req, res, next));
export default router;