import {NextFunction, Request, Response, Router} from "express";
import {UserController} from "../controllers/UserController";

const router = Router();

router.delete("/:userName", (req: Request, res: Response) => UserController.deleteUser(req, res));
router.get("/:userName", (req: Request, res: Response) => UserController.getUser(req, res));
router.post("/register", (req: Request, res: Response, next: NextFunction) => UserController.registerUser(req, res, next));

export default router;