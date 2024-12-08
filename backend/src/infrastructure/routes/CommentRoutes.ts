import {NextFunction, Request, Response, Router} from "express";
import {CommentController} from "../controllers/CommentController";

const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({storage});

const router = Router();

router.post("/", (req: Request, res: Response, next: NextFunction) => CommentController.createComment(req, res, next));

export default router;