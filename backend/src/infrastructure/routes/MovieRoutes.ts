import {NextFunction, Request, Response, Router} from "express";
import {MovieController} from "../controllers/MovieController";
import {UserController} from "../controllers/UserController";

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => MovieController.getAllMovies(req, res, next));

router.post("/create", (req: Request, res: Response, next: NextFunction) => MovieController.createMovie(req, res, next));
router.delete("/:movieId", (req: Request, res: Response, next: NextFunction) => MovieController.deleteMovie(req, res, next));

router.get("/search", (req: Request, res: Response, next: NextFunction) => MovieController.search(req, res, next));

router.get("/top10", (req: Request, res: Response, next: NextFunction) => MovieController.getTop10(req, res, next));

router.get("/:title", (req: Request, res: Response, next: NextFunction) => MovieController.getMovie(req, res, next));

router.put("/score", (req: Request, res: Response, next: NextFunction) => MovieController.scoreMovie(req, res, next));

router.put("/favorites", (req: Request, res: Response, next: NextFunction) => MovieController.addFavorites(req, res, next));

router.post("/get-filtered", (req: Request, res: Response, next: NextFunction) => MovieController.getMoviesFiltered(req, res, next));

export default router;