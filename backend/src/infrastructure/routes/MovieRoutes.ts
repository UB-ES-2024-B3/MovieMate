import {NextFunction, Request, Response, Router} from "express";
import {MovieController} from "../controllers/MovieController";

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
router.get("/filters/actors", (req: Request, res: Response, next: NextFunction) => MovieController.getAllActors(req, res, next));
router.get("/filters/directors", (req: Request, res: Response, next: NextFunction) => MovieController.getAllDirectors(req, res, next));
router.get("/filters/genres", (req: Request, res: Response, next: NextFunction) => MovieController.getAllGenres(req, res, next));
router.get("/filters/classifications", (req: Request, res: Response, next: NextFunction) => MovieController.getAllClassifications(req, res, next));
router.get("/filters/premiere-years", (req: Request, res: Response, next: NextFunction) => MovieController.getAllPremiereYears(req, res, next));
router.get("/filters/duration-range", (req: Request, res: Response, next: NextFunction) => MovieController.getDurationRange(req, res, next));
router.get("/filters/score-range", (req: Request, res: Response, next: NextFunction) => MovieController.getScoreRange(req, res, next));
router.get("/filters/total-reviews-range", (req: Request, res: Response, next: NextFunction) => MovieController.getTotalReviewsRange(req, res, next));

export default router;