import {NextFunction, Request, Response, Router} from "express";
import {CommentController} from "../controllers/CommentController";


const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({storage});

const router = Router();

router.post("/", (req: Request, res: Response, next: NextFunction) => CommentController.createComment(req, res, next));

router.get("/", (req: Request, res: Response, next: NextFunction) => CommentController.getAllComments(req, res, next));
router.get("/:id", (req: Request, res: Response, next: NextFunction) => CommentController.getComment(req, res, next));
router.get("/post/:postId", (req: Request, res: Response, next: NextFunction) => CommentController.getCommentsByPost(req, res, next));
router.get("/review/:reviewId", (req: Request, res: Response, next: NextFunction) => CommentController.getCommentsByReview(req, res, next));
router.get("/comment/:commentId", (req: Request, res: Response, next: NextFunction) => CommentController.getCommentsByComment(req, res, next));

router.put("/update/:commentId", (req: Request, res: Response, next: NextFunction) => CommentController.updateComment(req, res, next));
router.delete("/:commentId", (req: Request, res: Response, next: NextFunction) => CommentController.deleteComment(req, res, next));

export default router;