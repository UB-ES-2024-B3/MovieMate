import {NextFunction, Request, Response, Router} from "express";
import {ReviewController} from "../controllers/ReviewController";

const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({storage});

const router = Router();

router.post("/", (req: Request, res: Response, next: NextFunction) => {
    ReviewController.createReview(req, res, next);
});

router.get("/", (req: Request, res: Response, next: NextFunction) => ReviewController.getAllReviews(req, res, next));
router.get("/:id", (req: Request, res: Response, next: NextFunction) => ReviewController.getReview(req, res, next));

export default router;