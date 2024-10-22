import {NextFunction, Request, Response, Router} from "express";
import {UserController} from "../controllers/UserController";

const router = Router();

router.delete("/:userName", (req: Request, res: Response, next: NextFunction) => UserController.deleteUser(req, res, next));
router.get("/:userName", (req: Request, res: Response, next: NextFunction) => UserController.getUser(req, res, next));

/**
 * @swagger
 * /users:
 *   post:
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/CreateUser'
 */
router.post("/register", (req: Request, res: Response, next: NextFunction) => UserController.registerUser(req, res, next));

export default router;