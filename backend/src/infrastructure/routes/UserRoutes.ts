import { Router, Request, Response } from "express";
import { UserController } from "../controllers/UserController";
import {UserService} from "../../application/services/UserService";

const router = Router();

router.delete("/:userName", (req: Request, res: Response) => UserController.deleteUser(req, res));
router.get("/:userName", (req: Request, res: Response) => UserController.getUser(req, res));

export default router;