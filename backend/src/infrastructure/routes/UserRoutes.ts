import {NextFunction, Request, Response, Router} from "express";
import {UserController} from "../controllers/UserController";

const router = Router();

router.put('/:userId', (req: Request, res: Response, next: NextFunction) => UserController.updateUser(req, res, next));
router.delete("/:userName", (req: Request, res: Response, next: NextFunction) => UserController.deleteUser(req, res, next));
router.get("/:userName", (req: Request, res: Response, next: NextFunction) => UserController.getUser(req, res, next));
router.post("/register", (req: Request, res: Response, next: NextFunction) => UserController.registerUser(req, res, next));

export default router;