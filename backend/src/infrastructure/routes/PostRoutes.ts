import {NextFunction, Request, Response, Router} from "express";
import {PostController} from "../controllers/PostController";

const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({storage});

const router = Router();

router.post("/", (req: Request, res: Response, next: NextFunction) => PostController.createPost(req, res, next));
router.post("/uploadImage", upload.single('image'), (req: Request, res: Response, next: NextFunction) => PostController.uploadImage(req, res, next));

export default router;