import {NextFunction, Request, Response, Router} from "express";
import {PostController} from "../controllers/PostController";

const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({storage});

const router = Router();

router.post("/", (req: Request, res: Response, next: NextFunction) => PostController.createPost(req, res, next));
router.post("/uploadImage", upload.single('image'), (req: Request, res: Response, next: NextFunction) => PostController.uploadImage(req, res, next));

router.get("/all/:userName", (req: Request, res: Response, next: NextFunction) => PostController.getAllPosts(req, res, next));
router.get("/:id", (req: Request, res: Response, next: NextFunction) => PostController.getPost(req, res, next));

router.put("/update/:postId", (req: Request, res: Response, next: NextFunction) => PostController.updatePost(req, res, next));
router.delete("/:postId", (req: Request, res: Response, next: NextFunction) => PostController.deletePost(req, res, next));

router.put("/like", (req: Request, res: Response, next: NextFunction) => PostController.addLike(req, res, next));
router.put("/dislike", (req: Request, res: Response, next: NextFunction) => PostController.addDislike(req, res, next));

export default router;
