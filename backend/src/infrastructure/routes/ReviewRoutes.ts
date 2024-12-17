import {NextFunction, Request, Response, Router} from "express";
import {ReviewController} from "../controllers/ReviewController";
import {PostController} from "../controllers/PostController";

const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({storage});

const router = Router();

router.post("/", (req: Request, res: Response, next: NextFunction) => {
    ReviewController.createReview(req, res, next);
});

router.delete("/:reviewId", (req: Request, res: Response, next: NextFunction) => ReviewController.deleteReview(req, res, next));

router.get("/", (req: Request, res: Response, next: NextFunction) => ReviewController.getAllReviews(req, res, next));
router.get("/:id", (req: Request, res: Response, next: NextFunction) => ReviewController.getReview(req, res, next));
router.put("/like", (req: Request, res: Response, next: NextFunction) => ReviewController.addLike(req, res, next));
router.put("/dislike", (req: Request, res: Response, next: NextFunction) => ReviewController.addDislike(req, res, next));


export default router;