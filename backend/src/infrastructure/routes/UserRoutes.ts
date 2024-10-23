import { Router, Request, Response } from "express";
import { UserController } from "../controllers/UserController";

const router = Router();

router.delete("/:userName", (req: Request, res: Response) => UserController.deleteUser(req, res));
router.get("/:userName", (req: Request, res: Response) => UserController.getUser(req, res));
router.post("/register", (req: Request, res:Response) => UserController.registerUser(req, res));
router.post("/login", (req: Request, res: Response)=> UserController.loginUser(req, res));

export default router;